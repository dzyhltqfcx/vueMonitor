<template>
  <div class="temp-panel">
    <header class="panel-head">
      <span class="panel-title">温湿度情况统计</span>
      <span class="panel-deco" aria-hidden="true">++++</span>
    </header>

    <div class="toolbar">
      <div class="btn-group left">
        <button
          v-for="m in metricTabs"
          :key="m.value"
          type="button"
          class="pill"
          :class="{ active: metric === m.value }"
          @click="metric = m.value"
        >
          {{ m.label }}
        </button>
      </div>
      <div class="btn-group right">
        <button
          v-for="r in rangeTabs"
          :key="r.value"
          type="button"
          class="pill"
          :class="{ active: rangeMode === r.value }"
          @click="rangeMode = r.value"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <div class="chart-stack">
      <div ref="chartHost" class="chart-host" />
      <div class="chart-footer">
        <button type="button" class="detail-btn" @click="openDetail">详细</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-show="detailOpen" class="detail-mask" @click.self="closeDetail">
        <div class="detail-dialog" role="dialog" aria-modal="true" aria-label="温湿度详细曲线">
          <header class="detail-head">
            <span class="detail-title">温湿度详细曲线</span>
            <button type="button" class="detail-close" aria-label="关闭" @click="closeDetail">×</button>
          </header>
          <div ref="chartDetailHost" class="chart-detail-host" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const CYAN = '#00F5FF'
const AMBER = '#ffcb6b'
const TEXT = '#c0e4ff'
const GRID = 'rgba(110, 183, 255, 0.15)'

/** 主图横坐标点数（均分整段区间） */
const SPARSE_POINT_TARGET = 8

const metricTabs = [
  { label: '空气温湿度', value: 'air' },
  { label: '温度', value: 'temp' }
]

const rangeTabs = [
  { label: '今天', value: 'day' },
  { label: '近一周', value: 'week' },
  { label: '近一月', value: 'month' }
]

const metric = ref('air')
const rangeMode = ref('day')
const chartHost = ref(null)
const chart = shallowRef(null)
const chartDetailHost = ref(null)
const chartDetail = shallowRef(null)
const detailOpen = ref(false)

// API数据状态
const apiData = ref(null)
const loading = ref(false)

