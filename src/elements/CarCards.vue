<template>
  <el-row :gutter="20">
    <el-col :span="12" v-for="car in currentCars" :key="car.name">
      <el-card class="panel-card" shadow="hover">
        <div class="car-panel">
          <h3>{{ car.name }}</h3>
          <p>平均时速：{{ car.speed }} km/h</p>
          <p>状态：{{ car.state }}</p>
          <p>当前地点：{{ car.location }}</p>
          <p>传感器数：{{ car.sensors }}</p>
          <p>在线：{{ car.online }} 异常：{{ car.abnormal }}</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
defineProps({
  currentCars: Array
})
</script>

<style scoped>
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
.car-panel h3 { margin: 0 0 8px 0; color: #7de1ff; }
.car-panel p { margin: 2px 0; }
</style>
