<script setup>
import { onMounted, onUnmounted } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

let map = null

const initMap = () => {
  map = new Map({
    target: 'map',
    layers: [
  // 底图（深蓝无文字）
  new TileLayer({
    source: new XYZ({
      url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
    })
  }),
  // ✅ 中文注记层（叠加在上）
  new TileLayer({
    source: new XYZ({
      url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
    })
  })
],
    view: new View({
      projection: 'EPSG:4326',
      center: [120.7475, 30.7604], // 杭州
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
  <div id="map" class="tech-map"></div>
</template>

<style scoped>
.tech-map {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  border: 1px solid rgba(0, 245, 255, 0.3);
  background: #0a1a2c;
  /* 强化科技感滤镜 */
  filter: contrast(1.1) brightness(0.9) saturate(1.2);
}
</style>
