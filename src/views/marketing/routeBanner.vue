<template>
  <div class="container">
    <block-title title="主页"></block-title>
    <section class="add-banner tr">
      <el-button type="primary" icon="el-icon-plus" @click="addClick(0)">新增</el-button>
    </section>
    <el-table v-loading="indexBannerLoading" :data="indexBannerList" stripe>
      <el-table-column label="轮播图" align="center" prop="mpbpicture" width="180">
        <template slot-scope="scope">
          <table-cell-img :src="[scope.row.mpbpicture]" :key="scope.row.mpbpicture" width="92px" out-width="92px"></table-cell-img>
        </template>
      </el-table-column>
      <!--<el-table-column label="对应商品" align="center" prop="prtitle" show-overflow-tooltip></el-table-column>-->
      <el-table-column label="对应链接" align="center" prop="contentlink" show-overflow-tooltip></el-table-column>
      <el-table-column label="不展示/展示" align="center" prop="mpbshow">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mpbshow" @change="bannerShow(scope)" active-color="#409EFF" inactive-color="#DBDCDC">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center" prop="mpbsort" :render-header="sortHeaderRender">
        <template slot-scope="scope">
          <el-input class="sort-input" @focus="indexDone(scope,0)" v-model.number="scope.row.mpbsort"
                    @change="sortChange" maxlength="11"></el-input>
          <el-button type="text" v-if="scope.$index == index && status == scope.row.mpbposition" @click="sortChange">保存</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editBanner(scope)">编辑</el-button>
          <el-button type="text" class="danger-text" @click="deleteBanner(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<block-title title="出游"></block-title>-->
    <!--<section class="add-banner tr">-->
      <!--<el-button type="primary" icon="el-icon-plus" @click="addClick(1)">新增</el-button>-->
    <!--</section>-->
    <!--<el-table v-loading="bannerLoading" :data="bannerList" stripe>-->
      <!--<el-table-column label="轮播图" align="center" prop="mpbpicture" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<table-cell-img :src="[scope.row.mpbpicture]" :key="scope.row.mpbpicture" width="92px" out-width="92px"></table-cell-img>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--&lt;!&ndash;<el-table-column label="对应商品" align="center" prop="prtitle" show-overflow-tooltip></el-table-column>&ndash;&gt;-->
      <!--<el-table-column label="对应链接" align="center" prop="contentlink" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column label="不展示/展示" align="center" prop="mpbshow">-->
        <!--<template slot-scope="scope">-->
          <!--<el-switch v-model="scope.row.mpbshow" @change="bannerShow(scope)" active-color="#409EFF" inactive-color="#DBDCDC">-->
          <!--</el-switch>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="权重" align="center" prop="mpbsort" :render-header="sortHeaderRender">-->
        <!--<template slot-scope="scope">-->
          <!--<el-input class="sort-input" @focus="indexDone(scope,1)" v-model.number="scope.row.mpbsort"-->
                    <!--@change="sortChange" maxlength="11"></el-input>-->
          <!--<el-button type="text" v-if="scope.$index == index && status == scope.row.mpbposition" @click="sortChange">保存</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作" align="center" fixed="right" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" @click="editBanner(scope)">编辑</el-button>-->
          <!--<el-button type="text" class="danger-text" @click="deleteBanner(scope)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->

    <el-dialog v-el-drag-dialog title="轮播图" :visible.sync="bannerDialog" top="5vh" @close="initBannerForm" :close-on-click-modal="false">
      <el-form :model="bannerForm" :rules="rules" ref="bannerFormRef" label-position="left"
               label-width="100px">
        <el-form-item label="轮播图" prop="mpbpicture">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleBannerSuccess"
            :before-upload="beforeImgUpload">
            <img v-if="bannerForm.mpbpicture" v-lazy="bannerForm.mpbpicture" class="avatar banner-img">
            <i v-else class="el-icon-plus avatar-uploader-icon banner-img"></i>
            <div slot="tip" class="el-upload__tip">
              建议为750 * 300，大小不要超过15M，上传成功后会显示，文件较大时请耐心等待
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="序号" prop="mpbsort">
          <el-input class="sort-input" v-model="bannerForm.mpbsort"></el-input>
        </el-form-item>
        <el-form-item label="不展示 / 展示" prop="mpbshow">
          <el-switch v-model="bannerForm.mpbshow" active-color="#409EFF" inactive-color="#DBDCDC">
          </el-switch>
        </el-form-item>
        <el-form-item label="链接" prop="contentlink">
          <el-input v-model="bannerForm.contentlink"></el-input>
        </el-form-item>
        <!--<el-form-item label="绑定商品" prop="prid">
          <product :list="productList"></product>
          &lt;!&ndash;<el-button class="bind-btn" @click="productDialog = true" v-if="productList.length">点击选择</el-button>&ndash;&gt;
          &lt;!&ndash;<el-button @click="getProduct" v-else>点击选择</el-button>&ndash;&gt;
          <el-button class="bind-btn" @click="getProduct">点击选择</el-button>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initBannerForm">取 消</el-button>
        <el-button type="primary" @click="addBanner">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import TableCellImg from "src/components/TableCellImg";
  import elDragDialog from 'src/directive/el-dragDialog'
  import { getStore } from "src/utils/index";
  import product from '../../components/Product/product'

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
        indexBannerLoading: false,
        indexBannerList: [],
        bannerLoading: false,
        bannerList: [],
        kw: '',
        index: -1,
        status :0
      }
    },
    computed: {
      // 上传图片
      uploadUrl() {
        return this.$api.upload_file + getStore('token') + '&type=index'
      }
    },
    directives: { elDragDialog },
    components: { TableCellImg, product },
    mounted() {
      this.getBanner()          // 获取banner
    },
    methods: {
      // 主图上传
      handleBannerSuccess(res, file) {
        this.bannerForm.mpbpicture = res.data;
      },
      // 上传前限制小于15M
      beforeImgUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }
        return isLt15M;
      },
      // 获取banner
      getBanner() {
        this.bannerLoading = true;
        this.$http.get(this.$api.list_mp_banner, {
          noLoading: true, params: {mpbposition:1 }}).then(res => {
          if (res.data.status == 200) {
            this.bannerList = res.data.data;
            this.bannerLoading = false;
          }
        });
        this.indexBannerLoading = true;
        this.$http.get(this.$api.list_mp_banner, {
          noLoading: true, params: {mpbposition:0 }}).then(res => {
          if (res.data.status == 200) {
            this.indexBannerList = res.data.data;
            this.indexBannerLoading = false;
          }
        })
      },
      //新增
      addClick(a){
        this.bannerDialog = true;
        this.bannerForm = {
          mpbid: '',
          mpbposition:a,
          mpbpicture: '',
          mpbsort: '',
          contentlink: '',
          mpbshow: false,
        }
      },
      // 新增banner的取消按钮
      initBannerForm() {
        this.$refs.bannerFormRef.resetFields();
        this.bannerForm = {
          mpbid: '',
          mpbposition:this.status,
          mpbpicture: '',
          mpbsort: '',
          contentlink: '',
          mpbshow: false,
        };
        this.bannerDialog = false;
      },
      // 添加banner
      addBanner() {
        this.$refs.bannerFormRef.validate(valid => {
          if (valid) {
            if(this.bannerForm.mpbid) {      // 编辑
              this.$http.post(this.$api.set_mp_banner, this.bannerForm).then(res => {
                if (res.data.status == 200) {
                  this.$notify({
                    title: '修改成功',
                    message: '此轮播图修改成功',
                    type: 'success'
                  });
                  this.bannerDialog = false;
                  this.getBanner()
                }
              });
            }else {                         // 新增
              this.$http.post(this.$api.set_mp_banner, this.bannerForm).then(res => {
                if (res.data.status == 200) {
                  this.initBannerForm();
                  this.$notify({
                    title: '新增成功',
                    message: '轮播图新增成功',
                    type: 'success'
                  });
                  this.getBanner()
                }
              })
            }
          }else {
            this.$message.warning('请根据校验信息完善表单!');
          }
        })
      },
      // 删除banner
      deleteBanner(scope) {
        let params = scope.row;
        // 最少保留一张轮播图
        let num = 0;
        for(let i in this.bannerList) {
          if(!this.bannerList[i].mpbshow) {
            num += 1
          }
        }
        if(num == this.bannerList.length - 1) {
          this.$message.error('请最少保留一张轮播图');
          return false
        }
        params.delete = true;
        // 删除轮播图
        this.$confirm('此操作将删除该轮播图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          params.isdelete = true;
          this.$http.post(this.$api.set_mp_banner, params).then(res => {
            if (res.data.status == 200) {
              this.$notify({
                title: '删除成功',
                message: '此轮播图已被删除',
                type: 'success'
              });
              this.getBanner();
            }
          });
        }).catch(() => { });
      },
      // banner的展示与否
      bannerShow(scope) {
        let msg = '';
        let params = scope.row;
        // 最少保留一张轮播图
        let num = 0;
        for(let i in this.bannerList) {
          if(!this.bannerList[i].mpbshow) {
            num += 1
          }
        }
        if(num == this.bannerList.length) {
          this.bannerList[scope.$index].mpbshow = true;
          this.$message.error('请最少保留一张轮播图');
          return false
        }

        if(!scope.row.mpbshow) {
          msg = '此轮播图不再展示'
        }else {
          msg = '此轮播图将会展示'
        }
        this.$http.post(this.$api.set_mp_banner, params).then(res => {
          if (res.data.status == 200) {
            this.$notify({
              title: '修改成功',
              message: msg,
              type: 'success'
            });
            this.getBanner();
          }
        });
      },
      // 编辑banner
      editBanner(scope) {
        this.bannerForm = JSON.parse(JSON.stringify(scope.row));

        this.bannerDialog = true
      },
      // 记录点击的是哪一行
      indexDone(scope,status) {
        this.index = scope.$index;
        this.status = status;
      },
      // 改变轮播图序号
      sortChange(v) {
        if(positiveNumberReg.test(this.bannerList[this.index].mpbsort)) {
          let params = this.bannerList[this.index];

          this.$http.post(this.$api.set_mp_banner, params).then(res => {
            if (res.data.status == 200) {
              this.$notify({
                title: '保存成功',
                message: '此轮播图序号已保存',
                type: 'success'
              });
              this.getBanner();         // 刷新banner
              this.index = -1;
            }
          });
        }else {
          this.$message.warning('请输入合理权重值(>0)');

        }
      },
      sortHeaderRender(h,{column}){
        return(
          <el-tooltip class="tooltip" placement="top">
          <span slot="content">
          权重是一个顺序展示的概念,数字小的放在前面,同权重按创建时间从早到晚排序
        </span>
        <div>{column.label}
        <i class="el-icon-question"></i>
          </div>
          </el-tooltip>
      )
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
