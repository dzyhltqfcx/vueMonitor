<template>
  <el-card class="time-location-card" shadow="hover">
    <div class="content-wrapper">
      <div class="time-col">
        <div class="time-date">{{ currentDate }}</div>
        <div class="time-time">{{ currentTime }}</div>
      </div>
      <div class="location-col">
        <span class="location-value">{{ location }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  location: {
    type: String,
    default: '墨脱'
  }
})

const currentDate = ref('')
const currentTime = ref('')
let timer = null

// 补零
function pad(n) {
  return n.toString().padStart(2, '0')
}

// 强制刷新时间
function updateTime() {
  const now = new Date()
  currentDate.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

onMounted(() => {
  // 立即执行一次
  updateTime()

  // 每秒强制刷新
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.time-location-card {
  width: 360px;
  height: 80px;
  padding: 0;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  color: #c0e4ff;
  box-shadow: 0 0 14px rgba(0, 245, 255, 0.1);
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.time-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 200px;
  height: 100%;
  gap: 6px;
}

.location-col {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.time-date {
  font-size: 18px;
  font-weight: 700;
  color: #e6f7ff;
  white-space: nowrap;
}

.time-time {
  font-size: 16px;
  font-weight: 600;
  color: #a8f4ff;
  white-space: nowrap;
}

.location-value {
  font-size: 20px;
  font-weight: 700;
  color: #00f5ff;
  white-space: nowrap;
}

:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
