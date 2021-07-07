<template>
  <!-- <div>
  </div> -->
  <el-dialog v-model="isShow" title="图片裁剪" @close="close" destroy-on-close :close-on-click-modal="false">
    <el-row>
      <el-col :span="16">
        <vue-cropper ref="cropper" style="width: 500px; height: 400px" :src="imgSrc" :aspect-ratio="16 / 9" preview=".preview"></vue-cropper>
      </el-col>
      <el-col :span="8">
        <div>
          <div class="preview" />
          <img class="crop-img-div" :src="cropImg" alt="预览">
        </div>
      </el-col>
      <el-row>
        <div class="func-button-div">
          <el-button type="primary" round @click="rotate(90)">顺时针旋转90°</el-button>
          <el-button type="primary" round @click="rotate(-90)">逆时针旋转90°</el-button>
          <el-button type="primary" round @click="transportV">左右翻转</el-button>
          <el-button type="primary" round @click="transportH">上下翻转</el-button>
          <el-button type="success" round @click="crop">裁剪</el-button>
          <el-button type="success" round @click="upload">上传</el-button>
        </div>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ImgCrop',
  components: {
    VueCropper
  },
  props: {
    imgSrc: {
        type: String,
        require: true
    }
  },
  emits: [
    'closeCallback',
    'uploadCallback'
  ],
  data() {
    return {
        isShow: true,
        cropImg: '',
        v: 1,
        h: 1
    }
  },
  methods: {
    close() {
      this.$emit('closeCallback')
    },
    // show() {
    //   // debugger
    //   console.log(this.imgSrc)
    // },
    rotate(r: Number) {
      (this.$refs.cropper as typeof VueCropper).rotate(r)
    },
    transportV() {
      if (this.v === 1) {
        this.v = -1
      }else {
        this.v = 1
      }
      // this.v = -this.v
      (this.$refs.cropper as typeof VueCropper).scaleX(this.v)
    },
    transportH() {
      if (this.h === 1) {
        this.h = -1
      }else {
        this.h = 1
      }
      (this.$refs.cropper as typeof VueCropper).scaleY(this.h)
    },
    crop() {
      this.cropImg = (this.$refs.cropper as typeof VueCropper).getCroppedCanvas().toDataURL()
      console.log('cropimg url:', this.cropImg)
    },
    upload() {
      if (!this.cropImg) {
        ElMessage('请裁剪图片')
        return
      }
      this.$emit('uploadCallback', this.cropImg)
    }
  },
  mounted() {
    // debugger
    console.log(this.imgSrc)
  }
})
</script>

<style lang="less" scoped>

// .crop-div{
//     width: 800px;
// }

.func-button-div{
    margin-top: 20px;
}

.preview {
  width: 250px;
  // height: 200px;
  height: calc(250px * (9 / 16));
  overflow: hidden;
  text-align: center;
}

.crop-img-div {
  width: 250px;
  height: calc(250px * (9 / 16));
  overflow: hidden;
  text-align: center;
  margin-top: 20px;
}

</style>