<template>
  <div class="container">
    <el-row>
      <el-col :span="16">
        <el-form :model="formData" :rules="rules" ref="formData" label-position="left"
                 label-width="140px">
<!--          <block-title title="基本信息"></block-title>-->
          <el-form-item label="商品名称" prop="prname">
            <el-input v-model="formData.prname"></el-input>

          </el-form-item>
        <el-form-item label="封面图" prop="primg">
          <el-upload
            class="avatar-uploader m-ticket"
            :action="uploadUrl"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleMainPicSuccess"
            :before-upload="beforeImgUpload">
            <img v-if="formData.primg" v-lazy="formData.primg" :key="formData.primg" class="avatar circle-main-img" />
            <i v-else class="el-icon-plus avatar-uploader-icon circle-main-img"></i>
            <div slot="tip" class="el-upload__tip">
              建议尺寸：750*750像素，大小最好在10M以内
            </div>
          </el-upload>
        </el-form-item>
          <el-form-item label="顶部轮播图" prop="tibanner">
            <div class="m-up-img-box">
              <div class="inputbg m-img-xl el-upload-list--picture-card" v-for="(item,index) in formData.prbanner">
                <img :src="item"  style="width: 178px;height:178px;"/>
                <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="previewImage(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="deleteImage(index)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
              </div>
              <div class="inputbg m-img-xl"><span>+</span><input type="file" multiple="multiple" id="prDesc"  accept="image/*" @change="newUploadImages"></div>
            </div>
              <div  class="el-upload__tip">
                <span>可多选,建议尺寸为750x750(px),大小不要超过15M,上传成功后会显示,上传大图请耐心等待.</span>
              </div>

          </el-form-item>
          <el-form-item label="是否限时" required>
            <el-switch
              v-model="formData.prtimelimeted"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <el-form-item label="发放时间" required v-if="formData.prtimelimeted">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="使用时间" required v-if="formData.prtimelimeted">
            <el-date-picker
              v-model="time1"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="采购价" prop="purchaseprice">
            <el-input v-model="formData.purchaseprice">
              <template slot="prepend">¥</template>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="原价" prop="prlineprice">-->
            <!--<el-input v-model="formData.prlineprice">-->
              <!--<template slot="prepend">¥</template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="现价" prop="prtrueprice">-->
            <!--<el-input v-model="formData.prtrueprice">-->
              <!--<template slot="prepend">¥</template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="数量" prop="prnum">
            <el-input v-model="formData.prnum" >
              <!--<template slot="append">张</template>-->
            </el-input>
          </el-form-item>
<!--          <el-form-item label="规则" prop="tirules">-->
<!--            <el-input v-model="formData.tirules" type="textarea">-->
<!--            </el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="详情" prop="prdetails">
            <div class="editor">
              <quill-editor ref="myTextEditor" @change="quillEditorChange($event)" :options="editorOption" v-model="formData.prdetails" :config="editorOption"></quill-editor>
            </div>

          </el-form-item>
          <el-form-item label="所属供应商" prop="suid">
            <el-select v-model="formData.suid" placeholder="请选择">
              <el-option
                v-for="item in supplizer_list"
                :key="item.suid"
                :label="item.suname"
                :value="item.suid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="定位" prop="address">

            <div>{{formData.address ||  '请点击地图选择详细定位'}}</div>

            <el-row style="margin-bottom: 20px;">
              <el-col :span="6">
                <el-input id="localcity" type="textbox" v-model="search" />
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="geolocation_localcity">查询</el-button>
              </el-col>
            </el-row>


            <span style="height:30px;display:none;" id="city"></span>
