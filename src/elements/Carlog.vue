<template>
  <el-card class="log-card">
    <div class="log-header">车辆日志</div>

    <table class="log-table">
      <thead>
        <tr>
          <th>车辆编号</th>
          <th>事件</th>
          <th>时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in logList" :key="index">
          <td>{{ item.vehicleCode }}</td>
          <td>{{ item.eventLabel }}</td>
          <td>{{ formatTime(item.eventTime) }}</td>
          <td class="status" :class="item.statusClass">{{ item.statusLabel }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const logList = ref([])
let refreshTimer = null

function formatTime(isoStr) {
  if (!isoStr) return '-'

  const date = new Date(isoStr)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function mapStatus(status) {
  switch (status) {
    case 'NORMAL':
      return { label: '正常', className: 'status-normal' }
    case 'ABNORMAL':
      return { label: '异常', className: 'status-abnormal' }
    default:
      return { label: status || '未知', className: 'status-unknown' }
  }
}

function mapEventLabel(log) {
  if (log?.eventLabel) return log.eventLabel

  const map = {
    STOP: '停靠',
    BRAKE: '制动',
    RUNNING: '行驶',
    LOAD: '装载',
    UNLOAD: '卸货'
  }

  return map[log?.eventType] || log?.eventType || '未知事件'
}

async function fetchLogs() {
  try {
    const res = await getDashboardInit()
    const vehicleLogs = res?.data?.centerPanel?.vehicleLogs || res?.centerPanel?.vehicleLogs || []

    if (Array.isArray(vehicleLogs)) {
      logList.value = vehicleLogs.map(log => {
        const statusInfo = mapStatus(log?.status)

        return {
          ...log,
          eventLabel: mapEventLabel(log),
          statusLabel: statusInfo.label,
          statusClass: statusInfo.className
        }
      })
    } else {
      logList.value = []
    }
  } catch (error) {
    console.error('获取车辆日志失败:', error)
    ElMessage.error('车辆日志加载失败')
  }
}

onMounted(() => {
  fetchLogs()
  refreshTimer = setInterval(fetchLogs, 15000)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
.log-card {
  width: 100%;
  height: 100%;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
  color: #e6f7ff;
}

/* 标题栏 */
.log-header {
  padding: 12px 16px;
  font-size: 18px;
  font-weight: 700;
  color: #e6f7ff;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
  background: rgba(0, 245, 255, 0.05);
}

/* 表格整体布局 */
.log-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 16px;
}

/* 表头 */
.log-table th {
  padding: 12px;
  background: rgba(0, 245, 255, 0.1);
  color: #00f5ff;
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
}

/* 表格内容 */
.log-table td {
  padding: 14px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.1);
}

/* 状态列：正常 → 青蓝色 */
.status {
  font-weight: 600;
}

.status-normal {
  color: #00f5ff;
}

.status-abnormal {
  color: #ff6b6b;
}

.status-unknown {
  color: #c0e4ff;
}

/* hover 行效果 */
.log-table tbody tr:hover {
  background: rgba(0, 245, 255, 0.08);
  transition: background 0.2s ease;
}

/* 清除 el-card 内边距 */
:deep(.el-card__body) {
  padding: 0 !important;
}
</style>
