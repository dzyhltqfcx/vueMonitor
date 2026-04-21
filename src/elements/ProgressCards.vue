<template>
  <div class="progress-cards-wrapper">
    <el-card class="progress-card" v-for="(item, index) in progressList" :key="index">
      <div class="card-content">
        <div class="title">{{ item.label }}</div>
        <div class="main-value">{{ item.value }}{{ item.unit }}</div>

        <!-- 进度条 -->
        <div class="progress-bar-wrap">
          <div class="progress-bar" :style="{ width: item.percent + '%' }"></div>
        </div>

        <div class="progress-row">
          <span class="progress-label">进度</span>
          <span class="progress-percent">{{ item.percent }}%</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const progressList = ref([
  { label: '已完工', value: 0, unit: 'km', percent: 0 },
  { label: '正在运行车辆', value: 0, unit: '辆', percent: 0 },
  { label: '在线传感器', value: 0, unit: '个', percent: 0 }
])

let refreshTimer = null

function normalizePercent(value) {
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  return Math.max(0, Math.min(100, num))
}

async function fetchProgressData() {
  try {
    const res = await getDashboardInit()
    const centerPanel = res?.data?.centerPanel || res?.centerPanel
    if (!centerPanel) return

    const tunnelProgress = centerPanel.tunnelProgress || {}
    const vehicleRuntimeStats = centerPanel.vehicleRuntimeStats || {}
    const sensorRuntimeStats = centerPanel.sensorRuntimeStats || {}

    progressList.value = [
      {
        label: '已完工',
        value: tunnelProgress.completedDistanceKm ?? 0,
        unit: 'km',
        percent: normalizePercent(tunnelProgress.progressPercent ?? 0)
      },
      {
        label: '正在运行车辆',
        value: vehicleRuntimeStats.activeVehicleCount ?? 0,
        unit: '辆',
        percent: normalizePercent(vehicleRuntimeStats.normalPercent ?? 0)
      },
      {
        label: '在线传感器',
        value: sensorRuntimeStats.onlineCount ?? 0,
        unit: '个',
        percent: normalizePercent(sensorRuntimeStats.onlinePercent ?? 0)
      }
    ]
  } catch (err) {
    console.error('进度卡片数据加载失败', err)
  }
}

onMounted(() => {
  fetchProgressData()
  refreshTimer = setInterval(fetchProgressData, 15000)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
/* 🔥 关键：防止溢出 + 无滚动条 */
.progress-cards-wrapper {
  display: flex;
  gap: 16px;        /* 缩小一点间距，避免溢出 */
  width: 100%;
  flex-wrap: nowrap;
  box-sizing: border-box;
  overflow: hidden; /* 永远不出现滚动条 */
}

.progress-card {
  flex: 1;
  height: 100%;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.title {
  font-size: 16px;
  color: #e6f7ff;
  font-weight: 600;
}

.main-value {
  font-size: 36px;
  font-weight: 700;
  color: #ffb766;
}

/* 进度条 */
.progress-bar-wrap {
  width: 80%;
  height: 6px;
  background: rgba(0, 245, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #269fff);
  border-radius: 3px;
  box-shadow: 0 0 8px #00f5ff;
  transition: width 0.5s ease;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  width: 80%;
}
.progress-label {
  font-size: 14px;
  color: #e6f7ff;
}
.progress-percent {
  font-size: 14px;
  color: #00f5ff;
  font-weight: 700;
}

:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
