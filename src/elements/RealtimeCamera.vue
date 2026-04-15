<template>
  <el-card class="camera-card" shadow="hover">
    <!-- 标题栏 -->
    <div class="camera-header">实时镜头</div>

    <!-- 视频/图片展示区 -->
    <div class="camera-body" @click="handleUploadClick">
      <!-- 后端传入的图片 -->
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="实时镜头"
        class="camera-image"
      />

      <!-- 无图时的占位内容 -->
      <div v-else class="camera-placeholder">
        <span>点击导入图片</span>
      </div>
    </div>

    <!-- 隐藏的文件上传输入框 -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    />
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 接收后端传递的图片URL
const props = defineProps({
  imageUrl: {
    type: String,
    default: '' // 后端没有传入时为空
  }
})

const fileInputRef = ref(null)

// 触发隐藏的文件上传
const handleUploadClick = () => {
  fileInputRef.value?.click()
}

// 处理选择的图片文件
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // 这里可以添加上传到后端的逻辑，上传成功后更新 imageUrl
    // 例如：const res = await uploadImage(file); props.imageUrl = res.url;
    // 本地预览逻辑：
    const localUrl = URL.createObjectURL(file)
    // 由于 props 是单向数据流，这里建议通过 emit 通知父组件更新
    // 这里为了演示，直接修改本地显示，实际项目请使用 emit
    console.log('已选择图片:', localUrl)
    // 注意：在实际项目中，不要直接修改 props，而是通过 emit 给父组件传值
  }
}
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
  padding: 8px 0;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #00f5ff;
  background: rgba(0, 245, 255, 0.1);
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
}

.camera-body {
  height: calc(100% - 36px); /* 减去标题高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer; /* 鼠标悬浮显示手型 */
  position: relative;
  overflow: hidden;
}

.camera-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例，填满容器 */
}

.camera-placeholder {
  color: rgba(192, 228, 255, 0.7);
  font-size: 18px;
  text-align: center;
  transition: all 0.3s;
}

.camera-body:hover .camera-placeholder {
  color: #00f5ff;
  transform: scale(1.05);
}

/* 隐藏原生文件输入框 */
.file-input {
  display: none;
}

:deep(.el-card__body) {
  padding: 0 !important;
  height: 100%;
}
</style>
