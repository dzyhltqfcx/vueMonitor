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
import { ref } from 'vue'
const progressList = ref([
  { label: '已完工', value: 15, unit: 'km', percent: 75 },
  { label: '正在运行车辆', value: 2, unit: '辆', percent: 100 },
  { label: '在线传感器', value: 88, unit: '个', percent: 85 }
])
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
