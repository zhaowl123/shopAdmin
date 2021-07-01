<template>
  <div style="padding: 20px; background: #fff;display: flex;align-items: center;">
    <div style="min-width: 200px;">Recordlist</div>
    <el-input v-model="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
export default defineComponent({
  name: 'Recordlist',
  setup() {
    const value = ref<string>('')

    onMounted(() => {
      console.log('Recordlist onMounted')
    })

    onUnmounted(() => {
      console.log('Recordlist onUnmounted')
    })

    return {
      value
    }
  }
})
</script>
