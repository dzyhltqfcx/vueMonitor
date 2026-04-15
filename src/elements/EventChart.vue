<template>
  <el-card class="vehicle-stat-card" shadow="hover">
    <div class="card-header">
      <span class="title">车辆情况统计</span>
      <span class="decor-line"></span>
    </div>

    <div class="total-event">
      <span class="event-label">事件统计</span>
      <span class="event-value">{{ statData.totalEvent.toLocaleString() }}件</span>
    </div>

    <div class="stat-grid">
      <div class="stat-item">
        <div class="item-icon">
          <el-icon :size="24" color="#00f5ff"><Location /></el-icon>
        </div>
        <div class="item-content">
          <div class="item-label">停靠次数</div>
          <div class="item-value">{{ statData.stopCount }}</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="item-icon">
          <el-icon :size="24" color="#00f5ff"><Van /></el-icon>
        </div>
        <div class="item-content">
          <div class="item-label">出发次数</div>
          <div class="item-value">{{ statData.startCount }}</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="item-icon">
          <el-icon :size="24" color="#00f5ff"><Box /></el-icon>
        </div>
        <div class="item-content">
          <div class="item-label">装载次数</div>
          <div class="item-value">{{ statData.loadCount }}</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="item-icon">
          <el-icon :size="24" color="#00f5ff"><Warning /></el-icon>
        </div>
        <div class="item-content">
          <div class="item-label">异常次数</div>
          <div class="item-value">{{ statData.abnormalCount }}</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({
  statData: {
    type: Object,
    required: true,
    default: () => ({
      totalEvent: 12383,
      stopCount: 489,
      startCount: 489,
      loadCount: 489,
      abnormalCount: 489
    })
  }
})
</script>

<style scoped>
/* 样式和之前完全一致，无需修改 */
.vehicle-stat-card {
  width: 100%;
  height: 100%;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  color: #c0e4ff;
  overflow: hidden;
}
.card-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
}
.title {
  font-size: 20px;
  font-weight: 700;
  color: #00f5ff;
}
.decor-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(0,245,255,0.5) 0%, rgba(0,245,255,0) 100%);
  margin-left: 12px;
  position: relative;
}
.decor-line::after {
  content: '++++';
  position: absolute;
  right: 0;
  top: -8px;
  color: rgba(0,245,255,0.5);
  letter-spacing: 4px;
}
.total-event {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 40px;
}
.event-label {
  font-size: 18px;
  color: #e6f7ff;
  font-weight: 600;
}
.event-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffb766;
}
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(0, 245, 255, 0.1);
}
.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(3, 18, 40, 0.92);
  gap: 16px;
}
.item-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: rgba(0, 245, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 245, 255, 0.2);
}
.item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-label {
  font-size: 16px;
  color: #e6f7ff;
  font-weight: 600;
}
.item-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffb766;
}
:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
