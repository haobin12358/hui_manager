<template>
  <div class="container">
    <el-row>
      <el-col :span="16">
        <el-form :model="supplierForm" :rules="rules" ref="supplierForm" label-position="left" label-width="120px">
          <el-form-item label="供应商名称" prop="suname">
            <el-input v-model.trim="supplierForm.suname" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="品牌" v-if="name == 'shi'">
            <el-select
              v-model="supplierForm.pbids"
              clearable
              filterable
              multiple
              default-first-option
              placeholder="可查询" style="width: 500px">
              <el-option
                v-for="item in brandOptions"
                :key="item.pbid"
                :label="item.pbname"
                :value="item.pbid">
                <span style="float: left">{{ item.pbname }}</span>
                <img v-lazy="item.pblogo" style="float: right;width: 32px;height: 32px;padding: 2px;" alt="">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="sulinkman">
            <el-input v-model.trim="supplierForm.sulinkman" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="sulinkphone" >
            <el-input v-model.trim="supplierForm.sulinkphone" maxlength="11"
                      :placeholder="`${!this.supplierForm.suid? '同时作为登录账号' :''}`"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="suaddress">
            <el-input v-model.trim="supplierForm.suaddress" maxlength="100"></el-input>
          </el-form-item>

          <template v-if="!this.supplierForm.suid">
            <el-form-item label="登录密码" prop="supassword">
              <el-input v-model="supplierForm.supassword" maxlength="100"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="让利" prop="subaserate" v-if="name == 'shi'">
            <el-input v-model="supplierForm.subaserate" maxlength="5">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item label="头像" prop="suheader">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              accept="image/*"
              :on-success="handleHeaderSuccess"
              :before-upload="beforePicUpload"
            >
              <img v-if="supplierForm.suheader" :key="supplierForm.suheader" v-lazy="supplierForm.suheader"
                   class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

              <div slot="tip" class="el-upload__tip">
                建议为方形,大小不要超过15M,上传成功后会显示,上传大图请耐心等待
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="合同图" prop="sucontract" v-if="name == 'shi'">
            <el-upload
              class="swiper-uploader"
              :action="uploadVoucherUrl"
              accept="image/*"
              list-type="picture-card"
              :file-list="suContractUrl"
              :on-preview="handlePictureCardPreview"
              :before-upload="beforePicUpload"
              :on-remove="handleContractRemove"
              :http-request="uploadContract"
              :limit="20"
              :multiple="true">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">
                <span>可多选,大小不要超过15M,上传成功后会显示,上传大图请耐心等待.</span>
              </div>
            </el-upload>
          </el-form-item>


          <el-form-item label="银行" prop="subankname" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.subankname" maxlength="60"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号" prop="subanksn" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.subanksn" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="营业执照" prop="subusinesslicense" v-if="name == 'shi'">
            <el-upload
              :action="uploadUrl"
              class="avatar-uploader"
              accept="image/*"
              list-type="picture-card"
              :file-list="subusinesslicenseUrl"
              :limit="1"
              :on-success="handleSinessSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleLicenseRemove">
              <i  class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">请上传营业执照图片</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="注册资金" prop="suregisteredfund" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.suregisteredfund" maxlength="200">
              <template slot="append">万</template>
            </el-input>

          </el-form-item>
          <el-form-item label="主营类目" prop="sumaincategory" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.sumaincategory" maxlength="1000"></el-input>
          </el-form-item>

          <el-form-item label="注册时间" prop="suregisteredtime" v-if="name == 'shi'">
            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="supplierForm.suregisteredtime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="法人姓名" prop="sulegalperson" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.sulegalperson" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="供应商邮箱" prop="suemail" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.suemail" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="法人身份证" required v-if="name == 'shi'">
<!--            <el-col :span="11">-->
              <el-form-item  prop="sulegalpersonidcardfront" style="margin-bottom: 20px;">
                <el-upload
                  :action="uploadUrl"
                  class="avatar-uploader"
                  list-type="picture-card"
                  :file-list="sulegalpersonidcardfrontUrl"
                  :limit="1"
                  accept="image/*"
                  :on-success="handleFrontSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleFrontRemove">
