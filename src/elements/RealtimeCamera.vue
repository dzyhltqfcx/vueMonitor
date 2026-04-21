<template>
  <el-card class="camera-card" shadow="hover">
    <div class="camera-header">
      <span>实时镜头 · {{ currentCamera?.cameraName || '无信号' }}</span>
      <span class="status-tag" :class="statusClass">
        {{ currentCamera?.statusLabel || '未知' }}
      </span>
    </div>

    <div class="camera-body">
      <img
        v-if="currentCamera?.thumbnailUrl"
        :src="currentCamera.thumbnailUrl"
        :alt="currentCamera.cameraName || '实时镜头'"
        class="camera-image"
      />

      <div v-else class="camera-placeholder">
        <span>无摄像头信号</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getDashboardInit } from '@/apis/sensors/dashboard'

const cameras = ref([])
const currentIndex = ref(0)
const currentCamera = ref(null)
let slideTimer = null

const statusClass = computed(() => {
  const status = currentCamera.value?.status
  if (status === 'ONLINE') return 'status-online'
  if (status === 'OFFLINE') return 'status-offline'
  return 'status-unknown'
})

async function fetchCameras() {
  try {
    const res = await getDashboardInit()
    const list = res?.data?.rightPanel?.cameras || res?.rightPanel?.cameras || []

    cameras.value = Array.isArray(list) ? list : []
    if (cameras.value.length > 0) {
      if (currentIndex.value >= cameras.value.length) {
        currentIndex.value = 0
      }
      currentCamera.value = cameras.value[currentIndex.value]
    } else {
      currentIndex.value = 0
      currentCamera.value = null
    }
  } catch (error) {
    console.error('获取摄像头数据失败:', error)
    cameras.value = []
    currentIndex.value = 0
    currentCamera.value = null
  }
}

function startSlideShow() {
  slideTimer = window.setInterval(() => {
    if (cameras.value.length === 0) return

    currentIndex.value = (currentIndex.value + 1) % cameras.value.length
    currentCamera.value = cameras.value[currentIndex.value]
  }, 5000)
}

onMounted(async () => {
  await fetchCameras()
  startSlideShow()
})

onBeforeUnmount(() => {
  if (slideTimer) {
    window.clearInterval(slideTimer)
    slideTimer = null
  }
})
</script>

<style scoped>
.camera-card {
  width: 100%;
  height: 100%;
  background: rgba(3, 18, 40, 0.92);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  color: #c0e4ff;
  overflow: hidden;
}

.camera-header {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
  color: #00f5ff;
  background: rgba(0, 245, 255, 0.1);
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
}

.camera-body {
  height: calc(100% - 36px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.camera-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.camera-placeholder {
  color: rgba(192, 228, 255, 0.7);
  font-size: 18px;
  text-align: center;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-online {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.status-offline {
  background: rgba(255, 100, 100, 0.2);
  color: #ff6464;
}

.status-unknown {
  background: rgba(192, 228, 255, 0.2);
  color: #c0e4ff;
}

:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
