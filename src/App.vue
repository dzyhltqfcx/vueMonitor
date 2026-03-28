<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const progressData = [
  { label: '已完工', value: 15, unit: 'km', percent: 75 },
  { label: '正在运行车辆', value: 2, unit: '辆', percent: 100 },
  { label: '在线传感器', value: 88, unit: '个', percent: 85 }
]

const sensorStats = [
  { name: '深度相机', normal: 521, abnormal: 11 },
  { name: '激光雷达', normal: 489, abnormal: 29 },
  { name: '压力传感', normal: 521, abnormal: 11 },
  { name: '位移传感', normal: 489, abnormal: 29 }
]

const currentCars = [
  { name: '车辆A001', speed: 50, state: '行驶中', location: '距离入口2km', sensors: 43, online: 39, abnormal: 4 },
  { name: '车辆A002', speed: 60, state: '自动泊车', location: '距离入口10km', sensors: 43, online: 38, abnormal: 5 }
]

const tempChart = ref(null)
const pressureChart = ref(null)
const passChart = ref(null)

let tempInstance = null
let pressureInstance = null
let passInstance = null

onMounted(() => {
  if (tempChart.value) {
    tempInstance = echarts.init(tempChart.value)
    tempInstance.setOption({
      title: { text: '温度趋势', left: 'center', textStyle: { color: '#c0e4ff' } },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'], axisLine: { lineStyle: { color: '#6eb7ff' } } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: '#6eb7ff' } } },
      series: [{ data: [120, 132, 101, 134, 90, 230, 210, 180], type: 'line', smooth: true, lineStyle: { width: 2 } }]
    })
  }

  if (pressureChart.value) {
    pressureInstance = echarts.init(pressureChart.value)
    pressureInstance.setOption({
      title: { text: '气压趋势', left: 'center', textStyle: { color: '#c0e4ff' } },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'] , axisLine: { lineStyle: { color: '#6eb7ff' } } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: '#6eb7ff' } } },
      series: [{ data: [140, 182, 191, 234, 290, 330, 310, 280], type: 'line', smooth: true, lineStyle: { width: 2 } }]
    })
  }

  if (passChart.value) {
    passInstance = echarts.init(passChart.value)
    passInstance.setOption({
      title: { text: '事件统计', left: 'center', textStyle: { color: '#c0e4ff' } },
      tooltip: {},
      legend: { data: ['报警', '故障', '异常'], top: '10%', textStyle: { color: '#c0e4ff' } },
      xAxis: { type: 'category', data: ['A001', 'A002', 'A003', 'A004', 'A005'], axisLine: { lineStyle: { color: '#6eb7ff' } } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: '#6eb7ff' } } },
      series: [
        { name: '报警', type: 'bar', data: [120, 200, 150, 80, 70] },
        { name: '故障', type: 'bar', data: [90, 150, 220, 120, 110] },
        { name: '异常', type: 'bar', data: [60, 80, 100, 60, 50] }
      ]
    })
  }
})

onBeforeUnmount(() => {
  tempInstance?.dispose()
  pressureInstance?.dispose()
  passInstance?.dispose()
})
</script>

<template>
  <el-container class="dashboard">
    <el-header class="header">
      <h1>20km自动驾驶隧道监控大屏</h1>
    </el-header>

    <el-main class="content">
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

      <el-row :gutter="20" class="chart-row">
        <el-col :span="12">
          <el-card class="panel-card" shadow="hover">
            <div ref="tempChart" class="chart-box"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="panel-card" shadow="hover">
            <div ref="pressureChart" class="chart-box"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="chart-row">
        <el-col :span="16">
          <el-card class="panel-card" shadow="hover">
            <div ref="passChart" class="chart-box"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="panel-card" shadow="hover">
            <div class="sub-card-title">传感器运行状态</div>
            <el-table :data="sensorStats" stripe style="width: 100%;">
              <el-table-column prop="name" label="传感器" />
              <el-table-column prop="normal" label="正常" />
              <el-table-column prop="abnormal" label="异常" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="chart-row">
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
    </el-main>
  </el-container>
</template>

<style scoped>
.dashboard { background: #020b1f; min-height: 100vh; color: #c0e4ff; }
.header { padding: 16px 24px; background: #0f2143; color: #ffffff; }
.header h1 { margin: 0; font-size: 1.8rem; }
.content { padding: 20px; }
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
.card-top { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 10px; }
.chart-row { margin-top: 20px; }
.chart-box { width: 100%; min-height: 260px; }
.sub-card-title { font-weight: 700; margin-bottom: 12px; }
.car-panel h3 { margin: 0 0 8px 0; color: #7de1ff; }
.car-panel p { margin: 2px 0; }
</style>
