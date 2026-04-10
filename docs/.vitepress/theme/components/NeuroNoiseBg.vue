<template>
  <div ref="containerRef" class="neuro-noise" :class="{ 'is-ready': isReady }" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  width: { type: Number, default: 1280 },
  height: { type: Number, default: 720 },
  colorFront: { type: String, default: '#ff6600' },
  colorMid: { type: String, default: '#ff4800' },
  colorBack: { type: String, default: '#000000' },
  brightness: { type: Number, default: 0 },
  contrast: { type: Number, default: 1 },
  speed: { type: Number, default: 1 },
  scale: { type: Number, default: 0.55 },
})

const containerRef = ref(null)
const isReady = ref(false)
let shaderMount = null

onMounted(async () => {
  if (!containerRef.value) return

  const {
    ShaderMount: ShaderMountClass,
    neuroNoiseFragmentShader,
    getShaderColorFromString,
    ShaderFitOptions,
    defaultPatternSizing,
  } = await import('@paper-design/shaders')

  const uniforms = {
    u_colorFront: getShaderColorFromString(props.colorFront),
    u_colorMid: getShaderColorFromString(props.colorMid),
    u_colorBack: props.colorBack === '#00000000' ? [0, 0, 0, 0] : getShaderColorFromString(props.colorBack),
    u_brightness: props.brightness,
    u_contrast: props.contrast,
    u_fit: 0,
    u_scale: props.scale,
    u_rotation: 0,
    u_offsetX: 0,
    u_offsetY: 0,
    u_originX: 0.5,
    u_originY: 0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
  }

  if (!containerRef.value) return

  shaderMount = new ShaderMountClass(
    containerRef.value,
    neuroNoiseFragmentShader,
    uniforms,
    { alpha: true, premultipliedAlpha: false },
    props.speed,
  )

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => { isReady.value = true }, 400)
    })
  })
})

onUnmounted(() => {
  if (shaderMount) {
    shaderMount.dispose()
    shaderMount = null
  }
})
</script>

<style scoped>
.neuro-noise {
  overflow: hidden;
  position: relative;
  opacity: 0;
  transition: opacity 0.8s ease;
}
.neuro-noise.is-ready {
  opacity: 1;
}
.neuro-noise :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
