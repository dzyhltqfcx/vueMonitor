<template>
  <el-card class="panel-card" shadow="hover">
    <div ref="tempChart" class="chart-box"></div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const tempChart = ref(null)
let tempInstance = null

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
})

onBeforeUnmount(() => {
  tempInstance?.dispose()
})
</script>

<style scoped>
.chart-box { width: 100%; min-height: 260px; }
.panel-card { background: rgba(5, 35, 65, 0.8); border: 1px solid #0f4f87; border-radius: 8px; }
</style>
