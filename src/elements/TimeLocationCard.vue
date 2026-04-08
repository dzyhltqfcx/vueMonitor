<template>
  <el-card class="time-location-card" shadow="hover">
    <div class="content-wrapper">
      <!-- 左侧：时间区域（日期在上、时间在下，垂直居中） -->
      <div class="time-col">
        <div class="time-date">{{ currentDate }}</div>
        <div class="time-time">{{ currentTime }}</div>
      </div>
      <!-- 右侧：位置区域（垂直居中） -->
      <div class="location-col">
        <span class="location-value">{{ location }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const props = defineProps({
  location: {
    type: String,
    default: '墨脱'
  }
})

const currentDate = ref('')
const currentTime = ref('')

function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

async function loadServerTime() {
  try {
    const res = await getDashboardInit('MONTH', 'TODAY')
    const snapshotTime = res?.data?.snapshotTime || res?.data?.timestamp || res?.timestamp || res?.data?.time
    const dateTime = snapshotTime ? formatDateTime(snapshotTime) : ''
    if (dateTime) {
      const [date, time] = dateTime.split(' ')
      currentDate.value = date
      currentTime.value = time
      return
    }
  } catch (error) {
    console.warn('获取服务器时间失败', error)
  }

  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  currentDate.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

onMounted(() => {
  loadServerTime()
})
</script>

<style scoped>
.time-location-card {
  width: 360px;
  height: 80px;
  padding: 0; /* 彻底清掉内边距，避免挤压 */
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  color: #c0e4ff;
  box-shadow: 0 0 14px rgba(0, 245, 255, 0.1);
  overflow: hidden;
}

/* 核心：内容容器占满卡片，左右分栏 */
.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0 20px; /* 给左右留安全边距，避免贴边 */
  box-sizing: border-box;
}

/* 左侧时间列：固定宽度，垂直居中 */
.time-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 200px; /* 给时间列固定足够宽度，彻底杜绝换行 */
  height: 100%;
  gap: 6px; /* 日期和时间的间距 */
}

/* 右侧位置列：剩余宽度，垂直居中 */
.location-col {
  flex: 1; /* 占满剩余宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.time-date {
  font-size: 18px;
  font-weight: 700;
  color: #e6f7ff;
  line-height: 1.2;
  white-space: nowrap; /* 强制不换行！关键！ */
}

.time-time {
  font-size: 16px;
  font-weight: 600;
  color: #a8f4ff;
  line-height: 1.2;
  white-space: nowrap; /* 强制不换行！关键！ */
}

.location-value {
  font-size: 20px; /* 放大位置文字，更醒目 */
  font-weight: 700;
  color: #00f5ff;
  line-height: 1.2;
  white-space: nowrap;
}

/* 彻底清除el-card默认内边距，100%控制高度 */
:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
