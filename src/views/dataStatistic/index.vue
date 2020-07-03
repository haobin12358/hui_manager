<template>
  <div class="container">

    <section class="profile-block">
      <block-title title="用户数据"></block-title>
      <ul class="m-order-label-ul">
        <li>
          <div class="m-icon-price-box click-cursor" @click="gotoOrderWithParam(1,'today')">
            <img class="static-icon" src="/static/images/order-pay.png" alt="">
            <div class="icon-price-box-main">
              <p class="label">票务点击量</p>
              <p class="m-order-price m-red">{{todaySaleData.day_total}}</p>
            </div>
          </div>

        </li>
        <li>
          <div class="m-icon-price-box click-cursor" @click="gotoOrderWithParam(1,'today')">
            <img class="static-icon" src="/static/images/order-money.png" alt="">
            <div class="icon-price-box-main">
              <p class="label">押金总数</p>
              <p class="m-order-price m-red">{{todaySaleData.day_count}}</p>
            </div>
          </div>

        </li>
        <li>
          <div class="m-icon-price-box click-cursor" @click="gotoOrderWithParam(3,'today')">
            <img class="static-icon" src="/static/images/order-ticket.png" alt="">
            <div class="icon-price-box-main">
              <p class="label">票务总余量</p>
              <p class="m-order-price m-red">{{todaySaleData.wai_pay_count}}</p>
            </div>
          </div>
        </li>
        <li>
          <div class="m-icon-price-box click-cursor" @click="gotoOrderWithParam(4,'today')">
            <img class="static-icon" src="/static/images/order-num.png" alt="">
            <div class="icon-price-box-main">
              <p class="label">用户购买量</p>
              <p class="m-order-price m-red">{{todaySaleData.in_refund}}</p>
            </div>
          </div>
        </li>
      </ul>
    </section>


  </div>
</template>

