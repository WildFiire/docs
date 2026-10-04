<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const props = defineProps<{ values: Record<string, number>; title?: string }>();
const canvas = ref<HTMLCanvasElement>();
let chart: Chart | undefined;
function draw() {
  if (!canvas.value) return;
  chart?.destroy();
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: Object.keys(props.values),
      datasets: [
        {
          label: props.title || 'Activitate',
          data: Object.values(props.values),
          backgroundColor: 'rgba(255,125,35,.65)',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : undefined,
      plugins: { legend: { display: false } },
    },
  });
}
onMounted(draw);
watch(() => props.values, draw, { deep: true });
onUnmounted(() => chart?.destroy());
</script>
<template>
  <figure class="admin-chart glass-panel">
    <figcaption>{{ title || 'Activitate' }}</figcaption>
    <div><canvas ref="canvas" role="img" :aria-label="title || 'Grafic activitate'"></canvas></div>
    <details>
      <summary>Datele graficului</summary>
      <dl>
        <template v-for="(value, key) in values" :key="key"
          ><dt>{{ key }}</dt>
          <dd>{{ value }}</dd></template
        >
      </dl>
    </details>
  </figure>
</template>
