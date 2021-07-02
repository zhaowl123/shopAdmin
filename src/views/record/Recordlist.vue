<template>
  <div>
    <el-table :data="recordList" border style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="stateName" label="状态"></el-table-column>
      <el-table-column prop="shopName" label="商品名称"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
       <!-- <el-form label-position="left" inline class="demo-table-expand"> -->
      <!-- <el-table-column type="expand">
        <template #default="props">
          <el-form>
            <el-form-item label="订单状态">这是个步骤条</el-form-item>
            <el-form-item label="支付方式">{{ props.row.payType }}</el-form-item>
            <el-form-item label="支付时间">{{ props.row.payTime }}</el-form-item>
            <el-form-item label="收货人">{{ props.row.purchaser }}</el-form-item>
            <el-form-item label="收货人电话">{{ props.row.phone }}</el-form-item>
            <el-form-item label="收货地址">{{ props.row.address }}</el-form-item>
            <el-form-item label="快递信息">这是个时间条</el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-paginatio></el-paginatio> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { recordlistApi } from './api'
import { appStore } from '@/store/modules/app'
import wsCache from '@/cache'

/*
{
            "id": "74076899",
            "state": "2718685182032144",
            "shopName": "ea incididunt adipisicing",
            "orderPrice": "676",
            "payType": "微信",
            "payTime": "1625124730",
            "purchaser": "李洋",
            "phone": "74529038994",
            "address": "tempor ea ",
            "transportInfo": [
                {
                    "time": "1625124730",
                    "action": "sit veniam ullamco adipisicing"
                },
                {
                    "time": "1625124730",
                    "action": "sit consequat ipsum eu"
                }
            ]
        }
*/

export default defineComponent({
  name: 'Recordlist',
  data() {
    return {
      recordList: []
    }
  },
  mounted() {
    // debugger
    this.getlist()
  },
  methods: {
    async getlist() {
      const res = await recordlistApi({ userId: wsCache.get(appStore.userInfo) })
      // console.log(res.data)
      res.data.forEach((item: any) => {
        switch (item.state) {
          case '1':
            item['stateName'] = '未发货'
          break
          case '2':
            item['stateName'] = '已发货'
          break
          case '3':
            item['stateName'] = '配送中'
          break
          case '4':
            item['stateName'] = '已送达'
          break
          case '5':
            item['stateName'] = '已签收'
          break
        }
      })
      this.recordList = res.data
      // console.log(this.recordList)
    }
  }
  /*
  setup() {
    const list = ref([])
    onMounted(async () => {
      const res = await recordlistApi({ userId: wsCache.get(appStore.userInfo) })
      console.log(res.data)
      // list.value = res.data
      res.data.forEach((item: any) => {
        // time再说，先把状态解析下
        switch (item.state) {
          case '1':
            item['stateName'] = '未发货'
            // stateName= '未发货'
          break
          case '2':
            // stateName= '已发货'
            item['stateName'] = '已发货'
          break
          case '3':
            // stateName= '配送中'
            item['stateName'] = '配送中'
          break
          case '4':
            // stateName= '已送达'
            item['stateName'] = '已送达'
          break
          case '5':
            // stateName= '已签收'
            item['stateName'] = '已签收'
          break
        }
        // list.value.push(item)
        // this.recordList.push(item)
        list.value = res.data
      })
    })
    return {
      list
    }
    */
  // }

  /*
  {
        id: '',
        state: '',
        stateName: '',
        orderPrice: 0,
        payType: '',
        payTime: '',
        purchaser: '',
        phone: '',
        address: '',
        transportInfo: []
      }
  */
  // setup() {
  //   const value = ref<string>('')

  //   onMounted(() => {
  //     console.log('Recordlist onMounted')
  //   })

  //   onUnmounted(() => {
  //     console.log('Recordlist onUnmounted')
  //   })

  //   return {
  //     value
  //   }
  // }
})
</script>