<script>

  import permission from 'src/directive/permission/index.js' // 权限判断指令
  import checkPermission from 'src/utils/permission' // 权限判断函数
  import {level0, level2} from "src/router";


  export default {
    name: 'dataStatisticIndex',

    components: {

    },

    directives: {permission},

    data() {
      return {
        level0,
        level2,

        todos: [],

        todaySaleData: {},
        yesterdaySaleData: {},
        totalSaleData: {},
        upUrl: '',
        downUrl: '',

      }
    },

    computed: {},

    methods: {
      checkPermission,

      getDealingApproval() {
        this.todos = [];
        this.$http.get(this.$api.get_dealing_approval, {
          params: {}
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;
              this.todos = this.todos.concat(data);
            }
          }
        );
        this.$http.get(this.$api.get_all_order, {
          params: {
            omstatus: 10,
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.todos.push({
                ptid: 'towaitdelivery',
                ptname: '待发货订单',
                approval_num: resData.total_count
              });
            }
          }
        );
        this.$http.get(this.$api.get_all_order, {
          params: {
            omstatus: 10,
            omfrom: '30,40,50,60,70,80,90'
          }
        }).then(
          res => {
            if (res.data.status == 200) {
              let resData = res.data,
                data = res.data.data;

              this.todos.push({
                ptid: 'towaitdeliveryactivity',
                ptname: '待发货活动订单',
                approval_num: resData.total_count
              });
            }
          }
        );
      },

      gotoTodoPage(item) {
        console.log(item.ptid)
        switch (item.ptid) {
          //  激活码和新代理全交由平台
          case 'toactivationcode':
            this.$router.push('/approval/activationCodeActi')
            break;
          case 'toagent':
            this.$router.push('/approval/agentAudit')
            break;

          //  圈子
          case 'topublish':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/circleAudit')
            }else{
              this.$router.push('/circle/circle')
            }
            break;
          //  圈子打赏
          case 'tonewsaward':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/circleRewardAudit')
            }
            break;
          //  4个活动
          case 'tofreshmanfirstproduct':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/firstOrderActiAudit')
            } else {
              this.$router.push('/activity/firstOrder')
            }
            break;
          case 'toguessnum':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/guessActiAudit')
            } else {
              this.$router.push('/activity/guess')
            }
            break;
          case 'togroupgoods':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/groupActiAudit')
            } else {
              this.$router.push('/activity/groupGuess')
            }
            break;
          case 'tomagicbox':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/magicGiftBoxAudit')
            } else {
              this.$router.push('/activity/magicGiftBox')
            }
            break;
          case 'totrialcommodity':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/trialProductAudit')
            } else {
              this.$router.push('/activity/trialProduct')
            }
            break;

          case 'toshelves':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/productAudit')
            }else{
              this.$router.push({
                name: 'ProductIndex',
                params: {
                  prstatus: 'auditing'
                }
              })
            }
            break;
          case 'totimelimited':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/limitedProductAudit');
            }else{
              this.$router.push('/activity/limitedFix');
            }

            break;
          case 'tointegral':
            this.$router.push('/approval/starAudit');
            break;
          case 'toreturn':
            this.$router.push('/approval/returnProductAudit')
            break;

          case 'tocash':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/withdrawAudit')
            }else{
              this.$router.push('/personSetting/withdraw')
            }
            break;
          case 'tosettlenment':
            if (this.$store.getters.roles[0] != 'supplizer') {
              this.$router.push('/approval/supplizerBalanceApplyAudit')
            }else{
              this.$router.push('/personSetting/balance')
            }
            break;
          case 'totoilet':
            this.$router.push('/approval/toiletAudit');
            break;
          case 'toguide':
            this.$router.push('/approval/guideAudit');
            break;

          //    自定义:发货订单,不在审批流内,合并显示
          case 'towaitdelivery':
            this.$router.push({
              name: 'OrderIndex',
              params: {
                omstatus:10
              }
            })
            break;

          case 'towaitdeliveryactivity':
            this.$router.push({
              name: 'ActiOrder',
              params: {
                omstatus:10,
                omfrom:'30,40,50,60,70,80'
              }
            })
            break;
        }
      },

      async getHistoryDetail(days) {
        let res = await this.$http.get(this.$api.history_detail, {
          params: {
            days: days,
          }
        });

        if (res.data.status == 200) {
          let resData = res.data,
            data = res.data.data;

          return data
        }
      },

      async setSaleData() {
        let today = new Date(),
          yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        let twoDaysData = await this.getHistoryDetail(this.formatDate(yesterday) + ',' + this.formatDate(today));
        let allData = await this.getHistoryDetail();

        this.yesterdaySaleData = twoDaysData[0];
        this.todaySaleData = twoDaysData[1];
        this.totalSaleData = allData[0];
      },

      gotoOrderWithParam(type, dateType) {
        let query = {
          omstatus: ''
        }

        let today = new Date(),
          yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

        if (dateType == 'today') {
          query.searchDate = this.formatDate(today)
        } else if (dateType == 'yesterday') {
          query.searchDate = this.formatDate(yesterday)
        }

        switch (type) {
          case 1:
          case 2:
            break
          case 3:
            query.omstatus = '0'
            break
          case 4:
            query.omstatus = '40'
            break
        }

        this.$router.push({
          // path: '/order/order',
          // query
          name: 'AllOrder',
          params: query
        })
      },

      formatDate: function (date) {
        var arr = [];
        arr[0] = date.getFullYear();
        arr[1] = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        arr[2] = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return `${arr[0]}-${arr[1]}-${arr[2]}`
      },

    },

    async created() {
      this.getDealingApproval();

      await this.setSaleData();

    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

    .profile-block {
      margin-bottom: 20px;
    }

    .profile-todos-block {
      .todo-line {
        height: 2px;
        background: @borderColor;
        margin-bottom: 20px;
      }

      .todo-list {
        .fj(flex-start);
        flex-wrap: wrap;

        .todo-item {
          cursor: pointer;
          .sc(20px, white);
          padding: 20px 40px;
          box-sizing: border-box;
          margin-right: 20px;
          background: #CB7E88;
          border-radius: 10px;
          .bs(10px, 5px, 10px);
          .fj();
          align-items: flex-end;
          white-space: nowrap;

          &:nth-child(2) {
            background: #D18E62;
          }

          &:nth-child(3) {
            background: #C7D687;
          }

          &:nth-child(4) {
            background: #87ACD6;
          }

          &:nth-child(5) {
            background: #CB7E88;
          }

          &:nth-child(6) {
            background: #C397CB;
          }

          .label {
            margin-right: 10px;
          }

          .num {
            .fz(22px);
          }
        }
      }
    }

    .m-order-label-ul {
      .fj(flex-start);
      border: 1px solid @borderColor;
      width: 100%;

      li {
        flex: 1;
        padding: 40px 40px 10px;
        border-right: 1px solid @borderColor;

        &:last-child {
          border-right: none;
        }
        .m-icon-price-box {
          .fj(flex-start);
          align-items: center;
          margin-bottom: 40px;
          font-size: 18px;

          .static-icon {
            .wl(66px, 66px);
            margin-right: 20px;
          }

          .icon-price-box-main {
            .fjc();
            color: #595757;

            .m-order-price {
              font-size: 17px;
              margin-top: 20px;
              &.m-red {
                color: #D80000;
              }
            }
          }

        }
      }

    }

  }
</style>
