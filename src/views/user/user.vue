<template>
  <div class="container">
    <section class="tool-bar space-between">
      <el-form :inline="true" size="medium">
        <el-form-item label="搜索账号">
          <el-input v-model.trim="name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="搜索手机号">
          <el-input v-model.trim="mobile" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="userLoading"  @click="getUserList">查询</el-button>
          <el-button icon="el-icon-refresh" :loading="userLoading"  @click="resetUser">重置</el-button>
        </el-form-item>
      </el-form>
      <!--<el-button type="primary" icon="el-icon-plus" @click="">新增</el-button>-->
    </section>

    <el-table v-loading="userLoading" :data="userList" stripe>
      <el-table-column label="用户头像" align="center" prop="usheader">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.usheader]" :key="scope.row.usheader"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="usname" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号" align="center" prop="ustelphone"></el-table-column>
      <el-table-column label="余 额" align="center" prop="remain"></el-table-column>
      <el-table-column label="等 级" align="center" prop="uscsuperlevel">
        <template slot-scope="scope">
          <el-input class="sort-input" @focus="indexDone(scope,1)" v-model.number="scope.row.uscsuperlevel"
                    @change="sortChange" maxlength="11"></el-input>
          <el-button type="text" v-if="scope.$index == index && status == 1" @click="sortChange">保存</el-button>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center" prop="usquery"></el-table-column>
      <el-table-column label="上次登录时间" align="center" prop="userlogintime"></el-table-column>
    </el-table>
    <section class="table-bottom">
      <el-pagination background class="page-box" :page-sizes="[10, 20, 30, 40]" :current-page="page_num"
                     :page-size="page_size" :total="total" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="sizeChange" @current-change="pageChange"></el-pagination>
    </section>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  const positiveNumberReg = /^([1-9]\d*)$/;   //  正整数
  export default {
    name: 'User',
    data() {
      return {
        name: '',
        mobile: '',
        userLoading: false,
        userList: [],
        page_size: 10,
        page_num: 1,
        total: 0,
        index:0,
        status:''
      }
    },
    components: {TableCellImg},
    mounted() {
      this.getUserList();         // 获取数据
    },
    methods: {
      // 获取数据
      getUserList() {
        this.userLoading = true;
        this.$http.get(this.$api.list_user_commison, {
          noLoading: true,
          params: {
            level: 1,
            name: this.name || '',
            mobile: this.mobile || '',
            page_size: this.page_size,
            page_num: this.page_num
          }
        }).then(res => {
          if (res.data.status == 200) {
            this.userList = res.data.data;
            this.total = res.data.total_count;
            this.userLoading = false;
          }
        })
      },
      sizeChange(val) {
        this.page_size = val;
        this.getUserList();         // 获取数据
      },
      pageChange(val) {
        this.page_num = val;
        this.getUserList();         // 获取数据
      },
      // 重置搜索框
      resetUser() {
        this.name = '';
        this.mobile = '';
        this.getUserList();         // 获取数据
      },
      // 记录点击的是哪一行
      indexDone(scope,status) {
        this.index = scope.$index;
        this.status = status;
      },
      // 改变轮播图序号
      sortChange(v) {
        if(positiveNumberReg.test(this.userList[this.index].uscsuperlevel)) {
          let params ={
            set_level:Number(this.userList[this.index].uscsuperlevel),
            usid: this.userList[this.index].usid
          } ;


          this.$http.post(this.$api.set_user_level, params).then(res => {
            if (res.data.status == 200) {
              this.$notify({
                title: '保存成功',
                message: '此等级已保存',
                type: 'success'
              });
              this.getUserList();         // 刷新banner
              this.status = 0 ;
              this.index = -1;
            }
          });
        }else {
          this.$message.warning('请输入等级(0/1/2/3)');

        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .page-box {
      text-align: right;
      padding: 20px;
    }
  }
</style>
