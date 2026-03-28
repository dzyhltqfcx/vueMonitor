<template>
  <el-card class="panel-card" shadow="hover">
    <div ref="passChart" class="chart-box"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const passChart = ref(null)
let passInstance = null

onMounted(() => {
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
  passInstance?.dispose()
})
</script>

<style scoped>
.chart-box { width: 100%; min-height: 260px; }
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
</style>
