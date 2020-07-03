<template>
  <div class="container">
    <section class="add-banner tr">
      <el-button type="primary" icon="el-icon-plus" @click="editBanner('')">新增</el-button>
    </section>
    <el-table v-loading="bannerLoading" :data="bannerList" stripe>

      <el-table-column align="center" prop="lccontent" label="内容" width="380">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="详情"
            width="400"
            trigger="hover"
          >
            <div v-html="scope.row.lccontent || '无'"></div>
            <el-button slot="reference" type="text" >预览</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="对应链接" align="center" prop="mpbshow" show-overflow-tooltip>
        <template slot-scope="scope">
         <span>/pages/personal/richText?lcid={{scope.row.lcid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editBanner(scope)">编辑</el-button>
          <el-button type="text" class="danger-text" @click="deleteBanner(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import elDragDialog from 'src/directive/el-dragDialog'
  import { getStore } from "src/utils/index";

  const positiveNumberReg = /^([1-9]\d*)$/;   //  正整数
  export default {
    name: 'RouteBanner',
    data() {
      return {
        bannerDialog: false,
        bannerForm: {
          mpbid: '',
          prid: '',
          mpbpicture: '',
          mpbsort: '',
          contentlink: '',
          mpbshow: false,
        },
        rules: {
          mpbpicture: [
            { required: true, message: '轮播图必需', trigger: 'blur' }
          ],
          mpbsort: [
            { required: true, message: '序号必填', trigger: 'blur' }
          ],
          /*contentlink: [
            { required: true, message: '链接必填', trigger: 'blur' }
          ],*/
          /*prid: [
            { required: true, message: '商品必选', trigger: 'blur' }
          ]*/
        },
        bannerLoading: false,
        bannerList: [],
        kw: '',
        index: -1,
        status :0
      }
    },
    directives: { elDragDialog },
    components: { TableCellImg },
    mounted() {
      this.getBanner()          // 获取banner
    },
    methods: {

      // 获取banner
      getBanner() {
        this.bannerLoading = true;
        this.$http.get(this.$api.list_linkcontent, {
          noLoading: true, params: {}}).then(res => {
          if (res.data.status == 200) {
            this.bannerList = res.data.data;
            this.bannerLoading = false;
          }
        });
      },
      // 删除banner
      deleteBanner(scope) {
        let params = scope.row;
        params.delete = true;
        // 删除轮播图
        this.$confirm('此操作将删除该富文本, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          params.isdelete = true;
          this.$http.post(this.$api.set_linkcontent, params).then(res => {
            if (res.data.status == 200) {
              this.$notify({
                title: '删除成功',
                message: '此富文本已被删除',
                type: 'success'
              });
              this.getBanner();
            }
          });
        }).catch(() => { });
      },
      // 编辑banner
      editBanner(scope) {
        let rich = scope?JSON.stringify(scope.row):'';
        this.$router.push({path: '/marketing/editRich', query: {rich: rich}})
      },


    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .add-banner {
      margin-bottom: 20px;
    }
    .banner-img {
      width: 272px;
      height: 148px;
      line-height: 148px;
    }
    .sort-input {
      width: 5rem;
    }
    .bind-btn {
      margin: 0 0 0 50px;
    }
  }
</style>
