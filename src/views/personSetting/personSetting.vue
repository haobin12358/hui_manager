<template>
  <div class="container">
    <el-col :span="16">
      <el-form ref="form" :model="formData" :rules="rules" label-position="left" label-width="120px">
        <block-title title="提现账户"></block-title>
        <el-form-item label="开户行" prop="sabankname">
          <el-input v-model.trim="formData.sabankname" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="开户网点" prop="sabankdetail">
          <el-input v-model.trim="formData.sabankdetail" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="户名" prop="sacardname">
          <el-input v-model.trim="formData.sacardname" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="sacardno">
          <el-input v-model.trim="formData.sacardno" maxlength="100"></el-input>
        </el-form-item>
        <block-title title="开票账户"></block-title>
        <el-form-item label="公司名称" prop="sacompanyname">
          <el-input v-model.trim="formData.sacompanyname" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="纳税识别码" prop="saicidcode">
          <el-input v-model.trim="formData.saicidcode" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="地址电话" prop="saaddress">
          <el-input v-model.trim="formData.saaddress" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="sabankaccount">
          <el-input v-model.trim="formData.sabankaccount" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSave">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>

  </div>
</template>

<script>
  export default {
    name: "PersonSetting",

    components: {},

    data() {
      return {
        formData: {
          "sabankname": "",
          "sabankdetail": "",
          "sacardname": "",
          "sacardno": "",

          "saaddress": "",
          "sabankaccount": "",
          "sacompanyname": "",
          "saicidcode": "",
        },
        rules: {
          "sabankname":  [
            {required: true, message: '开户行必填', trigger: 'blur'}
          ],
          "sabankdetail":  [
            {required: true, message: '开户网点必填', trigger: 'blur'}
          ],
          "sacardname":  [
            {required: true, message: '开户人必填', trigger: 'blur'}
          ],
          "sacardno":  [
            {required: true, message: '卡号必填', trigger: 'blur'}
          ],

          "saaddress":  [
            {required: true, message: '地址电话', trigger: 'blur'}
          ],
          "sabankaccount":  [
            {required: true, message: '银行账户必填', trigger: 'blur'}
          ],
          "sacompanyname":  [
            {required: true, message: '公司名称必填', trigger: 'blur'}
          ],
          "saicidcode":  [
            {required: true, message: '纳税识别码必填', trigger: 'blur'}
          ],
        }
      }
    },

    computed: {},

    methods: {
      getData(){
        this.$http.get(this.$api.get_supplizeraccount, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              if(data){
                data.suid = '';
                data.said = '';
                this.formData = data;
              }else{

              }
            }
          }
        )
      },

      doSave() {
        this.$refs.form.validate(
          valid => {
            if (valid) {
              this.$http.post(this.$api.set_supplizeraccount, this.formData).then(
                res => {
                  if (res.data.status == 200) {
                    let resData = res.data,
                      data = res.data.data;

                    this.getData();
                    this.$notify({
                      title: '个人信息保存成功',
                      type: 'success'
                    });
                  }
                }
              )
            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        );

      },
    },

    created() {
      this.getData();

    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

  }
</style>
