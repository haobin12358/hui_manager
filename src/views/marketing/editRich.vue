<template>
  <div class="container">
    <el-row>
      <block-title title="富文本详情"></block-title>
      <el-col :span="14">
        <el-form :model="formData" :rules="rules" ref="formData"  label-position="left"
                 label-width="140px">
          <el-form-item label="内容" prop="lccontent">
            <div class="editor">
              <quill-editor ref="myTextEditor" :options="editorOption" v-model="formData.lccontent" :config="editorOption" @change="quillEditorChange($event)"></quill-editor>
            </div>

          </el-form-item>

          <el-form-item v-if="$store.state.user.userInfo.level != 'personal'">
            <el-button type="primary" @click="checkFormData">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <input type="file" id="quill-img" class="quill-img" accept="image/*" @change="fileChange">
  </div>
</template>

<script>
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
    name: "editScenic",

    data(){
      return{
        formData:{
          lccontent:'',
          delete:false,
          lcid:''
        },

        rules: {

          lccontent:[
            { required: true, message: '景区详情必填', trigger: 'blur' }
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
        return this.$api.upload_file + getStore('token') + '&type=rich'
      },
    },
    components: {quillEditor},
    mounted() {

      if(this.$route.query.rich){
        this.getFormData(this.$route.query.rich);           //
      }

    },
    methods: {

      // 上传前限制小于15M
      beforeImgUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }
        return isLt15M;
      },
      getFormData(row){

        let data = JSON.parse(row);

        this.formData =  {

          lcid:data.lcid,

          lccontent:data.lccontent,
          delete:false

        }


      },
      // 保存按钮
      checkFormData() {
        this.$refs.formData.validate(valid => {
          if (valid) {
              this.$http.post(this.$api.set_linkcontent, this.formData).then(res => {
                if (res.data.status == 200) {
                  this.$notify({
                    title: '保存成功',
                    message: '富文本发布成功',
                    type: 'success'
                  });
                  this.$router.push('/marketing/richList');
                }
              });

          }else {
            this.$message.warning('请根据校验信息完善表单!');
          }
        })
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
    }
  }
</script>

<style scoped lang="less">
  @import "../../styles/myIndex";

  .container {
    .m-scenic-img{
      display: inline-block;
      width: 220px;
      height: 100px;
    }
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .contract-img {
      .wl(300px, auto);
      max-height: 100%;
      margin-right: 30px;
      border: 1px solid black;
    }
    .quill-img{
      opacity: 0;
      position: fixed;
      bottom: -100px;
    }

  }
</style>
