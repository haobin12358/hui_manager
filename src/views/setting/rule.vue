<template>
  <div class="container">
    <el-table :data="tableData" v-loading="loading" >
      <el-table-column type="index" width="55" align="center" ></el-table-column>
      <el-table-column align="center" prop="amname" label="规则名"  ></el-table-column>
      <el-table-column align="center" prop="amcontent" label="内容" >
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="详情"
            width="400"
            trigger="hover"
          >
            <div v-html="scope.row.amcontent || '无'"></div>
            <el-button slot="reference" type="text" >预览</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin', 'super'])" label="操作" prop="mnstatus"  align="center" >
        <template slot-scope="scope">
          <el-button type="text" @click="doEditNote(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    <section class="table-bottom">-->
<!--      <el-pagination background :page-sizes="[10, 20, 30, 40]" :current-page="page_num"-->
<!--                     :page-size="page_size" :total="total" layout="total, sizes, prev, pager, next, jumper"-->
<!--                     @size-change="sizeChange" @current-change="pageChange"></el-pagination>-->
<!--    </section>-->
    <el-dialog :visible.sync="dlgVisible" :title="formData.amname + '规则内容'">
      <el-form ref="form" :model="formData" :rules="formRules" label-width="160px" label-position="left">
        <el-form-item label="内容" prop="amcontent">
          <div class="editor">
            <quill-editor ref="myTextEditor" :options="editorOption" v-model="formData.amcontent" :config="editorOption" @change="quillEditorChange($event)"></quill-editor>
          </div>

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
  import { quillEditor } from "vue-quill-editor";
  import 'quill/dist/quill.js';
  import { getStore } from "src/utils/index";
  const toolbarOptions = [
    ['bold','italic','underline','strike'],
    [{size:['small',false,'large','huge']}],
    [{font:[]}],
    [{color:[]}],
    [{align:[]}],
    ['link','image']
  ];
  export default {
    name: "rule",


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
          amcontent: "",
          amid:'',
          amtype: '',
          amname:'',
        },
        formRules: {
          amcontent: [
            {required: true, message: '内容必填', trigger: 'blur'}
          ],

        },
        editorOption: {
          modules:{
            toolbar:{
              container:toolbarOptions,
              handlers:{
                image:function (value) {
                  if(value){
                    document.getElementById('quill-img').click();
                  }else{
                    this.quill.format('image',false)
                  }
                }
              }
            }
          }
        },
      }
    },

    computed: {
      // 上传图片
      uploadUrl() {
        return this.$api.upload_file + getStore('token') + '&type=feedback'
      },
    },
    components: {quillEditor},
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
        this.$http.get(this.$api.list_role, {
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
          amcontent: "",
          amid:'',
          amname: "",
          amtype: ''
        }
        this.dlgVisible = true;
      },
      doEditNote(row){
        this.formData = {
          amcontent: row.amcontent,
          amid:row.amid,
          amname: row.amname,
          amtype: row.amtype
        }

        this.dlgVisible = true;
      },

      doSaveNote(){
        this.$refs.form.validate(
          valid => {
            if(valid){

                this.$http.post(this.$api.update_role,this.formData).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.getList();
                      this.$notify({
                        title: this.formData.amname+'规则编辑成功',
                        type: 'success'
                      });
                      this.dlgVisible = false;
                    }
                  }
                )

            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        )

      },
      quillEditorChange(e){
        console.log(e)
      },
      fileChange(file){
        let formData = new FormData();
        formData.append('file', file.target.files[0]);
        this.$http({method: 'post', url: this.uploadUrl, data: formData,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(
          res => {
            if (res.data.status == 200) {
              // this.imagesUrl.push({
              //   name: file.file.name,
              //   url: res.data.data
              // })
              document.getElementById('quill-img').value = '';
              this.quillImgSuccess(res)
            }else{
              this.$message.error(res.data.message);
            }
          }
        )
      },
      quillImgSuccess(res){
        let quill = this.$refs.myTextEditor.quill;
        let length = quill.getSelection().index;
        quill.insertEmbed(length,'image',res.data.data);
        quill.setSelection(length+1);

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
