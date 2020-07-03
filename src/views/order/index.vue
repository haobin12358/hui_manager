<template>
  <div class="container">
    <section class="tool-bar">
      <el-form :inline="true" size="medium">
        <el-form-item label="订单号">
          <el-input v-model.trim="inlineForm.omno" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model.trim="inlineForm.omrecvname" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="inlineForm.omrecvphone" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名">
          <el-input v-model.trim="inlineForm.prtitle" maxlength="100" clearable></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="inlineForm.createtime_start"
                            placeholder="起始日期" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="middle-line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="inlineForm.createtime_end" placeholder="结束日期"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="doSearch">查询</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="doReset">重置</el-button>
          <!--<el-button icon="el-icon-document" type="info" @click="doExportOrder">导出订单</el-button>-->
        </el-form-item>
      </el-form>


    </section>

    <el-menu :default-active="activeName" class="el-menu-demo" mode="horizontal" @select="handleClick">
      <el-menu-item v-for="item in menuList" :key="item.omstatus" :index="item.omstatus.toString()">{{`${item.omstatus_zh}
       `}}
      </el-menu-item>
    </el-menu>

    <el-table ref="orderTable" :data="orderData" v-loading="loading" size="small" :default-expand-all="expandAll"
              style="width: 100%;"  :cell-class-name="cellFunction"
              :row-class-name="tableRowClassName">
      <el-table-column prop="omno" align="center" label="订单号" width="280"></el-table-column>
      <el-table-column label="订单状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope.row.omstatus_zh)">{{scope.row.omstatus_zh}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="omtruemount" label="实付" align="center" width="120"></el-table-column>
      <el-table-column prop="createtime" label="下单时间" align="center" width="180"></el-table-column>
      <el-table-column prop="usname" label="下单人" align="center" width="180"></el-table-column>
      <el-table-column prop="prmainpic" align="center" label="图片" width="180">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.primg]"></table-cell-img>
        </template>
      </el-table-column>
      <el-table-column prop="prname" align="center" label=" 商品名" width="240"></el-table-column>

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
  import checkPermission from 'src/utils/permission' // 权限判断函数
  import {getStore} from "src/utils/index";



  export default {
    name: 'OrderIndex',

    components: {
      TableCellImg,
    },


    data() {
      return {
        checkPermission,

        activeName: '-1', //  -1 => 空 全部
        orderType: [],
        inlineForm: {
          omno: '',
          omrecvname: '',
          omrecvphone: '',
          prtitle: '',
          createtime_start: '',
          createtime_end: '',
        },

        menuList: [],

        expandAll: false,
        loading: false,
        orderData: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
      }
    },

    computed: {},

    methods: {
      changeSwitch() {
        for (let i = 0; i < this.orderData.length; i++) {
          this.$refs.orderTable.toggleRowExpansion(this.orderData[i], this.expandAll);
        }
      },
      doSearch() {
        this.expandAll = false;
        this.currentPage = 1;
        if (this.inlineForm.createtime_end && this.inlineForm.createtime_start) {
          if (new Date(this.inlineForm.createtime_start) > new Date(this.inlineForm.createtime_end)) {
            let term = this.inlineForm.createtime_end;

            this.inlineForm.createtime_end = this.inlineForm.createtime_start;
            this.inlineForm.createtime_start = term;
          }
        }
        this.setOrderType();
        this.setOrderList();
      },
      doReset() {
        this.inlineForm = {
          omno: '',
          omrecvname: '',
          omrecvphone: '',
          prtitle: '',
          createtime_start: '',
          createtime_end: '',
        }
        this.doSearch();
      },

      doExportOrder() {
        this.$confirm(`确认导出订单报表?`,'提示').then(
          ()=>{
            let url = this.$api.get_all_order + '?',
              params = {};

            params = {
              omstatus:this.activeName,
              ...this.inlineForm,
              export_xls: true,
              token: getStore('token')
            }

            for (let key in params) {
              url += `${key}=${params[key]}&`
            }

            location.href=url;
            this.$alert('请留意浏览器可能会进行拦截,注意保存文件,xls中日期显示异常时请设置单元格格式', '成功获取订单报表',);
          }
        )

      },

      //  获取每个订单类型的数量
      setOrderType() {
        console.log('adsas')
        this.$http.get(this.$api.list_omstatus, {
          noLoading: true,
          params: {
            extentions: 'refund'
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              // data[0].status = -1;

              this.menuList = data;

            }
          }
        )
      },
      handleClick(key, keyPath) {
        this.activeName = key;
        this.expandAll = false;
        this.currentPage = 1;
        this.setOrderList();
      },

      expandRow(row) {
        this.$refs.orderTable.toggleRowExpansion(row);
      },
      cellFunction({row, column}) {
        if (['ommount', 'omfreight', 'omtruemount'].includes(column.property)) {
          return 'money-cell'
        }
      },
      tagType(statusZh) {
        switch (statusZh) {
          //  待支付 待发货
          case '待支付':
            return 'primary'
          case '待发货':
            return 'danger'
          case '已发货':
            return 'success'
          case '退款中':
            return 'warning'
          default:
            return 'info'
        }
      },
      tableRowClassName({row, rowIndex}) {
        // let isOrderPartRefund = row.order_part.some(item => item.opisinora);

        // if (row.ominrefund || isOrderPartRefund) {
        //   return 'warning-row';
        // }
        //
        // return ''
      },

      getSkuCellText(detail, attribute) {
        let rst = '';

        for (let i = 0; i < detail.length; i++) {
          rst += attribute[i] + ': ' + detail[i];

          if (i + 1 < detail.length) {
            rst += ', '
          }
        }

        return rst;
      },
      subTableRowClassName({row, rowIndex}) {
        if (row.opisinora) {
          return 'warning-row';
        }

        return ''
      },

      setOrderList() {
        this.loading = true;
        this.$http.get(this.$api.get_all_order, {
          noLoading: true,
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,
            omstatus: this.activeName,
            ...this.inlineForm
          }
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.orderData = data;
              this.total = resData.total_count;
            }
          }
        )
      },
      sizeChange(pageSize) {
        this.expandAll = false;
        this.pageSize = pageSize;
        this.currentPage = 1;

        this.setOrderList();
      },
      pageChange(page) {
        this.expandAll = false;
        this.currentPage = page;
        this.setOrderList();
      }


    },

    activated() {
      if( this.$route.params.omstatus){
        this.activeName = String(this.$route.params.omstatus);
      }else{
        this.activeName = -1
      }
        this.doSearch();
    },
  }
</script>

<style lang="less" scoped>
  .container {
  }
</style>
