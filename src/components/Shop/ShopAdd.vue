<template>
  <div>
    <el-dialog v-model="show" title="新增商品" @close="cancel" center destroy-on-close>
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
          <el-input v-model.number="formData.num" placeholder="请输入商品数量"></el-input>
        </el-form-item>
        <el-form-item prop="state" label="商品状态">
          <el-radio-group v-model="formData.state">
            <el-radio label="true">上架</el-radio>
            <el-radio label="false">未上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="detail" label="商品详情">
          <editor :value="html" @change="addEditText"></editor>
          <!-- <el-input v-model="formData.detail" placeholder="请输入商品详情" type="textarea"></el-input> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="add('formData')">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor/index.vue'

export default defineComponent({
    name: 'ShopAdd',
    components: {
      Editor
    },
    // props: {
    //   isAdd: {
    //     type: Boolean,
    //     require: true
    //   }
    // },
    emits: [
      'shopCancel',
      'shopAdd'
    ],
    setup(props, ctx) {
      const show = ref(true)
      const addForm = ref()

      const formData = ref({
            name: '',
            introduct: '',
            price: 0,
            num: 0,
            state: false,
            detail: ''
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
          ]
      })
        const cancel = () => {
          ctx.emit('shopCancel')
        }

        const add = (val: any) => {
          // this.$refs[formName].validate((valid) => {
          //   console.log(addForm.value)
          //   console.log(typeof addForm.value)
          //   return
          addForm.value.validate((valid: any) => {
              if (valid) {
                ctx.emit('shopAdd', formData.value)
                // addForm.value.resetFields()
              }else {
                ElMessage.error('请输入正确的信息')
              }
            }
          )
        }

        // 富文本
        // const editorRef = ref<HTMLElement | null>(null)
        const addEditText = (txt: any) => {
          formData.value['detail'] = txt
          console.log('1111111111111111111', formData.value)
        }

        // onUnmounted(() => {
        //   // console.log('销毁调用销毁调用')
        // })

        return {
          show,
          formData,
          formRule,
          cancel,
          add,
          addForm,
          // editorRef,
          addEditText
        }
    }
})
</script>

<style lang="less" scoped>


</style>