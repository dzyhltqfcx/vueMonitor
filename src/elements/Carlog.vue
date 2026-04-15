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
          <td>{{ item.id }}</td>
          <td>{{ item.event }}</td>
          <td>{{ item.time }}</td>
          <td class="status">{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 模拟数据（后端接口替换这里即可）
const logList = ref([
  { id: 'A0002', event: '停靠', time: '2026-06-01 08:00:00', status: '正常' },
  { id: 'A0001', event: '行驶', time: '2026-06-01 14:00:00', status: '正常' },
  { id: 'A0002', event: '行政', time: '2026-06-01 13:00:00', status: '正常' },
  { id: 'A0001', event: '卸货', time: '2026-06-01 17:00:00', status: '正常' },
  { id: 'A0002', event: '停靠', time: '2026-06-01 18:00:00', status: '正常' },
])
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
  color: #00f5ff;
  font-weight: 600;
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
