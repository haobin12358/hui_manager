<template>
  <div class="container">
    <span>结算时间:每月22号到次月1号</span>
    <el-table :data="balanceData" :cell-class-name="cellFunction">
      <el-table-column label="结算月份" prop="month" align="center">
        <template slot-scope="scope">
          {{getBalanceMonth(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="结算金额" prop="ssdealamount" align="center"></el-table-column>
      <el-table-column label="状态" prop="ssstatus" align="center"></el-table-column>
      <el-table-column label="确认时间" prop="ssdealtime" align="center"></el-table-column>
      <el-table-column label="下载报表" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="downloadSheet(scope.row)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.ssstatus == '结算中'">
            <el-button type="text" class="success-text" @click="doPass(scope.row)">确认无误</el-button>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">当您对结算信息有异议可以发起申请,点击该按钮后填写原因,平台会尽快处理</div>
              <el-button type="text" class="warning-text" @click="doNoPass(scope.row)">申请反馈</el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getStore} from "src/utils/index";


  export default {
    name: "Balance",

    components: {},

    data() {
      return {
        balanceData: [
          {
            month: '2019年01月',
          }
        ]
      }
    },

    computed: {},

    methods: {
      getList() {
        this.$http.get(this.$api.get_settlenment, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.balanceData = data;
            }
          }
        )
      },
      getBalanceMonth(row) {
        if (row.createtime) {
          let date = new Date(row.createtime)

          return date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
        }
      },
      cellFunction({row, column}) {
        if (['ssdealamount'].includes(column.property)) {
          return 'money-cell'
        }
      },

      downloadSheet(row) {
        if(row.excel_exist){
          // console.log(`${this.$api.export_settlenment_xls }?token=${getStore('token')}&year=${row.createtime.slice(0,4)}&month=${row.createtime.slice(5,7)}`)
          location.href=`${this.$api.export_settlenment_xls }?token=${getStore('token')}&year=${row.createtime.slice(0,4)}&month=${row.createtime.slice(5,7)}`;
          this.$alert('请留意浏览器可能会进行拦截,注意保存文件,xls中日期显示异常时请设置单元格格式', '成功获取结算单',);
        }else{
          this.$notify({
            title: '供应商当月没有结算单，若需要请联系管理员',
            type: 'warning'
          });
        }

      },

      doPass(row) {
        let balanceMonth = this.getBalanceMonth(row);

        this.$confirm(`确认${balanceMonth}的结算结果无误?`, '提示').then(
          () => {
            this.$http.post(this.$api.settlenment,{
              "ssid": row.ssid,
              "action": 1,
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.getList();
                  this.$notify({
                    title: `${balanceMonth}结算成功`,
                    type: 'success'
                  });
                }
              }
            )

          }
        )
      },
      doNoPass(row) {
        let balanceMonth = this.getBalanceMonth(row);

        this.$prompt(`请填写对${balanceMonth}的结算结果有异议的原因`, '提示', {
          inputPlaceholder: '例如:对订单号xx,xx的结算有异议',
          inputType: 'textarea',
          inputValidator: value => {
            if (!value) {
              return '原因不能为空'
            }
            if (value.length > 100) {
              return '原因文本过长(1000)'
            }
          }
        }).then(
          prompt=>{
            this.$http.post(this.$api.settlenment,{
              "ssid": row.ssid,
              "action": -1,
              anabo: prompt.value
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.getList();
                  this.$notify({
                    title: `${balanceMonth}已提交申请`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },

    },

    created() {
      this.getList();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .balance-hd {
      .fj();
    }

  }
</style>
