<template>
  <div style="padding: 20px; background: #fff;display: flex;align-items: center;">
    <div style="min-width: 200px;">userlist</div>
    <el-input v-model="value" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Userlist',
  setup() {
    const value = ref<string>('')

    return {
      value
    }
  }
})
</script>
