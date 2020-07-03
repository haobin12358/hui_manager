<template>
  <div class="container">
    <block-title title="审批层级管理"></block-title>
    <el-table :data="levelData" v-loading="loading" stripe>
      <el-table-column prop="pe_level" label="层级" align="center" width="155"></el-table-column>
      <el-table-column label="关联标签用户组" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions v-for="item in scope.row.permission" :key="item.piid"
               closable   @close="doDeletePe(item)" style="margin: 0 10px 2px 0;">
            {{item.piname}}
          </el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" class="danger-text" @click="doDeletePe(scope.row)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <block-title title="权限标签管理"></block-title>
    <el-table :data="itemData" v-loading="loading" stripe>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="标签组名称" prop="piname" align="center"></el-table-column>
      <el-table-column label="管理员" prop="name" align="center">
        <template slot-scope="scope">
          <el-tag disable-transitions v-for="item in scope.row.admin" :key="item.adid" style="margin: 0 10px 2px 0;">
            {{item.adname}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编辑" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="doEditItemName(scope.row)">修改标签名</el-button>
          <el-button type="text" @click="doEditItemAds(scope.row)">修改管理员</el-button>
          <el-button type="text" @click="doEditItemAuth(scope.row)">修改所属层级</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <el-button type="text" class="danger-text" @click="doDeletePi(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dlgVisible" width="700px" v-el-drag-dialog :close-on-click-modal="false"
               :title="dlgTitle">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="left">
        <el-form-item v-if="editType == '' || editType == 1" label="标签名" prop="piname">
          <el-input v-model.trim="form.piname" maxlength="100" ></el-input>
        </el-form-item>
        <el-form-item v-if="editType == '' || editType == 2" label="关联管理员" prop="ad_list">
          <el-select v-model="form.ad_list" multiple filterable style="width: 400px">
            <el-option v-for="item in adminList" :key="item.adid" :value="item.adid"
                       :label="item.adname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="editType == '' || editType == 3" label="所属层级" prop="pelevel">
          <el-select v-model="form.pelevel" style="width: 400px">
            <el-option v-for="item in levelOptions" :key="item" :value="item"
                       :label="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dlgVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSaveItem">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from 'src/directive/el-dragDialog'

  export default {
    name: "twoSettingTable",

    directives: {elDragDialog},

    components: {},

    props: {
      ptid: {
        type: String,
        default: '',
      },
      // levelData: {
      //   type: Array,
      //   default: [],
      // },
      // itemData: {
      //   type: Array,
      //   default: [],
      // },

    },

    data() {
      return {
        levelData: [],
        itemData: [],
        loading: false,

        dlgVisible: false,
        editType: '',
        adminList: [],
        levelOptions: [],
        form: {
          piname: '',
          ad_list: [],
          pelevel: '',
        },
        rules: {
          piname: [
            {required: true, message: '标签名称必填', trigger: 'blur'}
          ],
          ad_list: [
            // {required: true, message: '关联管理员必选', trigger: 'change'}
          ],
          pelevel: [
            {required: true, message: '所属层级必选', trigger: 'change'}
          ],
        }

      }
    },

    computed: {
      dlgTitle() {
        switch (this.editType) {
          case  '':
            return '新增标签';
          case '1':
            return '修改名称';
          case '2':
            return '修改管理员';
          case '3':
            return '修改所属层级';
        }
      },
    },

    methods: {
      renderHeader(h) {
        return h('el-button', {
          props: {
            type: 'primary',
          },
          on: {
            click: () => {
              this.doAddItem();
            }
          }
        }, '新增');
      },

      getAdminList() {
        this.$http.get(this.$api.get_admin_list, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.adminList = data;
            }
          }
        )
      },

      doDeletePe(row){
        this.$confirm(`确认移除标签(${row.piname})?`,'提示').then(
          ()=>{
            this.$http.post(this.$api.delete_permission,{
              "actiontype": "pe",
              "actionid": row.peid
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.getTablesData();
                  this.$notify({
                    title: '标签移除成功',
                    message: `标签名:${row.piname}`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },


      setLevelOptions() {
        this.levelOptions = [];
        for (let i = 0; i < this.levelData.length + 1; i++) {
          this.levelOptions[i] = i + 1;
        }
      },
      // get
      resetForm() {
        this.form = {
          piname: '',
          ad_list: [],
          pelevel: '',
        }
        this.getAdminList();
        this.setLevelOptions();
      },

      doAddItem() {
        this.resetForm();
        this.editType = '';
        this.dlgVisible = true;
      },
      doEditItemName(row) {
        this.resetForm();
        this.form.piid = row.piid
        this.form.piname = row.piname
        this.editType = '1';
        this.dlgVisible = true;
      },
      doEditItemAds(row) {
        this.resetForm();
        this.form.piid = row.piid
        this.form.ad_list = row.admin.map(item => item.adid);
        this.form.piname = row.piname
        this.editType = '2';
        this.dlgVisible = true;
      },
      doEditItemAuth(row) {
        this.resetForm();
        this.form.peid = row.peid;
        this.form.pelevel = row.pelevel;
        this.form.piid = row.piid;
        this.form.piname = row.piname
        this.editType = '3';
        this.dlgVisible = true;
      },

      doDeletePi(row) {
        this.$confirm(`确认删除标签(${row.piname})?`,'提示').then(
          ()=>{
            this.$http.post(this.$api.delete_permission,{
              "actiontype": "pi",
              "actionid": row.piid,
            }).then(
              res => {
                if (res.data.status == 200) {
                  let resData = res.data,
                    data = res.data.data;

                  this.getTablesData();
                  this.$notify({
                    title: '标签删除成功',
                    message: `标签名:${row.piname}`,
                    type: 'success'
                  });
                }
              }
            )
          }
        )
      },


      doSaveItem() {
        this.$refs.form.validate(
          valid => {
            if (valid) {
              let type = this.editType ? '编辑' : '新增'

              if (this.editType == '') {  //  新增
                this.$http.post(this.$api.add_pi_and_pe_and_ap, {
                  ptid: this.ptid,
                  ...this.form,
                }).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.showSuccessTip(type)
                    }
                  }
                );
              } else if (this.editType == '1') { //  修改标签名
                this.$http.post(this.$api.add_permissionitems, {
                  ptid: this.ptid,
                  piid: this.form.piid,
                  piname: this.form.piname,
                }).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.showSuccessTip(type)
                    }
                  }
                );
              } else if (this.editType == '2') {
                this.$http.post(this.$api.add_adminpermission, {
                  piid: this.form.piid,
                  adid: this.form.ad_list,
                  // adpid: this.form.peid,
                }).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.showSuccessTip(type)
                    }
                  }
                );
              } else if (this.editType == '3') {
                this.$http.post(this.$api.add_permission, {
                  piid: this.form.piid,
                  ptid: this.ptid,
                  peid: this.form.peid,
                  pelevel: this.form.pelevel,
                }).then(
                  res => {
                    if (res.data.status == 200) {
                      let resData = res.data,
                        data = res.data.data;

                      this.showSuccessTip(type)
                    }
                  }
                );
              }


            } else {
              this.$message.warning('请根据校验信息完善表单!');
            }
          }
        )
      },
      showSuccessTip(type) {
        this.$notify({
          title: `标签${type}成功`,
          message: `标签名:${this.form.piname}`,
          type: 'success'
        });
        this.dlgVisible = false;
        this.getTablesData();
      },


      getTablesData() {
        this.loading = true;
        this.$http.get(this.$api.get_permissiontype, {
          noLoading: true,
          params: {
            ptid: this.ptid
          }
        }).then(
          res => {
            this.loading = false;

            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.levelData = data.permission
              this.itemData = data.permissionitem
            }
          }
        )
      }
    },

    activated() {
      this.getTablesData();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/myIndex";

  .container {

  }
</style>
