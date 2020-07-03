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
        <el-form-item>
          <el-button type="primary" @click="doSaveCommonRate(1)">保存</el-button>
        </el-form-item>
      </el-form>
    </section>

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

        switch (sectionNum) {
          case 1:
            type = '等级佣金比例';

            saveData = {
              levelcommision: this.commonSetting.levelcommision
            };

            break;
        }
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
