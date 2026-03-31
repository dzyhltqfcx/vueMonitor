<template>
  <div class="pressure-panel">
    <header class="panel-head">
      <span class="panel-title">气压情况统计</span>
      <span class="panel-deco" aria-hidden="true">++++</span>
    </header>

    <div class="toolbar">
      <div class="btn-group right">
        <button
          v-for="item in ranges"
          :key="item.value"
          type="button"
          class="pill"
          :class="{ active: currentRange === item.value }"
          @click="currentRange = item.value"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="chart-stack">
      <div ref="pressureChart" class="chart-host" />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const CYAN = '#00F5FF'
const TEXT = '#c0e4ff'
const GRID = 'rgba(110, 183, 255, 0.15)'

const ranges = [
  { label: '今天', value: 'day' },
  { label: '近一周', value: 'week' },
  { label: '近一月', value: 'month' }
]

const currentRange = ref('day')
const pressureChart = ref(null)
const chart = shallowRef(null)

// API数据状态
const apiData = ref(null)
const loading = ref(false)

const dataMap = {
  day: {
    x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    y: [1013, 1011, 1009, 1010, 1012, 1011]
  },
  week: {
    x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    y: [1010, 1009, 1008, 1007, 1009, 1011, 1010]
  },
  month: {
    x: ['1号', '5号', '10号', '15号', '20号', '25号', '30号'],
    y: [1008, 1009, 1010, 1011, 1010, 1009, 1008]
  }
}

// 获取API数据或回退到默认数据
function getChartData(rangeKey) {
  if (apiData.value?.pressure) {
    const pressureData = apiData.value.pressure
    if (Array.isArray(pressureData) && pressureData.length > 0) {
      let data, labels
      if (rangeKey === 'day' && pressureData.length >= 6) {
        data = pressureData.slice(0, 6).map(item => item.value || item.pressure || 0)
        labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
      } else if (rangeKey === 'week' && pressureData.length >= 7) {
        data = pressureData.slice(0, 7).map(item => item.value || item.pressure || 0)
        labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      } else if (rangeKey === 'month' && pressureData.length >= 7) {
        data = pressureData.slice(0, 7).map(item => item.value || item.pressure || 0)
        labels = ['1号', '5号', '10号', '15号', '20号', '25号', '30号']
      }

      if (data && labels) {
        return { x: labels, y: data }
      }
    }
  }

  // 回退到默认数据
  return dataMap[rangeKey]
}

function ensureChart() {
  if (!pressureChart.value) return null
  if (!chart.value) {
    chart.value = echarts.init(pressureChart.value, null, { renderer: 'canvas' })
  }
  return chart.value
}

function buildOption(rangeKey) {
  const { x, y } = getChartData(rangeKey)
  return {
    color: [CYAN],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(0,245,255,0.35)' } },
      backgroundColor: 'rgba(5, 25, 50, 0.92)',
      borderColor: 'rgba(0, 245, 255, 0.35)',
      textStyle: { color: '#e8f4ff' }
    },
    grid: {
      left: 52,
      right: 28,
      top: 24,
      bottom: 44
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x,
      axisLine: { lineStyle: { color: '#6eb7ff' } },
      axisLabel: {
        color: TEXT,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '气压 hPa',
      nameTextStyle: { color: TEXT, fontSize: 11 },
      axisLine: { lineStyle: { color: CYAN } },
      axisLabel: { color: TEXT },
      splitLine: { lineStyle: { color: GRID } }
    },
    series: [
      {
        name: '气压',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        data: y,
        lineStyle: {
          width: 2,
          color: CYAN,
          type: 'dashed'
        },
        itemStyle: {
          color: CYAN,
          borderWidth: 0
        }
      }
    ]
  }
}

function renderChart() {
  const inst = ensureChart()
  if (!inst) return
  inst.setOption(buildOption(currentRange.value), true)
  inst.resize()
}

function onResize() {
  chart.value?.resize()
}

// 加载API数据
async function loadData() {
  try {
    loading.value = true
    const res = await getDashboardInit()
    apiData.value = res
    console.log('气压数据加载成功:', res)
  } catch (error) {
    console.error('气压数据加载失败:', error)
    // 失败时使用默认数据
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  renderChart()
  window.addEventListener('resize', onResize)
})

watch(currentRange, () => {
  renderChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  chart.value?.dispose()
  chart.value = null
})
</script>

<style scoped>
.pressure-panel {
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
  justify-content: flex-end;
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
</style>
