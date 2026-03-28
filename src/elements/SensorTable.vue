<template>
  <el-card class="panel-card" shadow="hover">
    <div class="sub-card-title">传感器运行状态</div>
    <el-table :data="sensorStats" stripe style="width: 100%;">
      <el-table-column prop="name" label="传感器" />
      <el-table-column prop="normal" label="正常" />
      <el-table-column prop="abnormal" label="异常" />
    </el-table>
  </el-card>
</template>

<script setup>
defineProps({
  sensorStats: Array
})
</script>

<style scoped>
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
.sub-card-title { font-weight: 700; margin-bottom: 12px; }
</style>