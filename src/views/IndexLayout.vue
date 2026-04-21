<script setup>
import { ref, onMounted } from 'vue'
import HeaderCard from '../elements/HeaderCard.vue'
import ProgressCards from '../elements/ProgressCards.vue'
import TempChart from '../elements/TempChart.vue'
import PressureChart from '../elements/PressureChart.vue'
import EventChart from '../elements/EventChart.vue'
import SensorTable from '../elements/SensorTable.vue'
import CarCards from '../elements/CarCards.vue'
import MapCard from '../elements/MapCard.vue'
import TimeLocationCard from '@/elements/TimeLocationCard.vue'
import Carlog from '@/elements/Carlog.vue'
import { getDashboardInit } from '@/apis/sensors/dashboard'
import TraceLine from '../elements/TraceLine.vue'
import RealtimeCamera from '@/elements/RealtimeCamera.vue'

const sensorStats = [
  { name: '深度相机', normal: 521, abnormal: 11 },
  { name: '激光雷达', normal: 489, abnormal: 29 },
  { name: '压力传感器', normal: 521, abnormal: 11 },
  { name: '位移传感器', normal: 489, abnormal: 29 }
]

const currentCars = ref([])

async function fetchCarCards() {
  try {
    const res = await getDashboardInit()
    currentCars.value = res?.data?.rightPanel?.vehicleCards || []
  } catch (error) {
    console.error('车辆卡片数据获取失败：', error)
  }
}

onMounted(() => {
  fetchCarCards()
})
</script>

<template>
  <div class="dashboard-layout">
    <!-- 顶部标题 -->
    <div class="top-header">
      <TimeLocationCard />
      <HeaderCard class="center-title" />
    </div>

    <!-- 主内容三列布局：自动等高 + 底部对齐 -->
    <el-row class="main-row">
      <!-- 左列 -->
      <el-col :span="6" class="col">
        <SensorTable :sensorStats="sensorStats" class="box" />
        <TempChart class="box" />
        <PressureChart class="box" />
      </el-col>

      <!-- 中列 -->
      <el-col :span="12" class="col">
        <ProgressCards class="box progress-top" />
        <MapCard class="box map-box" />
        <Carlog class="box log-box" />
      </el-col>

      <!-- 右列 -->
      <el-col :span="6" class="col">
        <EventChart class="box" />
        <CarCards :currentCars="currentCars" class="box car-card-long" />
        <div class="box camera-box">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="camera-item"><RealtimeCamera /></div>
            </el-col>
            <el-col :span="12">
              <div class="camera-item"><RealtimeCamera /></div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>

  <div>
    <TraceLine />
  </div>
</template>

<style>
/* 全局页面：占满全屏 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #020b1f;
}

.dashboard-layout {
  min-height: 100vh;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 顶部栏 */
.top-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  position: relative;
  width: 100%;
}

.top-header > :first-child {
  position: absolute;
  left: 20px;
}

/* 主布局：三列 */
.main-row {
  flex: 1;
  display: flex;
  margin: 0 -10px;
  gap: 10px;
}

.col {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px; /* 组件上下间距 */
}

/* 统一高度填充 */
.box {
  flex: 1;
  min-height: 0;
}

/* ====================== */
/* 中间列：加高顶部进度卡片 */
/* ====================== */
.progress-top {
  min-height: 92px !important;
  flex: 0.65 !important;
}

/* 中间地图：拉高填满 */
.map-box {
  min-height: 300px !important;
  flex: 1.5 !important;
}

/* ====================== */
/* 右侧：拉长车辆卡片 */
/* ====================== */
.car-card-long {
  flex: 1 !important;
  min-height: 150px !important;
}

/* 右侧摄像头：只留空 */
.camera-box {
  flex: 1 !important;
}

/* ====================== */
/* 传感器表格：字体放大 */
/* ====================== */
:deep(.sensor-table) {
  font-size: 15px !important;
}
:deep(.sensor-table .stats-label) {
  font-size: 16px !important;
  font-weight: bold !important;
}
:deep(.sensor-table th) {
  font-size: 16px !important;
}
:deep(.sensor-table td) {
  font-size: 15px !important;
}

/* ====================== */
/* 相机样式 */
/* ====================== */
.camera-box {
  background: #031228;
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  color: #c0e4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
}

.camera-item {
  padding: 20px;
  background: rgba(0, 245, 255, 0.05);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 8px;
}

.log-box {
  height: auto !important;
}
</style>