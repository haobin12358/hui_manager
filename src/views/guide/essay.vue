<template>
  <div class="container">
    <section class="tool-bar space-between" v-if="$store.state.user.userInfo.level == 'personal'">
      <el-form :inline="true">

        <el-form-item label="时间">
          <el-date-picker
            v-model="formData.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search"  :loading="loading" @click="doSearch">查询</el-button>
        <el-button icon="el-icon-refresh"  :loading="loading" @click="doReset">重置</el-button>
      </el-form>
<!--      <el-button type="primary" style="margin-bottom: 20px;" icon="el-icon-plus" @click="doAddScenic">新增</el-button>-->
    </section>

    <el-table :data="tableData" v-loading="loading" style="width: 100%" >
      <el-table-column label="用户头像" align="center" prop="usheader" width="180">
        <template slot-scope="scope" >
          <table-cell-img :src="[scope.row.author.usheader]" :key="scope.row.author.usheader"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" prop="author.usname" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="trlocation" label="定位" width="180" show-overflow-tooltip></el-table-column>

      <el-table-column align="center" prop="text" label="随笔内容" width="280"></el-table-column>
      <el-table-column label="图片视频" align="center" prop="mfls" width="280">
        <template slot-scope="scope">
          <table-cell-img :src="scope.row.image" v-if="scope.row.showtype == 'image'" :key="scope.$index" width="92px" out-width="92px"></table-cell-img>
          <table-cell-video :videoSrc="scope.row.video.url" :posterSrc="scope.row.video.thumbnail" v-if="scope.row.showtype == 'video'" :key="scope.$index" width="92px" out-width="92px"></table-cell-video>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="trstatus_zh" label="状态" width="220"></el-table-column>
      <el-table-column align="center" label="操作"  width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text"  @click="doReward(scope.row)" v-if="$store.state.user.userInfo.level != 'personal'">打赏</el-button>
          <el-button type="text" class="success-text"  @click="doSelect(scope.row)" v-if="$store.state.user.userInfo.level != 'personal' && !scope.row.selected">加精</el-button>
          <el-button type="text" class="danger-text" @click="doRemoveScenic(scope.row)" v-if="$store.state.user.userInfo.level == 'personal'">删除</el-button>
        </template>
      </el-table-column>
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

  </div>
</template>

<script>

  import {getStore} from "src/utils/index";
  import TableCellImg from "src/components/TableCellImg";
  import TableCellVideo from "src/components/TableCellVideo";
  export default {
    name: 'essay',



    data() {
      return {
        formData: {
          date:''
        },
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
      }

    },
    components: { TableCellImg,TableCellVideo },

    methods: {
      doSearch(){
        this.currentPage = 1;
        this.getTable();
      },
      doReset(){
        this.formData = {
          pltitle:'',
          plstatus:''
        };
        this.doSearch();
      },
      getTable() {
        this.loading = true;

        this.$http.get(this.$api.travelrecord_list, {
          noLoading: true,
          params: {
            page_size:this.pageSize,
            page_num:this.currentPage,
            trtype:2,
            option:this.$store.state.user.userInfo.level == 'personal' ?'my':'',
            date:this.formData.date
          },
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.tableData = data.travelrecord;
              this.total = resData.total_count;
            }
          }
        )


      },
      sizeChange(pageSize) {
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.getTable();
      },
      pageChange(page) {
        this.currentPage = page;
        this.getTable();
      },
      doRemoveScenic(item){
        let that = this;
        this.$confirm('此操作将永久删除该随笔, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.delete = true;
          that.$http.post(that.$api.del_travelrecord, {
            trid:item.trid
          }).then(res => {
            if (res.data.status == 200) {
              that.$notify({
                title: '删除成功',
                message: '随笔删除成功',
                type: 'success'
              });
              that.getTable();
            }
          });
        }).catch(() => {

        });

      },
      //加精
      doSelect(item){
        let that = this;
        this.$confirm('确定要将该随笔加入精选吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.post(that.$api.activation_select, {
            trid:item.trid
          }).then(res => {
            if (res.data.status == 200) {
              that.$notify({
                title: '成功',
                message: '加入精选成功',
                type: 'success'
              });
              that.getTable();
            }
          });
        }).catch(() => {

        });
      },
    //  打赏
      doReward(item){
        let that = this;
        this.$prompt('请输入打赏金额', '确定要给该随笔打赏吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/,
          inputErrorMessage: '金额格式不正确'
        }).then(({ value }) => {
          that.$http.post(that.$api.activation_reward, {
            trid:item.trid,
            atnum:value
          }).then(res => {
            if (res.data.status == 200) {
              that.$notify({
                title: '成功',
                message: '打赏成功',
                type: 'success'
              });
              that.getTable();
            }
          });
        }).catch(() => {

        });

      }





    },

    created() {
      this.getTable();

    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .m-scenic-img{
      display: inline-block;
      width: 220px;
      height: 100px;
    }
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .contract-img {
      .wl(300px, auto);
      max-height: 100%;
      margin-right: 30px;
      border: 1px solid black;
    }

  }
</style>
