<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb/>

    <div class="right-menu-wrap">

      <template v-if="device!=='mobile'">
        <notice-marquee v-if="checkPermission(['supplizer'])"></notice-marquee>
        <menu-search></menu-search>
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <!--<img v-lazy="userInfo.adheader" class="user-avatar">-->

          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown"  class="user-dropdown">
          <el-dropdown-item command="pwd" v-if="userInfo.level != 'personal'">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


    <change-pwd ref="changePwd"></change-pwd>
  </el-menu>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Breadcrumb from 'src/components/Breadcrumb'
  import Hamburger from 'src/components/Hamburger'
  import ErrorLog from 'src/components/ErrorLog'
  import Screenfull from 'src/components/Screenfull'
  import SizeSelect from 'src/components/SizeSelect'
  import MenuSearch from 'src/components/MenuSearch'
  import ChangePwd from 'src/views/setting/changePwd'
  import NoticeMarquee from 'src/views/profile/components/noticeMarquee'
  import checkPermission from 'src/utils/permission' // 权限判断函数

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      ChangePwd,
      MenuSearch,
      NoticeMarquee,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'device',
        'userInfo'
      ])
    },
    created(){
      console.log(this)
    },
    methods: {
      checkPermission,

      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      handleCommand(command) {
        switch (command) {
          case 'pwd':
            this.$refs.changePwd.showDialog();
            break
          case 'logout':
            this.logout()
            break
          default:
            break
        }
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/myIndex";

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .right-menu-wrap {
      float: right;
      height: 100%;
      .fj(flex-end);
      align-items: center;

      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        margin-left: 10px;
        cursor: pointer;

        .avatar-wrapper {
          margin-top: 5px;
          /*position: relative;*/
          //.fj();
          /*align-items: center;*/
          height: 40px;

          .user-avatar {
            width: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }

      }

    }

  }
</style>

