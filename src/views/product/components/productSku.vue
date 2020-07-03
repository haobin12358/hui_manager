<template>
  <div class="container">
    <el-popover
      placement="top"
      trigger="hover"
      :open-delay="500">

      <el-table :data="skus" :header-cell-class-name="headerCellFunction">
        <el-table-column label="图片" prop="img" align="center" width="120">
          <template slot-scope="scope">
            <table-cell-img :src="[scope.row.skupic]"></table-cell-img>
          </template>
        </el-table-column>
        <el-table-column label="货号" prop="skusn" align="center" width="120" show-overflow-tooltip></el-table-column>

        <el-table-column v-for="(item,index) in prattribute" :label="item" :key="index"
                         align="center" width="120">
          <template slot-scope="scope">
            {{scope.row.skuattritedetail[index]}}
          </template>
        </el-table-column>

        <el-table-column label="价格" prop="skuprice" align="center" width="120"></el-table-column>
        <el-table-column label="让利(%)" prop="skudeviderate" align="center" width="160"></el-table-column>
        <el-table-column label="库存" prop="skustock"  align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.skustock">{{scope.row.skustock}}</span>
            <span v-if="scope.row.mbsstock">{{scope.row.mbsstock}}</span>
            <span v-if="scope.row.gsstock">{{scope.row.gsstock}}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-button slot="reference" type="text">预览sku</el-button>
    </el-popover>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";


  export default {
    name: "ProductSku",

    components: {TableCellImg},

    props:['skus','prattribute'],

    data() {
      return {}
    },

    computed: {},

    methods: {
      headerCellFunction({row, column}) {
        if (!column.property) {
          return 'warning-header-cell'
        }
      },
    },

    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/myIndex";

  .container {

  }
</style>
