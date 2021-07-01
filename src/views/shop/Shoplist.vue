<template>
  <div>
    <el-table :data="list.filter((item) => !search || item.id.includes(search))" border style="width: 100%" :row-class-name="tableRowClassName">
    <el-table-column prop="id" label="商品ID" width="120px" header-align="center" align="center"></el-table-column>
    <el-table-column
      prop="name"
      label="商品名称"
      width="300px"
      header-align="center"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="introduct"
      label="商品简介"
      width="700px"
      header-align="center"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="price"
      label="单价"
      width="100px"
      header-align="center"
      align="center"
      sortable
    ></el-table-column>
    <el-table-column
      prop="num"
      label="数量"
      width="100px"
      header-align="center"
      align="center"
      sortable
    ></el-table-column>
    <el-table-column
      prop="stateName"
      label="状态"
      width="100px"
      header-align="center"
      align="center"
      sortable
      :filters="[{text:'上架',value:'上架'},{text:'未上架',value:'未上架'}]"
      :filter-method="tablestatefilter"
      :filter-multiple="false"
    ></el-table-column>
    <el-table-column align="right" min-width="200px">
      <template #header>
        <el-row :gutter="3">
          <el-col :span="18">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" @change="changeValue"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addShop">新增</el-button>
          </el-col>
        </el-row>
      </template>
      <template #default="scope">
        <el-button class="editButton" type="primary" size="medium" @click="editShop(scope)">编辑</el-button>
        <el-button class="editButton" type="danger" size="medium" @click="deleteShop(scope)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="currentpage" layout="prev, pager, next,total,jumper" background :page-size="pagesize" :total="listtotal" @current-change="currentChange">></el-pagination>
  <add-shop v-if="isAdd" @shopCancel="shopCancel" @shopAdd="shopAdd"></add-shop>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, onUpdated } from 'vue'
import { shoplistApi } from './api'
import ShopItem from './ShopItem'
import AddShop from '@/components/Shop/ShopAdd.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Shoplist',
  components: {
    AddShop
  },
  setup() {
    const list = ref([])
    onMounted(async() => {
      // 先写死了
      console.log('shoplist mounted')
      const res = await shoplistApi({ userId: 'admin', page: '0' })
      // console.log(res)
      const data = res.data
      data.forEach((item: ShopItem) => {
        item.stateName = (item.state ? '上架' : '未上架')
      })
      list.value = data
    })

    onUnmounted(() => {
      console.log('shoplist 销毁')
    })

    onUpdated(() => {
      console.log('shoplist update', list.value)
    })

    const search = ref('')
    const changeValue = (str: string) => {
      console.log(str, search.value)
      // data => !search || data.name.toLowerCase().includes(search.toLowerCase())
      // const newList = list.value.filter((item: ShopItem) => !str || item.id?.includes(str))
      // console.log(newList)
    }
    // 分页相关
    const pagesize = ref(10)
    const currentpage = ref(1)
    const listtotal = ref(233)
    const currentChange = async(index: number) => {
      // console.log(index)
      // 按理说，请求新的分页接口，现在没有分页。就先这样吧
      const res = await shoplistApi({ userId: 'admin', page: index - 1 })
      const data = res.data
      data.forEach((item: ShopItem) => {
        item.stateName = (item.state ? '上架' : '未上架')
      })
      list.value = data
    }

    // 表格高亮警告
    const tableRowClassName = (row: any) => {
      // console.log(row)
      if ((row.row as ShopItem).num! <= 100) {
        return 'warning-name'
      }
      return ''
    }

    // 筛选
    const tablestatefilter = (value: any, row: ShopItem, column: any) => {
      // console.log(value)
      // console.log(row)
      // console.log(column)
      return row.stateName === value
    }

    // 新增
    const isAdd = ref(false)
    const addShop = () => {
      // 新增
      isAdd.value = true
    }
    const shopCancel = () => {
      isAdd.value = false
    }
    const shopAdd = (item: any) => {
      console.log('添加信息回传', item)
      // 模拟执行添加接口
      setTimeout(() => {
        isAdd.value = false
      }, 2000)
    }

    // 操作
    // 编辑
    const router = useRouter()
    const editShop = (scope: any) => {
      // 跳转详情
      // console.log()
      router.push({
        path: 'shopdetail',
        query: {
          id: scope.row.id
        }
      })
    }
    // 删除
    const deleteShop = (scope: any) => {
      // console.log('删除', scope.$index)
      // console.log('删除', scope.row)
      list.value.splice(scope.$index, 1)
    }

    return {
      list,
      search,
      changeValue,
      pagesize,
      currentpage,
      listtotal,
      currentChange,
      tableRowClassName,
      tablestatefilter,
      addShop,
      isAdd,
      shopCancel,
      shopAdd,
      editShop,
      deleteShop
    }
  }
})
</script>

<style lang="less">

.el-table .warning-name {
    background: red;
}

.editButton {
  width: 40%;
}

</style>