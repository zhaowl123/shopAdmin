<template>
  <div>
    <el-form ref="addForm" :model="formData" :rules="formRule" label-width="100px">
      <el-form-item prop="name" label="商品名称">
        <el-input v-model="formData.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="introduct" label="商品简介">
        <el-input v-model="formData.introduct" placeholder="请输入商品介绍"></el-input>
      </el-form-item>
      <el-form-item prop="price" label="商品单价">
        <el-input v-model.number="formData.price" placeholder="请输入商品单价"></el-input>
      </el-form-item>
      <el-form-item prop="num" label="商品数量">
        <!-- <el-input v-model.number="formData.num" placeholder="请输入商品数量"></el-input> -->
        <el-input-number v-model.number="formData.num" :min="0" :max="9999"></el-input-number>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload list-type="picture" :drag="true" :limit="1" action="https://www.baidu.com" :on-error="uploadCallback" :before-upload="uploadCheck">
          <template #default>
            <!-- <i class="el-icon-plus"></i> -->
            <el-image :src="require('@/assets/img/picture1.png')" fit="fill"></el-image>
          </template>
          <template #tip>
            只能上传 jpg/png 文件，且不超过 1M
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="state" label="商品状态">
        <el-radio-group v-model="formData.state">
          <el-radio :label="true">上架</el-radio>
          <el-radio :label="false">未上架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="score" label="商品评分">
        <el-rate style="margin-top:8px" v-model.number="formData.score"></el-rate>
      </el-form-item>
      <el-form-item prop="detail" label="商品详情">
        <div>
           <!-- style="height:500px" :value="html" -->
          <editor :value="formData.detail" @change="addEditText"></editor>
        </div>
        <!-- <el-input v-model="formData.detail" placeholder="请输入商品详情" type="textarea"></el-input> -->
      </el-form-item>
    </el-form>
    <div class="footer-div">
      <el-button class="footer-div-button" type="success" @click="sumbit">确定</el-button>
      <el-button class="footer-div-button" type="primary" @click="cancel">取消</el-button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue'
import Editor from '@/components/Editor/index.vue'
import { ElMessage } from 'element-plus'
import { shopdetailApi } from './api'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Shopdetail',
  props: {
    id: String
  },
  components: {
    Editor
  },
  setup(props, ctx) {
    const addForm = ref()

    const formData = ref({
            name: '',
            introduct: '',
            price: 0,
            num: 0,
            state: false,
            detail: '',
            score: 0
         })

      const formRule = ref({
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          introduct: [
            { required: false }
          ],
          price: [
            { type: 'number', required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          num: [
            { type: 'number', required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          state: [
            { required: false }
          ],
          detail: [
            { required: false }
          ],
          score: [
            { required: false }
          ]
      })

      onMounted(async () => {
        const res = await shopdetailApi({
          id: props.id
        })
        // console.log(res)
        formData.value = res.data
      })

      // 上传前验证
      const uploadCheck = (file: any) => {
        // debugger
        // console.log(file)
        if (file.type !== 'image/jpeg') {
          ElMessage('请上传图片')
          return false
        }

        if (file.type / 1024 / 1024 > 1) {
          ElMessage('上传图片过大')
          return false
        }

        //  const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      }

      // 上传完成回调
      const uploadCallback = (err: any, file: any, fileList: any) => {
          ElMessage('就当上传成功了吧')
          // console.log('上传失败', err)
      }

      // 富文本编辑回调
      const addEditText = (txt: any) => {
         formData.value.detail = txt
      }

      // 提交
      const sumbit = () => {

      }
      // 取消
      const router = useRouter()
      const cancel = () => {
        router.back()
      }

    return {
      addForm,
      formData,
      formRule,
      uploadCallback,
      uploadCheck,
      addEditText,
      sumbit,
      cancel
    }
  }
})
</script>

<style lang="less" scoped>

.footer-div{
  margin-top: 30px;
  width: 100%;
  height: 50px;
  text-align: center;
  // background-color: purple;
  .footer-div-button {
    width: 100px;
    height: 30px;
  }

}

</style>