function wave(seed, i, len = 1) {
  const x = (i / Math.max(len - 1, 1)) * Math.PI * 2
  return Math.sin(x * 1.3 + seed) * 0.5 + Math.sin(x * 0.7 + seed * 0.3) * 0.3
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

/** 完整时间轴（详细图用） */
const denseTimeSpec = computed(() => {
  const now = new Date()
  if (rangeMode.value === 'day') {
    const labels = []
    for (let h = 0; h < 24; h++) {
      labels.push(`${pad2(h)}:00`)
    }
    return { labels, len: 24 }
  }
  if (rangeMode.value === 'week') {
    const labels = []
    for (let d = 6; d >= 0; d--) {
      const t = new Date(now)
      t.setDate(t.getDate() - d)
      labels.push(`${t.getMonth() + 1}/${t.getDate()}`)
    }
    return { labels, len: 7 }
  }
  const labels = []
  for (let d = 29; d >= 0; d--) {
    const t = new Date(now)
    t.setDate(t.getDate() - d)
    labels.push(`${t.getMonth() + 1}/${t.getDate()}`)
  }
  return { labels, len: 30 }
})

/** 在 [0, n-1] 上均分取点（约 8 个，且不超过原始点数） */
function sparseIndices(n) {
  if (n <= 0) return []
  const k = Math.min(SPARSE_POINT_TARGET, n)
  if (k === 1) return [0]
  const idx = []
  for (let i = 0; i < k; i++) {
    idx.push(Math.round((i * (n - 1)) / (k - 1)))
  }
  return [...new Set(idx)]
}

function pickByIndices(arr, indices) {
  return indices.map((i) => arr[i])
}

const denseSeries = computed(() => {
  const { labels, len } = denseTimeSpec.value
  const temps = genTempSeries(len, 1)
  const humidity = genHumiditySeries(len, 2)
  return { labels, temps, humidity }
})

const sparseSeries = computed(() => {
  const { labels, temps, humidity } = denseSeries.value
  const n = labels.length
  const ix = sparseIndices(n)
  return {
    labels: pickByIndices(labels, ix),
    temps: pickByIndices(temps, ix),
    humidity: pickByIndices(humidity, ix)
  }
})

function genTempSeries(len, seed = 1) {
  // 如果有API数据，使用API数据
  if (apiData.value?.temperature) {
    const tempData = apiData.value.temperature
    if (Array.isArray(tempData) && tempData.length > 0) {
      // 根据rangeMode调整数据长度
      if (rangeMode.value === 'day' && tempData.length >= 24) {
        return tempData.slice(0, 24).map(item => item.value || item.temp || 0)
      } else if (rangeMode.value === 'week' && tempData.length >= 7) {
        return tempData.slice(0, 7).map(item => item.value || item.temp || 0)
      } else if (rangeMode.value === 'month' && tempData.length >= 30) {
        return tempData.slice(0, 30).map(item => item.value || item.temp || 0)
      }
    }
  }

  // 回退到模拟数据
  const base = rangeMode.value === 'day' ? 22 : rangeMode.value === 'week' ? 21 : 20
  const amp = rangeMode.value === 'day' ? 4 : 5
  return Array.from({ length: len }, (_, i) => {
    return Math.round((base + wave(seed, i, len) * amp + (i / len) * 0.8) * 10) / 10
  })
}

function genHumiditySeries(len, seed = 2) {
  // 如果有API数据，使用API数据
  if (apiData.value?.humidity) {
    const humidityData = apiData.value.humidity
    if (Array.isArray(humidityData) && humidityData.length > 0) {
      // 根据rangeMode调整数据长度
      if (rangeMode.value === 'day' && humidityData.length >= 24) {
        return humidityData.slice(0, 24).map(item => item.value || item.humidity || 0)
      } else if (rangeMode.value === 'week' && humidityData.length >= 7) {
        return humidityData.slice(0, 7).map(item => item.value || item.humidity || 0)
      } else if (rangeMode.value === 'month' && humidityData.length >= 30) {
        return humidityData.slice(0, 30).map(item => item.value || item.humidity || 0)
      }
    }
  }

  // 回退到模拟数据
  const base = rangeMode.value === 'day' ? 55 : 58
  const amp = rangeMode.value === 'day' ? 12 : 15
  return Array.from({ length: len }, (_, i) => {
    return Math.round(Math.min(95, Math.max(25, base + wave(seed, i, len) * amp)))
  })
}

function solidLineSeries(name, data, yAxisIndex, color) {
  return {
    name,
    type: 'line',
    smooth: false,
    step: false,
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 8,
    yAxisIndex,
    data,
    lineStyle: { width: 2, color, type: 'solid' },
    itemStyle: {
      color,
      borderWidth: 0,
      borderColor: 'transparent'
    },
    emphasis: {
      scale: 1.15,
      itemStyle: { borderWidth: 0, color }
    }
  }
}

function buildChartOption(payload) {
  const { labels, temps, humidity, isAir, compactX } = payload
  const len = labels.length

  const yAxis = isAir
    ? [
        {
          type: 'value',
          name: '温度 °C',
          nameTextStyle: { color: TEXT, fontSize: 11 },
          axisLine: { lineStyle: { color: CYAN } },
          axisLabel: { color: TEXT },
          splitLine: { lineStyle: { color: GRID } }
        },
        {
          type: 'value',
          name: '湿度 %RH',
          nameTextStyle: { color: TEXT, fontSize: 11 },
          axisLine: { lineStyle: { color: AMBER } },
          axisLabel: { color: TEXT },
          splitLine: { show: false },
          min: 0,
          max: 100
        }
      ]
    : [
        {
          type: 'value',
          name: '温度 °C',
          nameTextStyle: { color: TEXT, fontSize: 11 },
          axisLine: { lineStyle: { color: CYAN } },
          axisLabel: { color: TEXT },
          splitLine: { lineStyle: { color: GRID } }
        }
      ]

  const series = isAir
    ? [
        solidLineSeries('温度', temps, 0, CYAN),
        solidLineSeries('湿度', humidity, 1, AMBER)
      ]
    : [solidLineSeries('温度', temps, 0, CYAN)]

  return {
    color: [CYAN, AMBER],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,245,255,0.35)' } },
      backgroundColor: 'rgba(5, 25, 50, 0.92)',
      borderColor: 'rgba(0, 245, 255, 0.35)',
      textStyle: { color: '#e8f4ff' }
    },
    legend: {
      show: isAir,
      top: 0,
      right: 12,
      textStyle: { color: TEXT, fontSize: 11 },
      itemWidth: 18,
      itemHeight: 8
    },
    grid: {
      left: 52,
      right: isAir ? 52 : 28,
      top: isAir ? 36 : 28,
      bottom: compactX ? 52 : 44
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: '#6eb7ff' } },
      axisLabel: {
        color: TEXT,
        rotate: compactX ? 40 : 0,
        fontSize: 10
      }
    },
    yAxis,
    series
  }
}

