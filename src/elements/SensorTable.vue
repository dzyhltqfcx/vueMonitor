<template>
  <div ref="panelRef" class="sensor-panel">
    <header class="panel-head">
      <span class="panel-title">传感器情况统计</span>
      <span class="panel-deco" aria-hidden="true">++++</span>
    </header>

    <div class="sensor-grid">
      <article v-for="(row, index) in rows" :key="`${row.name}-${index}`" class="sensor-block">
        <div class="block-head">
          <span class="sensor-name">{{ row.name }}</span>
          <span class="sensor-pct">{{ row.pct }}%</span>
        </div>
        <div class="block-body">
          <div class="donut-col">
            <div class="donut-wrap">
              <div
                class="echart-host"
                :ref="(el) => bindChartHost(el, index)"
              />
              <div class="donut-center" aria-hidden="true">
                <span v-html="centerIcons[index % centerIcons.length]" />
              </div>
            </div>
            <div class="donut-ratios">
              <div class="ratio-row">
                <span class="ratio-dot ratio-online" />
                <span class="ratio-text">在线 {{ row.onlinePct }}%</span>
              </div>
              <div class="ratio-row">
                <span class="ratio-dot ratio-offline" />
                <span class="ratio-text">离线 {{ row.offlinePct }}%</span>
              </div>
            </div>
          </div>
          <div class="stats-col">
            <div class="stat-line">
              <span class="stat-label">在线</span>
              <span class="stat-num stat-online">{{ row.online }}</span>
            </div>
            <div class="stat-line">
              <span class="stat-label">离线</span>
              <span class="stat-num stat-offline">{{ row.offline }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getDashboardInit } from '@/apis/sensors/dashboard'

/** 与 .donut-wrap 一致，初始化时若父级尚未算出宽高，ECharts 会得到 0×0 空白画布 */
const DONUT_PX = 120

const CYAN = '#00F5FF'
const MAGENTA = '#FF3B6B'
const TRACK = 'rgba(255, 255, 255, 0.12)'
const TRACK_BG = 'rgba(255, 255, 255, 0.06)'

const PLACEHOLDER_STATS = [
  { name: '深度相机', normal: 489, abnormal: 29 },
  { name: '激光雷达', normal: 521, abnormal: 11 },
  { name: '压力传感器', normal: 489, abnormal: 29 },
  { name: '位移传感器', normal: 521, abnormal: 11 }
]

const internalSensorStats = ref([...PLACEHOLDER_STATS])

const props = defineProps({
  /** 每项：name；在线数用 normal 或 online；离线数用 abnormal 或 offline */
  sensorStats: {
    type: Array,
    default: null
  }
})

/** 小块中心装饰图标（内联 SVG） */
const centerIcons = [
  '<svg class="cen-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8h4l2-2h4l2 2h4v10H4V8z" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="13" r="2.5" stroke="currentColor" stroke-width="1.2"/></svg>',
  '<svg class="cen-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/></svg>',
  '<svg class="cen-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18V8l12-2v10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 14h12M9 11v6M15 10v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  '<svg class="cen-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19h14M7 19V8l4-3 4 3v11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12h6M9 15h6" stroke="currentColor" stroke-width="1.2"/></svg>'
]

function mapData(src) {
  return src.map((s) => {
    const online = Number(s.normal ?? s.online ?? 0)
    const offline = Number(s.abnormal ?? s.offline ?? 0)
    const total = online + offline
    const pct = total > 0 ? Math.round((online / total) * 100) : 0
    const onlinePct = total > 0 ? Math.round((online / total) * 100) : 0
    const offlinePct = total > 0 ? 100 - onlinePct : 0
    return {
      name: s.name ?? '—',
      online,
      offline,
      pct,
      onlinePct,
      offlinePct
    }
  })
}

const rows = computed(() => {
  const hasInternal = Array.isArray(internalSensorStats.value) && internalSensorStats.value.length > 0
  const hasProps = Array.isArray(props.sensorStats) && props.sensorStats.length > 0
  if (hasInternal) {
    return mapData(internalSensorStats.value)
  }
  if (hasProps) {
    return mapData(props.sensorStats)
  }
  return mapData(PLACEHOLDER_STATS)
})

/** 左侧环状图：底层满环作轨道，上层按在线/离线分割显示占比 */
function buildOption(online, offline) {
  const total = online + offline
  const inner = '45%'
  const outer = '72%'

  const trackSeries = {
    type: 'pie',
    radius: [inner, outer],
    z: 1,
    silent: true,
    clockwise: true,
    startAngle: 90,
    label: { show: false },
    labelLine: { show: false },
    emphasis: { disabled: true },
    data: [{ value: 1, itemStyle: { color: TRACK_BG } }]
  }

  let dataSeries
  if (total <= 0) {
    dataSeries = {
      type: 'pie',
      radius: [inner, outer],
      z: 2,
      silent: true,
      clockwise: true,
      startAngle: 90,
      label: { show: false },
      labelLine: { show: false },
      emphasis: { disabled: true },
      data: [{ value: 1, itemStyle: { color: TRACK } }]
    }
  } else {
    dataSeries = {
      type: 'pie',
      radius: [inner, outer],
      z: 2,
      clockwise: true,
      startAngle: 90,
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      emphasis: { disabled: true },
      data: [
        { value: online, name: '在线', itemStyle: { color: CYAN } },
        { value: offline, name: '离线', itemStyle: { color: MAGENTA } }
      ]
    }
  }

  return {
    animation: false,
    tooltip: { show: false },
    series: [trackSeries, dataSeries]
  }
}

