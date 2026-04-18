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
import TraceLine from '@/elements/TraceLine.vue'

const progressData = [
  { label: '已完工', value: 15, unit: 'km', percent: 75 },
  { label: '正在运行车辆', value: 2, unit: '辆', percent: 100 },
  { label: '在线传感器', value: 88, unit: '个', percent: 85 }
]

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
        <ProgressCards :progressData="progressData" class="box" />
        <MapCard class="box map-box" />
        <Carlog class="box log-box" />
      </el-col>

      <!-- 右列 -->
      <el-col :span="6" class="col">
        <EventChart class="box" />
        <CarCards :currentCars="currentCars" class="box" />
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

/* 主布局：三列 自动等高 */
.main-row {
  flex: 1;
  display: flex;
  margin: 0 -10px;
}

.col {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 10px;
}

/* 所有盒子自动占满高度，最后一个盒子拉伸到底部 */
.el-row {
  display: flex;
  flex: 1;
}
.el-col {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 相机样式 */
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

/* 表格高度统一 */
.log-box {
  height: auto !important;
}

.map-box {
  min-height: 280px;
}
</style>