<!--                  <img v-if="supplierForm.sulegalpersonidcardfront" :key="supplierForm.sulegalpersonidcardfront"-->
<!--                       class="avatar">-->
                  <i  class="el-icon-plus "></i>
                </el-upload>
                <div slot="tip" class="el-upload__tip">请上传法人身份证正面图片</div>
              </el-form-item>
<!--            </el-col>-->
<!--            <el-col :span="11">-->
              <el-form-item  prop="sulegalpersonidcardback" v-if="name == 'shi'">
                <el-upload
                  :action="uploadUrl"
                  class="avatar-uploader"
                  list-type="picture-card"
                  :file-list="sulegalpersonidcardbackUrl"
                  accept="image/*"
                  :on-success="handleBackSuccess"
                  :on-preview="handlePictureCardPreview"
                  :limit="1"
                  :on-remove="handleEndRemove">
<!--                  <img v-if="supplierForm.sulegalpersonidcardback" :key="supplierForm.sulegalpersonidcardback"-->
<!--                       class="avatar">-->
                  <i  class="el-icon-plus "></i>
                </el-upload>
                <div slot="tip" class="el-upload__tip">请上传法人身份证反面图片</div>
              </el-form-item>
<!--            </el-col>-->


          </el-form-item>
          <el-form-item label="押金" prop="sudeposit" v-if="name == 'shi'">
            <el-input v-model.trim="supplierForm.sudeposit"  maxlength="17"></el-input>
          </el-form-item>

          <el-form-item>

            <el-button type="primary" @click="changeState('usual')" v-if="supplierForm.sustatus == 'auditing'">通过</el-button>
            <el-button @click="changeState('forbidden')" v-if="supplierForm.sustatus == 'auditing'">拒绝</el-button>
            <el-button type="primary" @click="doSave" v-else>保存供应商</el-button>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <!--预览大图dialog-->
    <el-dialog :visible.sync="dialogVisible" top="8vh">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {getStore} from "src/utils/index";

  const percentReg = /^100$|^(\d|[1-9]\d)(\.\d{0,2})*$/;   //  百分数(>=0, <=100, 至多两位小数)
  export default {
    name: "SupplierEdit",

    components: {},

    data() {
      return {
        platformComRate: 0,

        brandOptions: [],
        supplierForm: {
          "suloginphone": "",
          "supassword": "",

          "suname": "",
          "sulinkman": "",
          "sulinkphone": "",
          "suaddress": "",
          pbids: [],

          subaserate: '',   //  让利

          "suheader": "",
          "sucontract": [],

          "subankname": " ",
          "subanksn": "",
          subusinesslicense:'',
          suregisteredfund:'',
          sumaincategory:'',
          sulegalperson:'',
          suemail:'',
          sulegalpersonidcardfront:'',
          sulegalpersonidcardback:'',
          sudeposit:'',
          suregisteredtime:'',
          sustatus:''

        },
        rules: {
          suloginphone: [
            {required: true, message: '供应商账号必填', trigger: 'blur'},
          ],
          supassword: [
            {required: true, message: '供应商密码必填', trigger: 'blur'},
          ],
          suname: [
            {required: true, message: '供应商名称必填', trigger: 'blur'},
          ],
          pbids: [
            {required: true, message: '品牌必选', trigger: 'blur'},
          ],
          sulinkman: [
            {required: true, message: '联系人必填', trigger: 'blur'},
          ],
          sulinkphone: [
            {required: true, message: '联系电话必填', trigger: 'blur'},
          ],
          suaddress: [
            {required: true, message: '联系地址必填', trigger: 'blur'},
          ],
          subaserate: [
            {required: true, message: '供应商让利必填', trigger: 'blur'},
            {pattern: percentReg, message: '请输入合理的百分数值(至多两位小数)', trigger: 'blur'},
          ],

          suheader: [
            {required: true, message: '供应商头像必传', trigger: 'change'},

          ],
          sucontract: [
            {required: true, message: '合同必传', trigger: 'change'},

          ],

          subankname: [
            {required: true, message: '开户银行必填', trigger: 'blur'},
          ],
          subanksn: [
            {required: true, message: '银行卡号必填', trigger: 'blur'},
          ],
          subusinesslicense:[
            {required: true, message: '营业执照必填', trigger: 'change'}
          ],
          suregisteredtime:[
            {required: true, message: '注册时间必填', trigger: 'change'}
          ],
          suregisteredfund:[
            {required: true, message: '注册资金必填', trigger: 'blur'},
          ],
          sumaincategory:[
            {required: true, message: '主营类目必填', trigger: 'blur'},
          ],
          sulegalperson:[
            {required: true, message: '法人必填', trigger: 'blur'},
          ],
          suemail:[
            {required: true, message: '供应商邮箱必填', trigger: 'blur'},
          ],
          sudeposit:[
            {required: true, message: '押金必填', trigger: 'blur'},
          ],
          sulegalpersonidcardfront:[
            {required: true, message: '身份证正面必填', trigger: 'change'}
          ],
          sulegalpersonidcardback:[
            {required: true, message: '身份证反面必填', trigger: 'change'}
          ]
        },

        pbSelect: '', //  先限制单选品牌
        suContractUrl: [],
        subusinesslicenseUrl:[],
        sulegalpersonidcardfrontUrl:[],
        sulegalpersonidcardbackUrl:[],
        //  大图预览
        dialogImageUrl: '',
        dialogVisible: false,
        name:'xu',
        recommend_list:[],
        recommendVisible:false,
        recommendLabel:'',
      }
    },
    watch: {
      suContractUrl(val) {
        this.supplierForm.sucontract = val.map(item => item.url);
      },
      subusinesslicenseUrl(val){
        this.supplierForm.subusinesslicense = (val.length && val[0].url) ||''
      },
      sulegalpersonidcardfrontUrl(val){

        this.supplierForm.sulegalpersonidcardfront = (val.length && val[0].url) ||'';
      },
      sulegalpersonidcardbackUrl(val){
        this.supplierForm.sulegalpersonidcardback = (val.length && val[0].url) ||'';
      }
    },
    computed: {
      uploadUrl() {
        return this.$api.upload_file + getStore('token') + '&type=avatar'
      },

      uploadVoucherUrl() {
        return this.$api.upload_file + getStore('token') + '&type=voucher'
      },
    },
    mounted(){
      this.name = this.$route.query.name
    },
    methods: {

      //删除营业执照
      handleLicenseRemove(file, fileList){
        // this.supplierForm.subusinesslicense = '';
        this.subusinesslicenseUrl = fileList
      },
      //删除正面
      handleFrontRemove(file, fileList){
        this.sulegalpersonidcardfrontUrl = fileList;
        // this.supplierForm.sulegalpersonidcardfront = '';
      },
      //删除反面
      handleEndRemove(file, fileList){
        this.sulegalpersonidcardbackUrl = fileList;
        // this.supplierForm.sulegalpersonidcardback = '';
      },
      //  分类主图上传
      handleHeaderSuccess(res, file) {
        console.log(res)
        this.supplierForm.suheader = res.data;
      },
      beforePicUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;

        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }

        return isLt15M;
      },

      //  预览图
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadContract(file) {
        let formData = new FormData();

        formData.append('file', file.file)

        this.$http({
          method: 'post',
          url: this.uploadVoucherUrl,
          data: formData,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = resData.data;

              this.suContractUrl.push({
                name: file.file.name,
                url: data,
              })
            }
          }
        );
      },
      //营业执照
      handleSinessSuccess(file){
        this.subusinesslicenseUrl.push({
          name: '',
          url: file.data,
        })
        this.supplierForm.subusinesslicense = file.data;
      },
      handleContractRemove(file) {
        this.suContractUrl = this.suContractUrl.filter(
          item => item.uid != file.uid
        )
      },
