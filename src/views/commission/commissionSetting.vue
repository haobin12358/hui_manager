<template>
  <div class="container ">
    <block-title title="等级佣金比例">
      <el-tooltip class="tooltip" placement="top">
            <span slot="content">
              一二三级代理佣金比例总和需要小于等于100%
            </span>
        <div>
          <i class="el-icon-question"></i>
        </div>
      </el-tooltip>
    </block-title>
    <section class="tool-bar">
      <el-form inline>
        <el-form-item label="一级代理佣金比例">
          <el-input v-model.number="commonSetting.levelcommision[0]" maxlength="5">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="二级代理佣金比例">
          <el-input v-model.number="commonSetting.levelcommision[1]" maxlength="5">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="三级代理佣金比例">
          <el-input v-model.number="commonSetting.levelcommision[2]" maxlength="5">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          |
        </el-form-item>
        <el-form-item label="平台佣金比例">
          <el-input v-model.number="commonSetting.levelcommision[3]" maxlength="5">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商佣金比例">
          <el-input v-model.number="commonSetting.levelcommision[4]" maxlength="5">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
    </section>
    <block-title title="升级相关"></block-title>
    <section class="tool-bar">
      <el-form inline label-width="140px">
        <el-form-item label="一级升二级要求：" >
          <div class="flex-start">
            <span>分享产生</span>
            <el-input v-model.number="commonSetting.leveluptwo" style="width: 20%;margin: 0 10px;">
            </el-input>
            <span>个一级成员</span>
          </div>
        </el-form-item>
        <el-form-item label="二级升三级要求：" >
          <div class="flex-start">
            <span>分享产生</span>
            <el-input v-model.number="commonSetting.levelupthree" style="width: 20%;margin: 0 10px;">
            </el-input>
            <span>个二级成员</span>
          </div>
        </el-form-item>
      </el-form>
    </section>

    <block-title title="降级规则"></block-title>
    <section class="tool-bar">
      <el-form inline label-width="140px">
        <div>
          <el-form-item label="三级降二级：" >
            <div class="flex-start">
              <span>考核期内未生成</span>
              <el-input v-model.number="commonSetting.leveldowntwo" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个二级成员，每生成1个三级人员，可替代</span>
              <el-input v-model.number="commonSetting.leveldowntworep" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个二级成员</span>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="二级降一级：" >
            <div class="flex-start">
              <span>考核期内未生成</span>
              <el-input v-model.number="commonSetting.leveldownone" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个一级成员，每生成1个二级人员，可替代</span>
              <el-input v-model.number="commonSetting.leveldownonerep" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个一级成员</span>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="一级降普通：" >
            <div class="flex-start">
              <span>考核期内未生成</span>
              <el-input v-model.number="commonSetting.leveldownzero" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个普通级成员，每生成1个一级人员，可替代</span>
              <el-input v-model.number="commonSetting.leveldownzerorep" style="width: 8%;margin: 0 10px;">
              </el-input>
              <span>个普通成员</span>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </section>

    <block-title title="奖金规则"></block-title>
    <section class="tool-bar">
      <el-form inline label-width="140px">
        <el-form-item label="团队成员升二级" >
          <div class="flex-start">
            <el-input v-model.number="commonSetting.leveluptworeward" style="width: 40%;margin: 0 10px;">
            </el-input>
            <span>元</span>
          </div>
        </el-form-item>
        <el-form-item label="团队成员升三级" >
          <div class="flex-start">
            <el-input v-model.number="commonSetting.levelupthreereward" style="width: 40%;margin: 0 10px;">
            </el-input>
            <span>元</span>
          </div>
        </el-form-item>
      </el-form>
    </section>

    <block-title title="考核时间"></block-title>
    <section class="tool-bar">
      <el-form inline label-width="140px">
        <el-form-item label="降级定时检测规则" >
          <div class="flex-start">
            <el-input v-model.number="commonSetting.checktime" style="width: 30%;margin: 0 10px;">
            </el-input>
            <span>天</span>
          </div>
        </el-form-item>
      </el-form>
    </section>
      <el-button type="primary" @click="doSaveCommonRate">保存</el-button>
  </div>
</template>

<script>
  const percentReg = /^100$|^(\d|[1-9]\d)(\.\d{0,2})*$/;   //  百分数(>=0, <=100, 至多两位小数)

  export default {
    name: "CommissionSetting",

    components: {},

    data() {
      return {
        commonSetting: {
          "levelcommision": [0, 0, 0, 0, 0]
        },

        searchForm: {
          name: '',
          mobile: '',
        },

        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
      }
    },

    computed: {},

    methods: {
      commonCheckRate(sectionNum) {
        const checkRate = (x) => {
          for (let item in x) {
            if (!x[item]) {
              return false
            }
          }

          return true
        }

        switch (sectionNum) {
          case 1:
            if (!checkRate(this.commonSetting.levelcommision)) {
              return false
            }
            break;
        }

        return true
      },

      doSaveCommonRate(sectionNum) {
        let saveData = {},
          type = '';


        // if(!this.commonCheckRate(sectionNum)){
        //   this.$message.warning('请检查填写内容格式')
        //   return
        // }


        saveData = this.commonSetting

        type += '设置';

        this.$confirm(`确认保存${type}?`, '提示').then(
          () => {
            this.$http.post(this.$api.update_commision, saveData).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.getCommisionSetting();
                  this.$notify({
                    title: `${type}保存成功`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },
      getCommisionSetting() {
        this.$http.get(this.$api.get_commision, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.commonSetting = data;
            }
          }
        )
      },




    },

    created() {
      this.getCommisionSetting();

    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 120px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      /*margin-bottom: 0;*/
      width: 50%;
    }
  }
</style>
