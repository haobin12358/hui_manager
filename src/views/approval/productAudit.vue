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
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="doSearch">查询</el-button>
          <el-button icon="el-icon-refresh" :loading="loading" @click="doReset">重置</el-button>
        </el-form-item>
      </el-form>
    </section>
    <el-table :data="tableData" v-loading="loading" :cell-class-name="cellFunction">
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="审批内容" align="center">
        <el-table-column align="center" width="120" label="图片">
          <template slot-scope="scope">
            <table-cell-img :src="scope.row.content ? [scope.row.content.prmainpic] : []"
                            :key="scope.row.avid"></table-cell-img>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="content.prname" label="商品名" width="280"></el-table-column>
        <!--<el-table-column align="center" prop="content.prdescription" label="商品描述" width="180" show-overflow-tooltip></el-table-column>-->
        <el-table-column align="center" prop="content.purchaseprice" label="采购价" width="120"></el-table-column>
        <el-table-column align="center" prop="content.suname" label="供应商" width="180"></el-table-column>
        <el-table-column label="轮播图" width="340" align="center">
          <template slot-scope="scope">
            <table-cell-img :src="scope.row.content ? getImagesUrl(scope.row.content.images) : []" out-width="300px"
                            :key="scope.row.avid"></table-cell-img>
          </template>
        </el-table-column>
        <!--<el-table-column label="底部长图" width="340" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<table-cell-img :src="scope.row.content ? scope.row.content.prdesc : []" out-width="300px"-->
                            <!--:key="scope.row.avid"></table-cell-img>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table-column>
      <el-table-column label="发起人" align="center">
        <el-table-column label="姓名" prop="start.adname" align="center" width="120">
          <template slot-scope="scope">
              <span v-if="scope.row.start">
                {{scope.row.start.adname || scope.row.start.suname || scope.row.start.usname }}
              </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="当前审批层级" prop="avlevel" align="center" width="120"></el-table-column>
      <el-table-column label="审批创建时间" prop="createtime" align="center" width="180"></el-table-column>
      <el-table-column label="状态" prop="avlevel" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tag :type="tagsType(scope.row.avstatus).type">{{tagsType(scope.row.avstatus).label}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.avstatus == 0">
            <el-button type="text" class="success-text" @click="showDialog(scope.row)">通过</el-button>
            <el-button type="text" class="danger-text" @click="nopass(scope.row)">不通过</el-button>
          </template>
          <el-popover :key="scope.row.avid" placement="left" trigger="click" @show="showStep(scope.row)">
            <div style="padding: 20px;width: 300px;">
              <el-steps direction="vertical" :active="steps.length">
                <el-step v-for="item in steps" :title="item.anaction" :key="item.anid"
                         :description="item.avadname +': '+ item.anabo"></el-step>
              </el-steps>
            </div>
            <el-button slot="reference" type="text" style="margin-left: 10px;">查看记录</el-button>
          </el-popover>
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
    <el-dialog title="提示" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form">
        <div>确认批准？</div>
        <el-form-item label="审批意见" >
          <el-input v-model="form.anabo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="划线价格" >
          <el-input v-model="form.prlineprice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际价格" >
          <el-input v-model="form.prtrueprice" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import ProductSku from "src/views/product/components/productSku";

  //  toshelves
  export default {
    name: 'ProductAudit',

    components: {TableCellImg, ProductSku},

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
        dialogFormVisible: false,
        form:{
          prlineprice:'',
          prtrueprice:'',
          anabo:'',
          avid:'',
          anaction:1
        }
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

      cellFunction({row, column}) {
        if (['content.prprice'].includes(column.property)) {
          return 'money-cell'
        }
      },
      getList() {
        this.loading = true;
        this.$http.get(this.$api.get_approval_list, {
          noLoading: true,
          params: {
            page_size: this.pageSize,
            page_num: this.currentPage,

            ptid: 'toshelves',
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
        if (['avlevel'].includes(column.property)) {
          return 'money-cell'
        }
      },
      getImagesUrl(imgs) {
        if (imgs) {
          return imgs.map(item => item.pipic)
        } else {
          return []
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
      cancelDialog(){
        this.$refs.form.resetFields()
     },
      showDialog(row){
        this.dialogFormVisible = true
        this.form.avid = row.avid
      },
      pass() {
        if(!this.form.anabo){
          this.$message({
            message: '请输入审批意见',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
        if(!this.form.prlineprice){
          this.$message({
            message: '请输入划线价格',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
        if(!this.form.prtrueprice){
          this.$message({
            message: '请输入实际价格',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
        this.form.prlineprice = Number(this.form.prlineprice)
        this.form.prtrueprice = Number(this.form.prtrueprice)
          this.$http.post(this.$api.deal_approval, this.form).then(
            res => {
              if (res.data.status == 200) {
                let resData = res.data,
                  data = res.data.data;

                this.getList();
                this.$notify({
                  title: '批准通过成功',
                  type: 'success'
                });
                this.dialogFormVisible = false
              }
            }
          )

      },

      nopass(row) {
        this.$prompt(`确认不批准?`, '提示', {
          inputPlaceholder: '审批意见',
          inputValidator: value => {
            if (!value) {
              return '意见不能为空'
            }
            if (value.length > 100) {
              return '意见文本过长(100)'
            }
          },
        }).then(
          prompt => {
            this.$http.post(this.$api.deal_approval, {
              "avid": row.avid,
              "anaction": -1,
              "anabo": prompt.value
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
          }
        )
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
