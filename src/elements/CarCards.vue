<template>
  <div class="car-cards-wrapper">
    <template v-if="carItems.length">
      <el-card class="car-card" v-for="car in carItems" :key="car.vehicleCode || car.name">
        <div class="car-card-body">
          <div class="car-title">{{ car.vehicleCode }} {{ car.vehicleTypeLabel ? `(${car.vehicleTypeLabel})` : '' }}</div>

          <div class="speed-box">
            <div class="speed-text">平均时速</div>
            <div class="speed-num">{{ car.averageSpeedKmh }} km/h</div>
            <div 
              class="car-status" 
              :class="{ running: car.runningStatus === 'RUNNING', parking: car.runningStatus === 'AUTO_PARKING' }"
            >
              {{ car.runningStatusLabel }}
            </div>
          </div>

          <div class="car-location">
            当前位置：{{ car.currentPositionText }}
          </div>

          <div class="sensor-list">
            <div class="sensor-item">
              <span>传感器总数</span>
              <span>{{ car.totalSensorCount }}</span>
            </div>
            <div class="sensor-item">
              <span>在线</span>
              <span>{{ car.onlineSensorCount }}</span>
            </div>
            <div class="sensor-item warning">
              <span>异常</span>
              <span>{{ car.abnormalSensorCount }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </template>
    <div v-else class="empty-tip">暂无车辆数据</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentCars: {
    type: Array,
    default: () => []
  }
})

const statusLabels = {
  RUNNING: '行驶中',
  AUTO_PARKING: '自动泊车',
  STOPPED: '已停止',
  ERROR: '异常'
}

const vehicleTypeLabels = {
  PATROL: '巡检车',
  MAINTENANCE: '维护车'
}

const carItems = computed(() => {
  return props.currentCars.map(car => {
    const runningStatus = car.runningStatus || (car.state === '行驶中' ? 'RUNNING' : car.state === '自动泊车' ? 'AUTO_PARKING' : 'UNKNOWN')
    return {
      ...car,
      vehicleCode: car.vehicleCode || car.name || '',
      vehicleTypeLabel: vehicleTypeLabels[car.vehicleType] || car.vehicleType || '',
      averageSpeedKmh: car.averageSpeedKmh ?? car.speed ?? 0,
      currentPositionText: car.currentPositionText || car.location || '',
      totalSensorCount: car.totalSensorCount ?? car.sensors ?? 0,
      onlineSensorCount: car.onlineSensorCount ?? car.online ?? 0,
      abnormalSensorCount: car.abnormalSensorCount ?? car.abnormal ?? 0,
      runningStatus,
      runningStatusLabel: statusLabels[runningStatus] || car.runningStatusLabel || car.state || '未知状态'
    }
  })
})
</script>

<style scoped>
/* 横向并排布局 */
.car-cards-wrapper {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.car-card {
  flex: 1;
  min-width: 280px;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  color: #c0e4ff;
}
.car-card-body {
  padding: 16px;
}
.car-title {
  font-size: 16px;
  font-weight: 600;
  color: #00f5ff;
  margin-bottom: 10px;
}
.speed-box {
  text-align: center;
  margin: 10px 0;
}
.speed-text {
  font-size: 14px;
  color: #e6f7ff;
}
.speed-num {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 4px 0;
}
.car-status {
  font-size: 14px;
}
.car-status.running {
  color: #00f5ff;
}
.car-status.parking {
  color: #ff7d00;
}
.car-location {
  font-size: 14px;
  color: #ffb766;
  padding: 8px 0;
  border-top: 1px solid rgba(0, 245, 255, 0.1);
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
  margin: 10px 0;
}
.sensor-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sensor-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.sensor-item.warning span:nth-child(2) {
  color: #ff4d4f;
  font-weight: 700;
}
.empty-tip {
  width: 100%;
  color: #c0e4ff;
  text-align: center;
  padding: 30px 0;
  border: 1px dashed rgba(0, 245, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 245, 255, 0.03);
}
:deep(.el-card__body) {
  padding: 0 !important;
}
</style>
