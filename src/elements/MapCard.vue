<script setup>
import { onMounted, onUnmounted } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

let map = null

// 初始化地图
const initMap = () => {
  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      projection: 'EPSG:4326',
      center: [120.7475, 30.7604],
      zoom: 8
    })
  })
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) map.setTarget(null)
})
</script>

<template>
  <div id="map" style="width:100%; height:500px;"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 500px; /* 必须给高度 */
}
</style>