const panelRef = ref(null)
const chartInstances = []
let panelResizeObserver = null

function disposeAllCharts() {
  chartInstances.forEach((inst) => inst?.dispose())
  chartInstances.length = 0
}

/** 布局完成后再测量，避免首屏容器宽高为 0 */
function scheduleResizeSoon() {
  nextTick(() => {
    requestAnimationFrame(() => {
      resizeCharts()
      requestAnimationFrame(() => resizeCharts())
    })
  })
}

function bindChartHost(el, index) {
  if (!el) {
    // 在 v-for 重新渲染期间，不要主动销毁实例，避免 chart 被误删
    return
  }
  const existing = chartInstances[index]
  if (existing && existing.getDom() !== el) {
    existing.dispose()
    chartInstances[index] = null
  }
  if (!chartInstances[index]) {
    const w = el.clientWidth || DONUT_PX
    const h = el.clientHeight || DONUT_PX
    chartInstances[index] = echarts.init(el, null, {
      renderer: 'canvas',
      width: w || DONUT_PX,
      height: h || DONUT_PX
    })
  }
  const r = rows.value[index]
  if (r) {
    chartInstances[index].setOption(buildOption(r.online, r.offline), true)
    scheduleResizeSoon()
  }
}

function resizeCharts() {
  const opts = { width: DONUT_PX, height: DONUT_PX }
  chartInstances.forEach((inst) => {
    if (!inst) return
    inst.resize(opts)
  })
}

function onWindowResize() {
  resizeCharts()
}

async function loadSensorData() {
  try {
    const res = await getDashboardInit('MONTH', 'TODAY')
    console.log('原始返回:', res)

    const apiSensorStats = res?.data?.data?.leftPanel?.sensorStats

    if (Array.isArray(apiSensorStats) && apiSensorStats.length > 0) {
      internalSensorStats.value = apiSensorStats.map((item) => ({
        name: item.sensorName ?? item.sensorType ?? '未知传感器',
        normal: Number(item.onlineCount ?? 0),
        abnormal: Number(item.offlineCount ?? 0)
      }))
    } else {
      console.warn('后端返回的 sensorStats 为空或格式不对，使用占位数据', apiSensorStats)
      internalSensorStats.value = PLACEHOLDER_STATS
    }

    console.log('sensor stats loaded', internalSensorStats.value)
  } catch (err) {
    console.warn('传感器数据加载失败', err)
    internalSensorStats.value = PLACEHOLDER_STATS
  }
}

watch(
  rows,
  () => {
    nextTick(() => {
      rows.value.forEach((r, i) => {
        if (chartInstances[i]) {
          chartInstances[i].setOption(buildOption(r.online, r.offline), true)
        }
      })
      scheduleResizeSoon()
    })
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('resize', onWindowResize)
  scheduleResizeSoon()
  loadSensorData()
  if (typeof ResizeObserver !== 'undefined' && panelRef.value) {
    panelResizeObserver = new ResizeObserver(() => {
      resizeCharts()
    })
    panelResizeObserver.observe(panelRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  panelResizeObserver?.disconnect()
  panelResizeObserver = null
  disposeAllCharts()
})
</script>

<style scoped>
.sensor-panel {
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
  margin-bottom: 12px;
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

.sensor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sensor-block {
  border: 1px solid rgba(15, 120, 160, 0.45);
  border-radius: 6px;
  padding: 8px 10px 10px;
  background: rgba(2, 18, 40, 0.55);
}

.block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sensor-name {
  font-size: 13px;
  font-weight: 600;
}

.sensor-pct {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.block-body {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 110px;
}

.donut-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  max-width: 108px;
}

.donut-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.donut-ratios {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  line-height: 1.25;
}

.ratio-row {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.ratio-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ratio-dot.ratio-online {
  background: #00f5ff;
  box-shadow: 0 0 4px rgba(0, 245, 255, 0.5);
}

.ratio-dot.ratio-offline {
  background: #ff3b6b;
  box-shadow: 0 0 4px rgba(255, 59, 107, 0.45);
}

.ratio-text {
  color: rgba(232, 244, 255, 0.92);
  font-variant-numeric: tabular-nums;
}

.echart-host {
  width: 100%;
  height: 100%;
  min-width: 120px;
  min-height: 120px;
  box-sizing: border-box;
}

.donut-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-center :deep(.cen-svg) {
  width: 26px;
  height: 26px;
  display: block;
}

.stats-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.stat-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}

.stat-label {
  color: rgba(232, 244, 255, 0.85);
}

.stat-num {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.stat-online {
  color: #00f5ff;
}

.stat-offline {
  color: #ff3b6b;
}
</style>
