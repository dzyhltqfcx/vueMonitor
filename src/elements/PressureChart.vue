<template>
  <el-card class="panel-card" shadow="hover">
    <div ref="pressureChart" class="chart-box"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const pressureChart = ref(null)
let pressureInstance = null

onMounted(() => {
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
})

onBeforeUnmount(() => {
  pressureInstance?.dispose()
})
</script>

<style scoped>
.chart-box { width: 100%; min-height: 260px; }
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
</style>