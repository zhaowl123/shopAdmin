<template>
  <div>
    <el-table :data="recordList" border style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="stateName" label="状态"></el-table-column>
      <el-table-column prop="shopName" label="商品名称"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <el-form>
            <el-form-item label="订单状态">
              <el-steps :active="getCurrentStep(props.row)" finish-status="success">
                <el-step :title="recordStateList[0]"></el-step>
                <el-step :title="recordStateList[1]"></el-step>
                <el-step :title="recordStateList[2]"></el-step>
                <el-step :title="recordStateList[3]"></el-step>
                <el-step :title="recordStateList[4]"></el-step>
              </el-steps>
            </el-form-item>
            <el-form-item label="支付方式">{{ props.row.payType }}</el-form-item>
            <el-form-item label="支付时间">{{ timestampToTime(props.row.payTime) }}</el-form-item>
            <el-form-item label="收货人">{{ props.row.purchaser }}</el-form-item>
            <el-form-item label="收货人电话">{{ props.row.phone }}</el-form-item>
            <el-form-item label="收货地址">{{ props.row.address }}</el-form-item>
            <el-form-item label="快递信息">
              <el-card shadow="never">
                <el-timeline>
                  <el-timeline-item v-for="(item, index) in props.row.transportInfo" :key="index" :timestamp="timestampToTime(item.time)" placement="top">{{ item.action }}</el-timeline-item>
                </el-timeline>
              </el-card>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="currentpage" layout="prev, pager, next,total,jumper" background :page-size="pagesize" :total="listtotal" @current-change="currentChange">></el-pagination>
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
      recordList: [],
      recordStateList: ['未发货', '已发货', '配送中', '已送达', '已签收'],
      // 分页
      pagesize: 10,
      currentpage: 1,
      listtotal: 233
    }
  },
  mounted() {
    // debugger
    this.getlist()
  },
  methods: {
    timestampToTime(timestamp: any) {
        var date = new Date(timestamp * 1000)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return Y + M + D + h + m + s
    },
    async getlist() {
      const res = await recordlistApi({ userId: wsCache.get(appStore.userInfo) })
      // console.log(res.data)
      res.data.forEach((item: any) => {
        item['stateName'] = this.recordStateList[+item.state - 1]
        // switch (item.state) {
        //   case '1':
        //     item['stateName'] = '未发货'
        //   break
        //   case '2':
        //     item['stateName'] = '已发货'
        //   break
        //   case '3':
        //     item['stateName'] = '配送中'
        //   break
        //   case '4':
        //     item['stateName'] = '已送达'
        //   break
        //   case '5':
        //     item['stateName'] = '已签收'
        //   break
        // }
      })
      this.recordList = res.data
      // console.log(this.recordList)
    },
    getCurrentStep(item: any): number {
      let i = 0
      this.recordStateList.forEach((str: string, index: number) => {
        if (str === item['stateName']) {
          i = index
        }
      })
      return i
    },
    currentChange(index: number) {
      // 这里没有接口，直接重新获取数据把.jpg
      this.getlist()
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
