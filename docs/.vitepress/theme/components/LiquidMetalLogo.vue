<template>
  <div ref="containerRef" class="liquid-metal-logo" :class="{ 'is-ready': isReady }" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  width: { type: Number, default: 280 },
  height: { type: Number, default: 280 },
  image: { type: String, default: '' },
  colorBack: { type: String, default: '#111113' },
  colorTint: { type: String, default: '#b75001' },
  shape: { type: String, default: 'diamond' },
  repetition: { type: Number, default: 2 },
  softness: { type: Number, default: 0.1 },
  shiftRed: { type: Number, default: 0.3 },
  shiftBlue: { type: Number, default: 0.3 },
  distortion: { type: Number, default: 0.07 },
  contour: { type: Number, default: 0.4 },
  angle: { type: Number, default: 70 },
  speed: { type: Number, default: 1 },
  scale: { type: Number, default: 0.6 },
  fit: { type: String, default: 'contain' },
})

const containerRef = ref(null)
const isReady = ref(false)
let shaderMount = null

onMounted(async () => {
  if (!containerRef.value) return

  const {
    ShaderMount: ShaderMountClass,
    liquidMetalFragmentShader,
    toProcessedLiquidMetal,
    getShaderColorFromString,
    LiquidMetalShapes,
    ShaderFitOptions,
    defaultObjectSizing,
    emptyPixel,
  } = await import('@paper-design/shaders')

  // Process image if provided
  let processedImageUrl = emptyPixel
  if (props.image) {
    try {
      const result = await toProcessedLiquidMetal(props.image)
      processedImageUrl = URL.createObjectURL(result.pngBlob)
    } catch (e) {
      console.warn('LiquidMetal: failed to process image', e)
    }
  }

  // Load the processed image into an HTMLImageElement
  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.crossOrigin = 'anonymous'
    el.onload = () => {
      // Ensure minimum 4x4 for WebGL
      if (el.width < 4) el.width = 4
      if (el.height < 4) el.height = 4
      resolve(el)
    }
    el.onerror = reject
    el.src = processedImageUrl
  })

  const uniforms = {
    u_colorBack: props.colorBack === '#00000000' ? [0, 0, 0, 0] : getShaderColorFromString(props.colorBack),
    u_colorTint: getShaderColorFromString(props.colorTint),
    u_image: img,
    u_contour: props.contour,
    u_distortion: props.distortion,
    u_softness: props.softness,
    u_repetition: props.repetition,
    u_shiftRed: props.shiftRed,
    u_shiftBlue: props.shiftBlue,
    u_angle: props.angle,
    u_isImage: Boolean(props.image),
    u_shape: LiquidMetalShapes[props.shape] ?? 0,
    u_fit: ShaderFitOptions[props.fit] ?? 1,
    u_scale: props.scale,
    u_rotation: defaultObjectSizing.rotation ?? 0,
    u_offsetX: defaultObjectSizing.offsetX ?? 0,
    u_offsetY: defaultObjectSizing.offsetY ?? 0,
    u_originX: defaultObjectSizing.originX ?? 0.5,
    u_originY: defaultObjectSizing.originY ?? 0.5,
    u_worldWidth: defaultObjectSizing.worldWidth ?? 0,
    u_worldHeight: defaultObjectSizing.worldHeight ?? 0,
  }

  if (!containerRef.value) return

  shaderMount = new ShaderMountClass(
    containerRef.value,
    liquidMetalFragmentShader,
    uniforms,
    { alpha: true, premultipliedAlpha: false },
    props.speed,
    0,
    undefined,
    undefined,
    ['u_image']
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
.liquid-metal-logo {
  overflow: hidden;
  position: relative;
  background: transparent;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.liquid-metal-logo.is-ready {
  opacity: 1;
}
.liquid-metal-logo :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  background: transparent !important;
}
</style>
