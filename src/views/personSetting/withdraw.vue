<template>
  <div class="container">
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" width="700px" top="5vh" :close-on-click-modal="false"
               title="提现申请">
      <block-title title="提现表单"></block-title>
      <el-form :model="applyForm" size="medium" label-width="120px" label-position="left">
        <el-form-item label="提现金额" prop="cncashnum">
          <el-input v-model.number="applyForm.cncashnum" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSaveApply">确 定</el-button>
        </span>
    </el-dialog>


    <section class="table-hd">
      <span>可提余额:￥{{canUseBalance}}</span>
      <el-button type="primary" icon="el-icon-plus" @click="doNewApply(true)">新增申请</el-button>
    </section>

    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="提现金额" prop="cncashnum" align="center"></el-table-column>
      <el-table-column label="开户行" prop="cnbankname" align="center"></el-table-column>
      <el-table-column label="银行网点" prop="cnbankdetail" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="户名" prop="cncardname" align="center"></el-table-column>
      <el-table-column label="卡号" prop="cncardno" align="center" width="260"></el-table-column>
      <el-table-column label="状态" prop="cnstatus_zh" align="center"></el-table-column>
      <el-table-column label="拒绝原因" prop="cnrejectreason" align="center"></el-table-column>
      <el-table-column label="申请时间" prop="createtime" align="center" width="180"></el-table-column>
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
  import elDragDialog from 'src/directive/el-dragDialog'

  export default {
    name: "Withdraw",

    components: {},

    directives: {elDragDialog},

    data() {
      return {
        dialogVisible: false,

        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],

        canUseBalance: 0,
        applyForm: {
          "cncashnum": "0"
        },
        formRules: {
          "cncashnum": [
            {required: true, message: '提现金额必填', trigger: 'blur'},

          ],
        },
      }
    },

    computed: {},

    methods: {
      getList() {
        this.$http.get(this.$api.get_cash_notes, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.tableData = data.cash_notes;
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

      //  先进行开票信息校验
      doNewApply(bool) {
        this.$http.get(this.$api.get_supplizeraccount, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              let hasEmpty = false,
                checkFields = ["sabankname", "sabankdetail", "sacardname", "sacardno", "saaddress", "sabankaccount", "sacompanyname", "saicidcode"]

              if (data) {
                for (let i in checkFields) {
                  if (!data[checkFields[i]]) {
                    hasEmpty = true
                    break
                  }
                }
              } else {
                hasEmpty = true
              }


              if (hasEmpty) {
                this.$confirm(`在商户信息页完善信息后才能提现, 是否前往?`, '提示').then(
                  () => {
                    this.$router.push('/personSetting/personSetting')
                  }
                )
              } else {
                this.dialogVisible = bool;
                this.$http.get(this.$api.get_supplizer, {}).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.canUseBalance = data.uwcash;
                    }
                  }
                )

              }
            }
          }
        )
      },
      doSaveApply() {
        const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/;

        console.log(moneyReg.test(this.applyForm.cncashnum), this.applyForm.cncashnum, this.canUseBalance);
        if (moneyReg.test(this.applyForm.cncashnum) && this.applyForm.cncashnum <= this.canUseBalance) {
          this.$confirm(`确认提交提现申请(金额:${this.applyForm.cncashnum})?`, '提示').then(
            () => {
              this.$http.post(this.$api.apply_cash, this.applyForm).then(
                res => {
                  if (res.data.status == 200) {
                    let resData = res.data,
                      data = res.data.data;

                    this.dialogVisible = false
                    this.getList();
                    this.$notify({
                      title: '提现申请提交成功',
                      message: `金额:${this.applyForm.cncashnum}`,
                      type: 'success'
                    });
                  }
                }
              )
            }
          )
        } else {
          this.$message.warning('请填写合理的金额');
        }
      },
    },

    created() {
      this.getList();
      this.doNewApply(false);
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .table-hd{
      .fj();
      align-items: center;
      margin-bottom: 20px;
    }
  }
</style>
