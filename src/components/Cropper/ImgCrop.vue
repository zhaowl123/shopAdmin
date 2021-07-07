<template>
  <!-- <div>
  </div> -->
  <el-dialog v-model="centerDialogVisible" title="图片裁剪" @close="close" destroy-on-close>
    <el-row>
      <el-col :span="15">
        <vue-cropper ref="cropper" style="width: 500px; height: 400px" :src="require('@/assets/img/picture1.png')" :aspect-ratio="16 / 9" preview=".preview"></vue-cropper>
      </el-col>
      <el-col :span="9">
        <div>
          <img style="width: 300px; height: 300px" :src="previewImg" alt="预览">
        </div>
      </el-col>
      <el-row>
        <div class="func-button-div">
          <el-button type="primary" round @click="rotate(90)">顺时针旋转90°</el-button>
          <el-button type="primary" round @click="rotate(-90)">逆时针旋转90°</el-button>
          <el-button type="primary" round @click="transportV">左右翻转</el-button>
          <el-button type="primary" round @click="transportH">上下翻转</el-button>
          <el-button type="success" round>上传</el-button>
        </div>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default defineComponent({
  name: 'ImgCrop',
  components: {
    VueCropper
  },
  props: {
    imgSrc: {
        type: String,
        require: true
    },
    centerDialogVisible : {
        type: Boolean,
        require: true
    }
  },

  setup() {
      const previewImg = ref()
      const v = ref(1)
      const h = ref(1)
      const cropper = ref()

      const close = () => {

      }

      const rotate = (r: Number) => {
        //   console.log(cropper)
          cropper.value.rotate(r)
      }

      const transportV = () => {
          v.value = -v.value
          cropper.value.scaleX(v.value)
      }

      const transportH = () => {
          h.value = -h.value
          cropper.value.scaleY(h.value)
      }

      return {
          previewImg,
          v,
          h,
          cropper,
          close,
          rotate,
          transportV,
          transportH
      }
  }
})
</script>

<style lang="less" scoped>

.crop-div{
    width: 800px;
}

.func-button-div{
    margin-top: 20px;
}

</style>