<!--            <input type="button" value="search" onclick="geolocation_localcity()">-->
            <div id="container" style="width:600px;height:300px;"></div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitDraft">立即发布</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <input type="file" multiple="true" id="quill-img" class="quill-img" accept="image/*" @change="fileChange">
    <!--预览大图dialog-->
    <el-dialog :visible.sync="dialogVisible" top="8vh">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { quillEditor } from "vue-quill-editor";
  import ImgsDragSort from 'src/components/ImgsDragSort/index'
  import 'quill/dist/quill.js';
  import { getStore } from "src/utils/index";


  const toolbarOptions = [
    ['bold','italic','underline','strike'],
    [{size:['small',false,'large','huge']}],
    [{font:[]}],
    [{color:[]}],
    [{align:[]}],
    ['link','image','video']
  ];
  const moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/;
  const positiveNumberReg = /^([1-9]\d*)$/;   //  正整数
  let citylocation,map,marker,geocoder = null;
  export default {
    name: "editTicket",
    data(){
      return{
        formData:{
          primg:'',
          prrules:'',
          prnum:0,
          prissuestarttime:'',
          prissueendtime:'',
          purchaseprice:0,
          prname:'',
          interrupt:false,
          prdetails:'',
          prabbreviation:'',
          prcategory:[],
          delete:false,
          prusestarttime:'',
          pruseendtime:'',
          prbanner:[],
          suid:'',
          address:'',
          longitude:'',
          latitude:'',
          prtimelimeted: false
        },
        options: [],
        rules: {
          prrules: [
            { required: true, message: '规则必填', trigger: 'blur' }
          ],
          prname: [
            { required: true, message: '商品名称必填', trigger: 'blur' }
          ],
          purchaseprice: [
            { required: true, message: '采购价必填', trigger: 'blur' },
            {pattern: moneyReg, message: '请输入合理的价格(至多2位小数)', trigger: 'blur'},
          ],
          primg: [
            { required: true, message: '商品封面必填', trigger: 'blur' }
          ],
          prdetails: [
            { required: true, message: '详情必填', trigger: 'blur' }
          ],
          prnum: [
            { required: true, message: '票数必填', trigger: 'blur' },
              {pattern: positiveNumberReg, message: '请输入合理的张数', trigger: 'blur'}
          ],
          prabbreviation: [
            { required: true, message: '短语简介必填', trigger: 'blur' }
          ],
          prbanner:[
            { required: true, message: '商品轮播图必填', trigger: 'change' }
          ],
          suid:[
            {required:true,message:'所属供应商必选',trigger:'change'}
          ],
          address:[
            {required:true,message:'定位必选',trigger:'change'}          ]
        },
        time:[],
        time1:[],
        label:'',
        enterVisible:false,
        enter_list:[],
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
        agree:false,
        dialogImageUrl:'',
        dialogVisible:false,
        supplizer_list:[],
        geocoder:'',
        search:''
      }
    },
    computed: {
      // 上传图片
      uploadUrl() {
        return this.$api.upload_file + getStore('token') + '&type=ticket'
      },
    },
    watch :{
      time(oldvalue,newvalue){
        console.log(oldvalue);
        // this.initArray();
      },
      time1(oldvalue,newvalue){

      },
    },
    components: {quillEditor,ImgsDragSort},
    mounted() {
      this.getSupplier();
      if(this.$route.query.id){
        this.getFormData(this.$route.query.id);

      }
      this.init();

    },
    methods: {
      geolocation_localcity() {
        let that = this;
        console.log(citylocation,'asdasd')
        // citylocation.searchCityByName(that.search);
        geocoder.getLocation(that.search);
      },
      init() {
        //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        //设置地图中心点
        let that = this;
        var center = new qq.maps.LatLng(39.916527,116.397128);
        map = new qq.maps.Map(document.getElementById('container'),{
          center: center,
          zoom: 13
        });
        var city = document.getElementById("city");
        citylocation = new qq.maps.CityService({
          complete : function(results){
            map.setCenter(results.detail.latLng);
            // if (marker != null) {
            //   marker.setMap(null);
            // }
            // marker = new qq.maps.Marker({
            //   map: map,
            //   position: results.detail.latLng
            // });
          }
        });
        geocoder = new qq.maps.Geocoder({
          complete : function(result){
            map.setCenter(result.detail.location);
            // var marker = new qq.maps.Marker({
            //   map:map,
            //   position: result.detail.location
            // });
          }
        });

        var info = new qq.maps.InfoWindow({map: map});
        //获取城市列表接口设置中心点
        // var citylocation = new qq.maps.CityService({
        //   complete : function(result){
        //     map.setCenter(result.detail.latLng);
        //   }
        // });
        // 调用searchLocalCity();方法    根据用户IP查询城市信息。
        citylocation.searchLocalCity();
        qq.maps.event.addListener(
          map,
          'click',
          function(event) {
            console.log(event);
            // var latLng = new qq.maps.LatLng(event.latLng.getLng(), event.latLng.getLat());
            that.$http({method: 'get', url: that.$api.news_location,  params: {
                longitude: event.latLng.getLng(),
                latitude: event.latLng.getLat()
              }
              }).then(
              res => {
                if (res.data.status == 200) {
                  // console.log(res.data.data.nelocation)
                  // that.$confirm( `确定定位在${res.data.data.nelocation}吗`, '提示', {
                  //   confirmButtonText: '确定',
                  //   cancelButtonText: '取消',
                  //   type: 'warning'
                  // }).then(() => {
                    that.formData.address = res.data.data.nelocation;
                    that.formData.longitude = event.latLng.getLng();
                    that.formData.latitude = event.latLng.getLat();
                }
              }
            )
          }
        );
      },
      // 主图上传
      handleMainPicSuccess(res, file) {

        this.formData.primg = res.data;
        console.log(this.formData.primg)
      },

      newUploadImages(e){

        for(let i =0;i<e.target.files.length;i++){
          let formData = new FormData();
          formData.append('file', e.target.files[i]);
          this.$http({method: 'post', url: this.uploadUrl, data: formData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(
            res => {
              if (res.data.status == 200) {
                // this.imagesUrl.push({
                //   name: file.file.name,
                //   url: res.data.data
                // })
                let file = document.getElementById('prDesc');
                file.value ='';

                this.formData.prbanner.push(res.data.data);
              }else{
                this.$message.error(res.data.message);
              }
            }
          )
        }
      },
      previewImage(item){
        this.dialogImageUrl = item;
        this.dialogVisible = true;
      },
      deleteImage(index){
        this.formData.prbanner.splice(index,1)
      },
      // 上传前限制小于15M
      beforeImgUpload(file) {
        const isLt15M = file.size / 1024 / 1024 < 15;
        if (!isLt15M) {
          this.$message.error('上传图片大小不能超过 15MB!');
        }
        return isLt15M;
      },
      getSupplier() {
        this.loading = true;
        this.$http.get(this.$api.supplizer_list, {
          noLoading: true,
          params: {
            page_num: 1,
            page_size: 100,
            option:'ticket'
          },
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.supplizer_list = data;

            }
          }
        )
      },
      getFormData(id){
        this.$http.get(this.$api.ticket_get, {
          noLoading: true,
          params: {
            prid: id,
          },
        }).then(
          res => {
            this.loading = false;
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;
              //
              this.formData = {
                primg:data.primg,
                prrules:data.prrules,
                prnum:data.prnum,
                prissuestarttime:data.prissuestarttime,
                prissueendtime:data.prissueendtime,
                // prlineprice:data.prlineprice,
                prname:data.prname,
                  interrupt:false,
                prdetails:data.prdetails,
                purchaseprice:data.purchaseprice,
                prabbreviation:data.prabbreviation,
                  delete:false,
                prid:data.prid,
                pruseendtime:data.pruseendtime,
                prusestarttime:data.prusestarttime,
                prbanner:data.prbanner,
                address:data.address,
                longitude:data.longitude,
                latitude:data.latitude,
                prtimelimeted: Boolean(data.prtimelimeted),
                suid:data.suid
              }
              // this.time[0] = new Date(this.formData.plstarttime);
              // this.time[1] = new Date(this.formData.plendtime);
              // let arr = [];
              // let _arr = [].concat(data.linkage);
              // if(_arr.length > 0){
              //   for(let i=0;i<_arr.length;i++){
              //     arr.push(_arr[i].liid);
              //   }
              //   delete this.formData.linkage;
              //   this.formData.liids = [].concat(arr);
              // }
              if(data.prtimelimeted){
                this.time = [this.formData.prissuestarttime, this.formData.prissueendtime];
                this.time1 = [this.formData.prusestarttime,this.formData.pruseendtime];
              }else{
                this.time = [];
                this.time1 = [];
              }

              //标签

              // let enter =[];
              // for(let i in this.formData.ticategory){
              //   enter.push({name:this.formData.ticategory[i],active:true});
              //
              // }
              //
              // this.enter_list = enter;

            }
          }
        )
      },
      //  保存报名项
      enterSave(){
        if(this.label.replace(/^\s*|\s*$/g,"")){
          this.enter_list.push({
            name:this.label,
            active:true
          });
          this.label = '';
        }
        this.enterVisible = false;
      },
      //标签保存
      labelClick(index,name){
        this[name][index].active = !this[name][index].active;
      },
      postData(status){

        this.$refs.formData.validate(valid => {
          if (valid) {

            // this.formData.ticategory = [].concat(enter);
            if(this.formData.prtimelimeted){
              this.formData.prissuestarttime = this.time[0];
              this.formData.prissueendtime = this.time[1];
              this.formData.prusestarttime = this.time1[0];
              this.formData.pruseendtime = this.time1[1];
            }else{
              this.formData.prissuestarttime = '';
              this.formData.prissueendtime = '';
              this.formData.prusestarttime = '';
              this.formData.pruseendtime = '';
            }
           this.formData.prtimelimeted = this.formData.prtimelimeted ? 1: 0
            this.formData.purchaseprice = Number(this.formData.purchaseprice);
            // this.formData.prtrueprice = Number(this.formData.prtrueprice);
            this.formData.prnum = Number(this.formData.prnum);
            if(this.formData.prid) {      // 编辑
              this.$http.post(this.$api.update_product, this.formData).then(res => {
                if (res.data.status == 200) {
                  this.$notify({
                    title: '编辑成功',
                    message: '商品编辑成功',
                    type: 'success'
                  });
                  this.$router.push('/ticket/index')
                }
              });
            }else {                         // 新增
              this.$http.post(this.$api.create_product, this.formData).then(res => {
                if (res.data.status == 200) {
                  this.$notify({
                    title: '新增成功',
                    message: '商品新增成功',
                    type: 'success'
                  });
                  this.$router.push('/ticket/index')
                }
              });
            }
          }else {
            this.$message.warning('请根据校验信息完善表单!');
          }
        })

      },
      //立即发布
      submitDraft(){

        this.postData();
      },
      quillEditorChange(e){
        console.log(e)
      },
      fileChange(file){
        for(let i =0;i<file.target.files.length;i++){
          let formData = new FormData();
          formData.append('file', file.target.files[i]);
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
        }

      },
      quillImgSuccess(res){
        let quill = this.$refs.myTextEditor.quill;
        let length = quill.getSelection().index;
        quill.insertEmbed(length,'image',res.data.data);
        quill.setSelection(length+1);

      },


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
    .m-icon{
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 40px;
    }

    .m-cost-box{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-start;
    }

    .el-form-item .el-form-item{
      margin-bottom: 20px;
      .el-input{
        width: 200px;
      }
      .el-textarea{
        width: 200px;
      }
    }

    .m-label-box{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      .m-label{
        display: block;
        min-width: 120px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding: 0 20px;
        border:1px solid #3498DB;
        color: #3498DB;
        margin-right: 30px;
        margin-bottom: 20px;
        text-align: center;
        &.active{
          background-color: #3498DB;
          color: #fff;
        }
      }
    }
    .m-blue{
      color:#3498DB;
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
    .el-upload-list--picture-card .el-upload-list__item-actions:hover {
      opacity: 1;
    }
    .m-up-img-box{
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap!important;
      margin-bottom: 20px;
      .el-upload-list__item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0,0,0,.5);
        -webkit-transition: opacity .3s;
        transition: opacity .3s;
        border-radius: 6px;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        span {
          cursor: pointer;
        }
      }
    }
    .inputbg{
      margin: 0  10px  10px 0;
      /*color: #97ADCB;*/
      color: #999;
      border: 1px solid #eeeeee;
      background-color: #fbfdff;
      border-radius: 6px;
      font-size: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: relative;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .inputbg input{
      position: absolute;
      top: 0;
      left: 0;
      opacity:0;
      filter:alpha(opacity=0);
      width: 178px;
      height: 178px;
      line-height: 178px;
      cursor: pointer;
    }
  }
</style>
