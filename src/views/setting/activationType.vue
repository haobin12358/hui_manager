<template>
  <div class="container">
    <el-table :data="tableData" v-loading="loading" >
      <el-table-column type="index" width="55" align="center" ></el-table-column>
      <el-table-column label="活跃分获取类型" prop="attname" align="center" ></el-table-column>
      <el-table-column label="活跃度" prop="attnum" align="center" ></el-table-column>
      <el-table-column label="活跃度上限" prop="attupperlimit" align="center" ></el-table-column>
      <el-table-column label="每日获取上限" prop="attdayupperlimit"  align="center" ></el-table-column>
      <el-table-column v-if="checkPermission(['admin', 'super'])" label="操作" prop="mnstatus" width="180" align="center" >
        <template slot-scope="scope">
          <el-button type="text" @click="doEditNote(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <section class="table-bottom">
      <el-pagination background :page-sizes="[10, 20, 30, 40]" :current-page="page_num"
                     :page-size="page_size" :total="total" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="sizeChange" @current-change="pageChange"></el-pagination>
    </section>
    <el-dialog :visible.sync="dlgVisible" :title="formData.attid ? '编辑活跃分' : '新增活跃分'">
      <el-form ref="form" :model="formData" :rules="formRules" label-width="160px" label-position="left">
        <el-form-item prop="attname" label="活跃分获取类型">
          <el-input v-model="formData.attname" type="text"  maxlength="1000"></el-input>
        </el-form-item>
        <el-form-item prop="attnum" label="活跃度">
          <el-input v-model="formData.attnum" type="number"  ></el-input>
        </el-form-item>
        <el-form-item prop="attupperlimit" label="活跃度上限">
          <el-input v-model="formData.attupperlimit" type="number"  ></el-input>
        </el-form-item>
        <el-form-item prop="attdayupperlimit" label="每日获取上限">
          <el-input v-model="formData.attdayupperlimit" type="number"  ></el-input>
        </el-form-item>
        <el-form-item label="图标"  v-if="formData.atttype == 1">
          <el-upload
            class="avatar-uploader m-draft"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleMainPicSuccess"
            :before-upload="beforeImgUpload">
            <img v-if="formData.atticon" v-lazy="formData.atticon" :key="formData.atticon" class="avatar circle-main-img" />
            <i v-else class="el-icon-plus avatar-uploader-icon circle-main-img"></i>
<!--            <div slot="tip" class="el-upload__tip">-->
<!--              建议尺寸：750*350像素，大小最好在10M以内-->
<!--            </div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSaveNote">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import checkPermission from 'src/utils/permission' // 权限判断函数
  import { getStore } from "src/utils/index";
  export default {
    name: "activationType",

    components: {},

    data() {
      return {
        loading: false,
        page_num: 1,
        page_size: 10,
        total: 0,
        tableData: [],

        dlgVisible: false,
        statusOption: [
          {
            label: '发布',
            value: 'publish'
          },{
            label: '草稿',
            value: 'draft'
          },
        ],
        formData:{
          "attnum": "",
          attid:'',
          "attname": "",
          attupperlimit: '',
          attdayupperlimit:'',
          atttype:0,
          atticon:''
        },
        formRules: {
          "attname": [
            {required: true, message: '活跃分获取类型必填', trigger: 'blur'}
          ],
          attnum:[
            {required: true, message: '活跃度必填', trigger: 'blur'}
          ],
          attupperlimit: [
            {required: true, message: '活跃度上限必填', trigger: 'blur'}
          ],
          attdayupperlimit:[
            {required: true, message: '每日获取上限', trigger: 'blur'}
          ]
        }
      }
    },

    computed: {
      // 上传图片
      uploadUrl() {
        return this.$api.upload_file + getStore('token') + '&type=feedback'
      },
    },
    methods: {
      checkPermission,
      // 图标上传
      handleMainPicSuccess(res, file) {

        this.formData.atticon = res.data;
        console.log(this.formData.atticon)
      },
      // 上传前限制小于15M
      beforeImgUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }
        return isLt15M;
      },
      getList() {
        this.$http.get(this.$api.list_activationtype, {
          params: {
            page_num:this.page_num,
            page_size:this.page_size
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.tableData = data;
              this.total = resData.total_count;
            }
          }
        )
      },

      sizeChange(val) {
        this.page_size = val;
        this.getList();
      },
      pageChange(val) {
        this.page_num = val;
        this.getList();
      },
      // renderHeader(h) {
      //   return h('el-button', {
      //     props: {
      //       type: 'primary',
      //     },
      //     on: {
      //       click: () => {
      //         this.doAddNote();
      //       }
      //     }
      //   }, '新增');
      // },

      doAddNote(){
        this.formData = {
          attnum: "",
          attid:'',
          attname: "",
          attupperlimit: '',
          attdayupperlimit:''
        }
        this.dlgVisible = true;
      },
      doEditNote(row){
        this.formData = {
          attnum: row.attnum,
          attid:row.attid,
          attname: row.attname,
          attupperlimit: row.attupperlimit,
          attdayupperlimit:row.attdayupperlimit,
          atticon:row.atticon,
          atttype:row.atttype
        }

        this.dlgVisible = true;
      },

      doSaveNote(){
        this.$refs.form.validate(
          valid => {
            if(valid){
              if(this.formData.attid){
                this.$http.post(this.$api.update_activationtype,this.formData).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.getList();
                      this.$notify({
                        title: '活跃分编辑成功',
                        type: 'success'
                      });
                      this.dlgVisible = false;
                    }
                  }
                )
              }else {
                this.$http.post(this.$api.update_activationtype,this.formData).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.getList();
                      this.$notify({
                        title: '活跃分新增成功',
                        type: 'success'
                      });
                      this.dlgVisible = false;
                    }
                  }
                )
              }
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
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
