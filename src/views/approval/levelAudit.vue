<template>
  <div class="container">
    <section class="tool-bar">
      <el-form :inline="true" size="medium">
        <el-form-item label="审核状态">
          <el-select v-model="inlineForm.avstatus" @change="doSearch">
            <el-option v-for="(value, key) in statusOption" :label="value" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  :loading="loading" @click="doSearch">查询</el-button>
          <el-button icon="el-icon-refresh"  :loading="loading" @click="doReset">重置</el-button>
        </el-form-item>
      </el-form>
    </section>

    <el-table :data="tableData" v-loading="loading" :cell-class-name="cellFunction">
      <el-table-column label="申请时间" prop="createtime" align="center"></el-table-column>
      <el-table-column label="申请人头像" align="center">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.usheader]" :key="scope.row.usheader"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column label="申请人昵称" align="center" prop="usname" show-overflow-tooltip></el-table-column>
      <el-table-column label="团队人数" align="center" prop="team_number" ></el-table-column>
      <el-table-column label="所属三级昵称" align="center" prop="user_supper3_name" how-overflow-tooltip></el-table-column>
      <el-table-column label="所属三级手机号" align="center" prop="user_supper3_telphone" how-overflow-tooltip></el-table-column>
      <el-table-column label="用户当前等级" prop="uscsuperlevel" align="center" width="120"></el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.avstatus == 0">
            <el-button type="text" class="success-text" @click="pass(scope.row)">通过</el-button>
            <el-button type="text" class="danger-text" @click="nopass(scope.row)">拒绝</el-button>
          </template>
          <!--<el-popover :key="scope.row.avid" placement="left" trigger="click" @show="showStep(scope.row)">-->
            <!--<div style="padding: 20px;width: 300px;">-->
              <!--<el-steps direction="vertical" :active="steps.length">-->
                <!--<el-step v-for="item in steps" :title="item.anaction" :key="item.anid"-->
                         <!--:description="item.avadname +': '+ item.anabo"></el-step>-->
              <!--</el-steps>-->
            <!--</div>-->
            <!--<el-button slot="reference" type="text" style="margin-left: 10px;">查看记录</el-button>-->
          <!--</el-popover>-->
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
  import TableCellImg from "src/components/TableCellImg";
  //  tocash
  export default {
    name: 'levelAudit',

    components: {TableCellImg},

    data() {
      return {
        statusOption: {
          all: '全部',
          "agree": "已同意",
          "cancle": "已撤销",
          "reject": "已拒绝",
          "wait_check": "审核中"
        },
        inlineForm: {
          avstatus: 'wait_check',
        },

        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],

        steps: [],
      }
    },

    computed: {},

    methods: {
      doSearch() {
        this.getList();
      },
      doReset() {
        this.inlineForm = {
          avstatus: '',
        };
        this.doSearch();
      },

      getList() {
        this.loading = true;
        this.$http.get(this.$api.subcommision_get_approval_list, {
          noLoading: true,
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            ...this.inlineForm,
          }
        }).then(
          res => {
            this.loading = false;
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

      cellFunction({row, column}) {
        if ([ 'avlevel'].includes(column.property)) {
          return 'money-cell'
        }
      },
      tagsType(status) {
        switch (status) {
          case -20:
            return {label: '已取消', type: 'info'};
          case -10:
            return {label: '已拒绝', type: 'danger'};
          case 0:
            return {label: '审核中', type: 'primary'};
          case 10:
            return {label: '已通过', type: 'success'};
        }
      },

      showStep(row) {
        this.$http.get(this.$api.get_approvalnotes, {
          params: {
            avid: row.avid
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.steps = data;
            }
          }
        )
      },

      pass(row) {
        this.$confirm(`确定通过(${row.usname})审批?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$api.mock_approval, {
            "avid": row.avid,
            "avstatus": 'access'
          }).then(
            res => {
              if (res.data.status == 200) {
                let resData = res.data,
                  data = res.data.data;

                this.getList();
                this.$notify({
                  title: '批准通过成功',
                  type: 'success'
                });
              }
            }
          )
        }).catch(() => {

        });


      },
      nopass(row) {
        this.$confirm( `确定拒绝(${row.usname})审批?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.$api.mock_approval, {
            "avid": row.avid,
            "avstatus": 'refuse',
          }).then(
            res => {
              if (res.data.status == 200) {
                let resData = res.data,
                  data = res.data.data;

                this.getList();
                this.$notify({
                  title: '批准拒绝成功',
                  type: 'success'
                });
              }
            }
          )
        }).catch(() => {

        });

      }
    },

    created() {
      this.getList();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

  }
</style>
