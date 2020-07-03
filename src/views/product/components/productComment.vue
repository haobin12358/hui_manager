<template>
  <div class="container">
    <el-dialog :visible="visible" @close="doClose" :title="product.prtitle" width="900px">
      <el-table :data="tableData" v-loading="loading" style="width: 100%;">
        <el-table-column label="评分(满分5分)" prop="oescore" width="150" align="center"></el-table-column>
        <el-table-column label="评价内容"  prop="oetext"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="图片" width="220" align="center">
          <template slot-scope="scope">
            <table-cell-img :src="findCommentImgs(scope.row)" :key="scope.row.oeid" out-width="180px"></table-cell-img>
          </template>
        </el-table-column>
        <el-table-column label="视频(点击预览)" width="120" align="center">
          <template slot-scope="scope">
            <table-cell-video v-if="scope.row.video.length" :key="scope.row.oeid"
                              :video-src="scope.row.video[0].oevideo" :poster-src="scope.row.video[0].oevthumbnail"></table-cell-video>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="评价时间" prop="createtime" width="180" align="center"></el-table-column>
      </el-table>
      <section class="table-bottom">
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="pageChange">
        </el-pagination>
      </section>
    </el-dialog>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import TableCellVideo from "src/components/TableCellVideo";

  export default {
    name: "ProductComment",

    components: {TableCellImg,TableCellVideo},

    // props: ['visible','product'],
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      product:{
        type: Object,
        default:  {},
      }
    },

    watch: {
      visible(val){
        if(val){
          this.currentPage = 1;

          this.getList();
        }
      }
    },

    data() {
      return {
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
      }
    },

    computed: {},

    methods: {
      doClose(){
        this.$emit('close');
      },

      findCommentImgs(row){
        return row.image.map(item => item.oeimg)
      },

      getList(){
        this.$http.get(this.$api.get_evaluation,{
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            prid: this.product.prid
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.tableData = data;
              this.total = resData.total_count;
            }
          }
        )
      },
      sizeChange(pageSize) {
        this.pageSize = pageSize;
        this.currentPage = 1;

        this.getList();
      },
      pageChange(page) {
        this.currentPage = page;
        this.getList();
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
