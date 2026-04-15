<template>
  <div class="car-cards-wrapper">
    <el-card class="car-card" v-for="(car, idx) in currentCars" :key="idx">
      <div class="car-card-body">
        <div class="car-title">{{ car.name }}</div>

        <div class="speed-box">
          <div class="speed-text">平均时速</div>
          <div class="speed-num">{{ car.speed }} km/h</div>
          <div class="car-status">{{ car.state }}</div>
        </div>

        <div class="car-location">
          当前位置：{{ car.location }}
        </div>

        <div class="sensor-list">
          <div class="sensor-item">
            <span>传感器总数</span>
            <span>{{ car.sensors }}</span>
            <span>↑</span>
          </div>
          <div class="sensor-item">
            <span>在线</span>
            <span>{{ car.online }}</span>
            <span>↑</span>
          </div>
          <div class="sensor-item warning">
            <span>异常</span>
            <span>{{ car.abnormal }}</span>
            <span>↑</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const props = defineProps({
  currentCars: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 横向并排 */
.car-cards-wrapper {
  display: flex;
  gap: 15px;
}
.car-card {
  flex: 1;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  color: #c0e4ff;
}
.car-card-body {
  padding: 14px;
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
  color: #00f5ff;
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
  color: #00f5ff;
  font-weight: 700;
}
:deep(.el-card__body) {
  padding: 0 !important;
}
</style>
