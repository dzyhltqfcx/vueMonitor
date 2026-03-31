<script setup>
import HeaderCard from '../elements/HeaderCard.vue'
import ProgressCards from '../elements/ProgressCards.vue'
import TempChart from '../elements/TempChart.vue'
import PressureChart from '../elements/PressureChart.vue'
import EventChart from '../elements/EventChart.vue'
import SensorTable from '../elements/SensorTable.vue'
import CarCards from '../elements/CarCards.vue'
import MapCard from '../elements/MapCard.vue'


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

const currentCars = [
  { name: '车辆A001', speed: 50, state: '行驶中', location: '距离入口2km', sensors: 43, online: 39, abnormal: 4 },
  { name: '车辆A002', speed: 60, state: '自动泊车', location: '距离入口10km', sensors: 43, online: 38, abnormal: 5 }
]
</script>

<template>
  <div style="display: flex; justify-content: center; width: 100%;">
    <HeaderCard />
  </div>

  <el-row >
    <el-col :span="6">
      <div class="chart-row">
      <SensorTable :sensorStats="sensorStats" />
      </div>
      <div class="chart-row">
      <TempChart />
      </div>
      <div class="chart-row">
      <PressureChart />
      </div>
    </el-col>

    <el-col :span="12">
      <div class="chart-row">
      <ProgressCards :progressData="progressData" />
      </div>
      <div class="chart-row" style="background-color: aliceblue;">
      <MapCard />
      </div>
      <div class="chart-row" style="background-color: aliceblue;">
      此处是车辆日志表
      </div>
    </el-col>

    <el-col :span="6">
      <div class="chart-row">
      <EventChart />
      </div>
      <div class="chart-row">
      <CarCards :currentCars="currentCars" />
      </div>
      <div class="chart-row">
      <el-row>
        <el-col :span="12" style="background-color: aliceblue;">
          <div>
          此处是实时镜头1
          </div>
        </el-col>
        <el-col :span="12" style="background-color: aliceblue;">
          <div>
          此处是实时镜头2
          </div>
        </el-col>
      </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.chart-row { margin-top: 20px; }
</style>
<!--

<template>
  <el-container class="dashboard">


    <el-main class="content">

      <el-row :gutter="20" class="chart-row">
        <el-col :span="8">

        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>


      <el-row :gutter="20" class="chart-row">
        <el-col :span="12">
          <TempChart />
        </el-col>
        <el-col :span="12">

        </el-col>
      </el-row>

      <el-row :gutter="20" class="chart-row">
        <el-col :span="16">

        </el-col>
      </el-row>


    </el-main>
  </el-container>
</template>

<style scoped>
.dashboard { background: #020b1f; min-height: 100vh; color: #c0e4ff; }
.content { padding: 20px; }
.chart-row { margin-top: 20px; }
</style> -->