//正面
      handleFrontSuccess(file){
        this.sulegalpersonidcardfrontUrl.push({
          name: '',
          url: file.data,
        });
        this.supplierForm.sulegalpersonidcardfront = file.data;
      },
      //反面
      handleBackSuccess(file){
        this.sulegalpersonidcardbackUrl.push({
          name:'',
          url:file.data
        })
        this.supplierForm.sulegalpersonidcardback = file.data;
      },
      //审核通过/拒绝
      changeState(state){
        this.supplierForm.sustatus = state;
        this.$http.post(this.$api.update_supplizer, this.supplierForm).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.$router.push('/user/suppliers');
              this.$notify({
                title: '供应商编辑成功',
                message: `供应商名称:${this.supplierForm.suname}`,
                type: 'success'
              });
            }
          }
        )
      },
      doSave() {
        this.$refs.supplierForm.validate(
          valid => {
            if (valid) {
              this.supplierForm.sugrade = this.name == 'xu'?1:0;
              if (this.supplierForm.suid) {
                // this.supplierForm.pbids = [this.supplierForm.pbids];
                this.$http.post(this.$api.update_supplizer, this.supplierForm).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.$router.push('/user/suppliers');
                      this.$notify({
                        title: '供应商编辑成功',
                        message: `供应商名称:${this.supplierForm.suname}`,
                        type: 'success'
                      });
                    }
                  }
                )
              } else {
                this.supplierForm.suloginphone = this.supplierForm.sulinkphone;
                this.$http.post(this.$api.create_supplizer, this.supplierForm).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.$router.push('/user/suppliers');
                      this.$notify({
                        title: '供应商新增成功',
                        message: `供应商名称:${this.supplierForm.suname}`,
                        type: 'success'
                      });
                    }
                  }
                )
              }
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        )
      },

      //  获取没有绑定的品牌
      async getBrandList() {
        let res = await this.$http.get(this.$api.brand_list, {
          params: {
            free: true,
            pbstatus: 'upper',
          }
        });

        if (res.data.status == 200) {
          let resData = res.data,
            data = res.data.data;

          return data;
        }
      },

      async getSuDetail(suid) {
        let res = await this.$http.get(this.$api.get_supplizer, {
          params: {
            suid,
          }
        })

        if (res.data.status == 200) {
          let resData = res.data,
            data = res.data.data;

          return data;
        }
      },

      //  获取平台让利的比例
      getPlatformComRate() {
        this.$http.get(this.$api.get_commision, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.platformComRate = data.levelcommision[3] ? data.levelcommision[3] : 0;
              // this.commonSkuDev = data.levelcommision[3];
            }
          }
        )
      },
      //标签保存
      labelClick(index,name){
        this[name][index].active = !this[name][index].active;
      },
      recommendSave(){
        if(this.recommendLabel.replace(/^\s*|\s*$/g,"")){
          this.recommend_list.push({
            name:this.recommendLabel,
            active:true
          });
          this.recommendLabel = '';
        }
        this.recommendVisible = false;
      },
    },

    async created() {
      let brandList = await this.getBrandList();


      if (this.$route.query.suid) {
        this.$message.info('当前是编辑状态');

        let data = await this.getSuDetail(this.$route.query.suid);
        brandList = brandList.concat(data.pbs);

        this.brandOptions = brandList;

        this.supplierForm = {
          suid: data.suid,

          "suname": data.suname,
          "sulinkman": data.sulinkman,
          "sulinkphone": data.sulinkphone,
          "suaddress": data.suaddress,
          pbids: data.pbs.map(item => item.pbid),

          subaserate: data.subaserate || 0,
          "suheader": data.suheader,
          "sucontract": data.sucontract,

          "subankname": data.subankname,
          "subanksn": data.subanksn,
          subusinesslicense:data.subusinesslicense,
          suregisteredfund:data.suregisteredfund,
          sumaincategory:data.sumaincategory,
          sulegalperson:data.sulegalperson,
          suemail:data.suemail,
          sulegalpersonidcardfront:data.sulegalpersonidcardfront,
          sulegalpersonidcardback:data.sulegalpersonidcardback,
          sudeposit:data.sudeposit,
          suregisteredtime:data.suregisteredtime,
          sustatus:data.sustatus_en
        };

        this.subusinesslicenseUrl.push({url:data.subusinesslicense,name:''});
        this.sulegalpersonidcardfrontUrl.push({url:data.sulegalpersonidcardfront,name:''});
        this.sulegalpersonidcardbackUrl.push({url:data.sulegalpersonidcardback,name:''});
        this.suContractUrl = data.sucontract.map(item => {
          return {
            url: item
          }
        });
      } else {
        this.$message.info('当前是新增状态');
        this.brandOptions = brandList;

        // 仅新增时校验
        // this.getPlatformComRate();
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

  }
</style>
