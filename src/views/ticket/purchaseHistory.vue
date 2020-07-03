<template>
    <div class="content" v-if="ticket">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" >
          <div>{{ticket.prname}}</div>
        </el-form-item>
        <el-form-item label="发放时间" >
         <div>{{ticket.time}}</div>
        </el-form-item>
        <el-form-item label="商品状态" >
          <div>{{ticket.prstatus_zh}}</div>
        </el-form-item>
        <el-form-item label="已出票数" >
          <div>{{ticket.trade_num}}</div>
        </el-form-item>
        <el-form-item label="已开奖数" >
          <div>{{ticket.award_num}}</div>
        </el-form-item>
      </el-form>

      <el-table v-loading="dataLoading" :data="dataList" stripe>

        <el-table-column label="头像" align="center" prop="tiimg" width="280">
          <template slot-scope="scope">
            <table-cell-img :src="[scope.row.usheader]" :key="scope.row.usheader" width="92px" out-width="92px"></table-cell-img>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="usname" width="180"></el-table-column>
        <el-table-column label="购买时间" align="center" prop="createtime" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.createtime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="omstatus_zh" >
          <template slot-scope="scope">
            <el-tag type="primary" plain >{{scope.row.omstatus_zh}}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" align="center" fixed="right" width="180">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button type="text" @click="editData(scope)" v-if="scope.row.omstatus == 0">设置为中奖</el-button>-->
<!--&lt;!&ndash;            <el-button type="text" class="danger-text" v-if="scope.row.tsostatus == 1 || scope.row.tsostatus == 2">设置成功</el-button>&ndash;&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <section class="table-bottom">
        <el-pagination background :page-sizes="[10, 20, 30, 40]" :current-page="page_num"
                       :page-size="page_size" :total="total" layout="total, sizes, prev, pager, next, jumper"
                       @size-change="sizeChange" @current-change="pageChange"></el-pagination>
      </section>
    </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
    export default {
        name: "purchaseHistory",
      data(){
          return{
            dataLoading: false,
            dataList: [],
            page_num: 1,
            page_size: 10,
            total: 0,
            ticket:null
          }
      },
      components: { TableCellImg },
      mounted() {
        this.getData()          // 获取data
      },
      methods: {

        // 获取data
        getData() {
          this.dataLoading = true;
          this.$http.get(this.$api.list_trade, {
            noLoading: true, params: {
              prid:this.$route.query.prid,
              page_num:this.page_num,
              page_size:this.page_size,
            }}).then(res => {
            if (res.data.status == 200) {
              this.dataList = res.data.data.ordermain;
              this.ticket = res.data.data.product;
              this.dataLoading = false;
              this.total = res.data.total_count;
            }
          })
        },
        editData(scope){
          let params = {
            tsoid:scope.row.tsoid
          };
          console.log(params)
          // 删除轮播图
          this.$confirm('此操作将设置该用户中奖, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(this.$api.ticket_award, params).then(res => {
              if (res.data.status == 200) {
                this.$notify({
                  title: '设置成功',
                  message: '此用户已被设置中奖',
                  type: 'success'
                });
                this.getData();
              }
            });
          }).catch(() => { });
        },

        sizeChange(val) {
          this.page_size = val;
          this.getData();
        },
        pageChange(val) {
          this.page_num = val;
          this.getData();
        },

      }
    }
</script>

<style scoped>

</style>
