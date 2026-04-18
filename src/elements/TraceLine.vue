<template>
  <div class="track-container">
    <div class="track-meta">
      <span>总里程：20 km</span>
      <span>数据轮询：每 10 秒更新</span>
    </div>

    <div
      class="track-line"
      v-for="(car, index) in trackCars"
      :key="car.vehicleCode || car.name || index"
    >
      <span class="track-label" :class="index === 0 ? 'left' : 'right'">
        {{ car.vehicleCode || car.name || `车辆${index + 1}` }}
      </span>
      <div class="track-path">
        <div class="track-bg"></div>
        <div
          class="track-marker"
          :style="{ left: car.positionPct + '%' , background: car.color }"
          :title="car.currentPositionText || car.location || ''"
        >
          <span class="marker-label">{{ car.positionKm }}km</span>
        </div>
      </div>
    </div>

    <div v-if="trackCars.length === 0" class="track-empty">
      正在获取车辆位置数据...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const TOTAL_KM = 20
let pollTimer = null
const trackCars = ref([])

function parseDistanceKm(car) {
  const fields = [
    'distanceKm',
    'distance',
    'currentDistance',
    'positionKm',
    'mile',
    'mileage'
  ]
  for (const key of fields) {
    const value = car[key]
    if (value !== undefined && value !== null) {
      const num = Number(String(value).replace(/[^0-9.\-]/g, ''))
      if (!Number.isNaN(num)) {
        return num
      }
    }
  }

  const text = String(car.currentPositionText || car.location || car.position || '')
  const match = text.match(/(\d+(?:\.\d+)?)\s*km/i)
  if (match) {
    return Number(match[1])
  }

  const match2 = text.match(/距离.*?(\d+(?:\.\d+)?)/)
  if (match2) {
    return Number(match2[1])
  }

  return 0
}

function normalizeCars(cars = []) {
  return cars.map((car, index) => {
    const distanceKm = parseDistanceKm(car)
    const positionPct = Math.min(100, Math.max(0, (distanceKm / TOTAL_KM) * 100))
    return {
      ...car,
      positionKm: distanceKm.toFixed(1),
      positionPct,
      currentPositionText: car.currentPositionText || car.location || car.position || '',
      color: index === 0 ? '#ff4d4f' : '#25f1ff'
    }
  })
}

async function fetchTrackData() {
  try {
    const res = await getDashboardInit('MONTH', 'TODAY')
    const cars = res?.data?.rightPanel?.vehicleCards || res?.data?.vehicleCards || []
    trackCars.value = normalizeCars(cars)
  } catch (err) {
    console.warn('获取轨道车辆数据失败', err)
    trackCars.value = []
  }
}

function startPolling() {
  fetchTrackData()
  pollTimer = window.setInterval(fetchTrackData, 10000)
}

onMounted(() => {
  startPolling()
})

onBeforeUnmount(() => {
  if (pollTimer) {
    window.clearInterval(pollTimer)
  }
})
</script>

<style scoped>
.track-container {
  width: 100%;
  padding: 12px 14px;
  background: rgba(3, 18, 40, 0.95);
  border: 1px solid rgba(0, 245, 255, 0.16);
  border-radius: 10px;
  box-shadow: inset 0 0 12px rgba(0, 245, 255, 0.08);
}

.track-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(176, 236, 255, 0.75);
}

.track-line {
  display: flex;
  align-items: center;
  position: relative;
  margin: 10px 0;
  height: 24px;
}

.track-label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  z-index: 2;
}

.track-label.left {
  left: 0;
}

.track-label.right {
  right: 0;
}

.track-path {
  width: 100%;
  height: 8px;
  margin: 0 100px;
  position: relative;
}

.track-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 245, 255, 0.18), rgba(0, 102, 255, 0.25), rgba(0, 245, 255, 0.18));
  border-radius: 4px;
  box-shadow: 0 0 14px rgba(0, 245, 255, 0.12);
}

.track-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
}

.marker-label {
  position: absolute;
  top: -22px;
  white-space: nowrap;
  font-size: 10px;
  color: #c0e4ff;
}

.track-empty {
  padding: 16px;
  text-align: center;
  color: rgba(192, 228, 255, 0.65);
  font-size: 14px;
}
</style>
