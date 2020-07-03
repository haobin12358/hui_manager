<template>
  <div>
    <div v-if="couponList.length > 0">
      <div class="m-coupon-card" v-for="(item, index) in couponList">
        <div class="m-card-left">
          <img class="m-store-img" :src="item.title_subtitle.left_logo" alt="">
          <div class="m-store-name">{{item.title_subtitle.left_text}}</div>
        </div>
        <div class="m-card-right">
          <div class="m-card-time">{{item.covalidstarttime}}—{{item.covalidendtime}}</div>
          <div class="m-card-detail">
            <div class="m-detail-left" v-if="item.codiscount == '10'">
              <span class="m-text-small">￥</span>
              <span class="m-text-big">{{item.cosubtration}}</span>
              <span class="m-text-small" v-if="item.cosubtration == 999">+</span>
            </div>
            <div class="m-detail-left m-space" v-else>
              <span class="m-text-big">{{item.codiscount}}</span>
              <span class="m-text-small">折</span>
            </div>
            <div class="m-detail-right">
              <div>{{item.title_subtitle.title}}</div>
              <div>{{item.title_subtitle.subtitle}}</div>
              <div class="m-detail-btn">点击领取</div>
              <!--<div class="m-detail-btn" v-if="item.navName">{{item.navName}}</div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-no-coupon" v-if="couponList.length == 0 && !circle">
      <span class="m-no-img"></span>
      <p style="margin-top: -40px">暂时还没有优惠券哦~</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      couponList: { type: Array, default: null },
      order: { type: Boolean, default: false },
      circle: { type: Boolean, default: false }
    },
    methods: {

    },
    mounted() {

    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  /*@import "../../../common/css/index";*/

  .m-coupon-card{
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 350px;
    height: 85.5px;
    margin: 0 0 2.5px 12.5px;
    background: url("/static/images/coupon/icon-new.png") no-repeat;
    background-size: 100% 100%;
    &.m-had {
      background: url("/static/images/coupon/icon-had.png") no-repeat;
      background-size: 100% 100%;
    }
    .m-cancel-icon {
      width: 22.5px;
      height: 22.5px;
      position: absolute;
      top: -10px;
      right: -5px;
    }
    .m-card-left {
      margin: 10px 0 0 22.5px;
      .m-store-img {
        width: 50px;
        height: 50px;
        background: #ffffff;
        box-shadow: 2px 3px 6px rgba(0,0,0,0.16);
        border-radius: 5px;
      }
      .m-store-name {
        width: 90px;
        color: #ffffff;
        font-size: 9px;
        /*text-align: center;*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .m-card-right {
      width: 63%;
      color: #ffffff;
      font-size: 9px;
      margin: 7.5px 10px 0 0;
      .m-card-time {
        margin-left: -20px;
        margin-bottom: 2.5px;
        text-align: right;
        white-space: nowrap;
      }
      .m-card-detail {
        display: flex;
        justify-content: space-between;
        .m-detail-left {
          margin-top: -5px;
          .m-text-small{
            font-size: 23px;
          }
          .m-text-big {
            font-size: 45px;
            font-weight: bold;
          }
          &.m-space {
            margin-left: 25px;
          }
        }
        .m-detail-right {
          display: flex;
          text-align: center;
          align-items: center;
          flex-direction: column;
          .m-detail-btn {
            width: 70px;
            white-space: nowrap;
            line-height: 7px;
            font-size: 8px;
            padding: 5px 8px;
            margin-top: 5px;
            border: 1px solid rgba(255,255,255,1);
            border-radius: 15px;
          }
        }
      }
    }
  }
</style>
