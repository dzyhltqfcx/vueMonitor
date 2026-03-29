<template>
  <el-row :gutter="20">
    <el-col :span="8" v-for="item in progressData" :key="item.label">
      <el-card class="panel-card">
        <div class="card-top">
          <span>{{ item.label }}</span>
          <span>{{ item.value }}{{ item.unit }}</span>
        </div>
        <el-progress :percentage="item.percent" status="success" />
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
defineProps({
  progressData: Array
})


</script>

<style scoped>
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
.card-top { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 10px; }
</style>