function ensureMainChart() {
  if (!chartHost.value) return null
  if (!chart.value) {
    chart.value = echarts.init(chartHost.value, null, { renderer: 'canvas' })
  }
  return chart.value
}

function renderMain() {
  const inst = ensureMainChart()
  if (!inst) return
  const { labels, temps, humidity } = sparseSeries.value
  const isAir = metric.value === 'air'
  inst.setOption(
    buildChartOption({
      labels,
      temps,
      humidity,
      isAir,
      compactX: false
    }),
    true
  )
  inst.resize()
}

function ensureDetailChart() {
  if (!chartDetailHost.value) return null
  if (!chartDetail.value) {
    chartDetail.value = echarts.init(chartDetailHost.value, null, { renderer: 'canvas' })
  }
  return chartDetail.value
}

function renderDetail() {
  if (!detailOpen.value) return
  const inst = ensureDetailChart()
  if (!inst) return
  const { labels, temps, humidity } = denseSeries.value
  const isAir = metric.value === 'air'
  inst.setOption(
    buildChartOption({
      labels,
      temps,
      humidity,
      isAir,
      compactX: labels.length > 14
    }),
    true
  )
  inst.resize()
}

function openDetail() {
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
}

function onResize() {
  chart.value?.resize()
  if (detailOpen.value) {
    chartDetail.value?.resize()
  }
}

// 加载API数据
async function loadData() {
  try {
    loading.value = true
    const res = await getDashboardInit()
    apiData.value = res
    console.log('温度数据加载成功:', res)
  } catch (error) {
    console.error('温度数据加载失败:', error)
    // 失败时使用模拟数据
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  renderMain()
  window.addEventListener('resize', onResize)
})

watch([metric, rangeMode], () => {
  renderMain()
  if (detailOpen.value) {
    nextTick(renderDetail)
  }
})

watch(detailOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    nextTick(() => renderDetail())
  } else {
    document.body.style.overflow = ''
    chartDetail.value?.dispose()
    chartDetail.value = null
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  document.body.style.overflow = ''
  chart.value?.dispose()
  chart.value = null
  chartDetail.value?.dispose()
  chartDetail.value = null
})
</script>

<style scoped>
.temp-panel {
  background: rgba(5, 35, 65, 0.85);
  border: 1px solid rgba(0, 245, 255, 0.35);
  border-radius: 8px;
  padding: 12px 14px 14px;
  color: #e8f4ff;
  box-shadow: 0 0 12px rgba(0, 120, 180, 0.15);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
}

.panel-title {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
}

.panel-deco {
  font-size: 11px;
  color: rgba(0, 245, 255, 0.55);
  letter-spacing: 1px;
  user-select: none;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-group.right {
  margin-left: auto;
}

.pill {
  cursor: pointer;
  border: 1px solid rgba(0, 245, 255, 0.35);
  background: rgba(2, 18, 40, 0.6);
  color: #c0e4ff;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 4px;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.pill:hover {
  border-color: rgba(0, 245, 255, 0.65);
  color: #fff;
}

.pill.active {
  background: rgba(0, 245, 255, 0.18);
  border-color: #00f5ff;
  color: #fff;
  font-weight: 600;
}

.chart-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chart-host {
  width: 100%;
  min-height: 260px;
  height: 260px;
}

.chart-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  cursor: pointer;
  border: 1px solid rgba(0, 245, 255, 0.45);
  background: rgba(0, 245, 255, 0.12);
  color: #e8f4ff;
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 4px;
  font-weight: 600;
}

.detail-btn:hover {
  background: rgba(0, 245, 255, 0.22);
  border-color: #00f5ff;
}

.detail-mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 8, 20, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.detail-dialog {
  width: min(960px, 96vw);
  max-height: 90vh;
  background: rgba(5, 35, 65, 0.97);
  border: 1px solid rgba(0, 245, 255, 0.45);
  border-radius: 10px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.25);
}

.detail-title {
  font-weight: 700;
  font-size: 15px;
}

.detail-close {
  cursor: pointer;
  border: none;
  background: transparent;
  color: #c0e4ff;
  font-size: 22px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
}

.detail-close:hover {
  color: #fff;
  background: rgba(0, 245, 255, 0.15);
}

.chart-detail-host {
  width: 100%;
  height: min(420px, 70vh);
  min-height: 360px;
}
</style>
