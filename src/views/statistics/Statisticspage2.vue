<template>
  <div style="padding: 20px; background: #fff;display: flex;align-items: center;">
    <div style="min-width: 200px;">Statisticspage2</div>
    <el-input v-model="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
export default defineComponent({
  name: 'Statisticspage2',
  setup() {
    const value = ref<string>('')

    onMounted(() => {
      console.log('Statisticspage2 onMounted')
    })

    onUnmounted(() => {
      console.log('Statisticspage2 onUnmounted')
    })

    return {
      value
    }
  }
})
</script>
