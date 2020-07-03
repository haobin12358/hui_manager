<template>
  <div>
    <div v-if="from == 'detail'">
      <el-button type="primary" @click="preview('detail')">预 览</el-button>
    </div>
    <div v-else>
      <el-button type="text" class="preview-button" v-if="show_circle" @click="preview('list')">列表预览</el-button>
      <el-button type="text" class="preview-button" @click="preview('detail')">详情预览</el-button>
    </div>
    <!--列表预览dialog-->
    <el-dialog v-el-drag-dialog :visible.sync="listDialog" width="430px"
               :center="true" title="列表预览" :append-to-body="true" v-if="where == 'list'">
      <div class="m-circle-body">
        <template>
          <div class="m-video-one">
            <h3>{{circle.netitle}}</h3>
            <div class="m-video-box" v-if="circle.showtype == 'video'">
              <video src="" class="m-video"></video>
              <div class="m-img-box">
                <img :src="circle.videothumbnail" class="m-img">
              </div>
              <span class="m-video-time">{{circle.videoduration}}</span>
              <span class="m-icon-video"></span>
            </div>
            <div class="m-img-box" v-else-if="circle.showtype == 'picture'">
              <img :src="circle.mainpic" class="m-img">
            </div>
            <div v-else>
              <span class="m-toc-label" v-if="circle.toctitle">#{{circle.toctitle}}#</span>
              <span v-html="circle.netext"></span>
            </div>
            <ul class="m-video-icon-ul">
              <li>
                <span class="m-icon-like " :class="circle.is_favorite?'active':''"></span>
                <span>{{circle.favoritnumber}}</span>
              </li>
              <li class="m-border">
                <span class="m-icon-comment"></span>
                <span>{{circle.commentnumber}}</span>
              </li>
              <li>
                <span class="m-icon-transmit"></span>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </el-dialog>

    <!--详情预览dialog-->
    <el-dialog v-el-drag-dialog :visible.sync="detailDialog" width="450px" top="5vh"
               :center="true" title="详情预览" :append-to-body="true">
      <div class="m-circle-detail">
        <div class="m-circle-content" v-if="news_info">
          <h3 class="m-circle-title">{{news_info.netitle}}</h3>
          <div class="m-author-box" v-if="news_info.author">
            <img class="m-author-img" :src="news_info.author.usheader">
            <div class="m-author-name">{{news_info.author.usname}}</div>
            <div>{{news_info.createtime}}</div>
          </div>

          <div class="m-content">
            <template v-for="(item,index) in news_info.netext">
              <div v-if="item.type =='text'">
                <span class="m-toc-label" v-if="news_info.toctitle">#{{news_info.toctitle}}#</span>
                <span v-html="item.content"></span>
              </div>
<!--              <p v-if="item.type =='text'" v-html="item.content"></p>-->
              <template v-if="item.type=='image'" v-for="i in item.content">
                <img class="m-circle-img" :src="i">
              </template>
              <div class="m-video-box" v-if="item.type == 'video'" @click="videoVisible = true">
                <div class="m-img-box">
                  <img :src="item.content.thumbnail" class="m-img">
                </div>
                <span class="m-video-time">{{item.content.duration}}</span>
                <span class="m-icon-video"></span>
              </div>
            </template>

          </div>
        </div>
        <!--<div class="m-circle-foot" v-if="news_info">
          <div class="float-left">
            <span class="m-icon-btn" :class="news_info.is_favorite == 1 ? 'active' : ''">
              <span class="m-icon-zan"></span>
              <span>赞同 {{news_info.favoritnumber}}</span>
            </span>
                <span class="m-icon-btn" :class="news_info.is_trample == 1 ? 'active' : ''">
              <span class="m-icon-cai"></span>
              <span>反对 {{news_info.tramplenumber}}</span>
            </span>
          </div>
          <span class="m-circle-comment float-right">评论 {{news_info.commentnumber}}</span>
        </div>-->
        <div class="m-box">
          <div class="m-item" v-if="news_info.coupon">
            <div class="m-box-title">优惠领取</div>
            <coupon-card :couponList="news_info.coupon"></coupon-card>
          </div>
          <div class="m-item" v-if="news_info.product">
            <div class="m-box-title m-margin">相关推荐</div>
            <product :list="news_info.product"></product>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-if="news_info.video" :visible.sync="videoVisible" title="圈子视频预览" width="500"  top="5vh">
      <video ref="video" :src="news_info.video.nvvideo" :poster="news_info.video.nvthumbnail" controls width="375" height="375">您的浏览器不支持 video 视频播放</video>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from 'src/directive/el-dragDialog'
  import couponCard from './couponCard'
  import product from '../../../components/Product/product'

  export default {
    name: "previewCircle",
    data() {
      return {
        listDialog: false,
        detailDialog: false,
        where: '',
        news_info: { author: {}, coupon: [], product: [] },
        neid: '',
        show_circle:true,
        videoVisible: false,
      }
    },
    watch:{
      videoVisible(val){
        if(!val){
          this.$refs.video.pause();
        }
      }
    },
    props: {
      from: { type: String, default: '' },
      circle: { type: Object, default() { return {} }}
    },
    directives: { elDragDialog },
    components: { couponCard, product },
    mounted() {

    },
    methods: {
      // 预览
      preview(where) {
        this.where = where;
        if(where == 'list') {
          this.listDialog = true;
        }else if(where == 'detail') {
          if(this.from == 'detail') {
            this.news_info = this.circle;
            this.detailDialog = true;
          }else {
            this.neid = this.circle.neid;
            this.getNewsDetail();
          }
        }
      },
      // 获取资讯详情
      getNewsDetail(){
        this.$http.get(this.$api.get_news_content, { params:{ neid: this.neid }}).then(res => {
          if(res.data.status == 200){
            this.news_info = res.data.data;
            for(let i in this.news_info.netext){
              if(this.news_info.netext[i].type == 'text'){
                this.news_info.netext[i].content = this.news_info.netext[i].content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
              }
            }
            // 显示内容精简
            for(let i in this.news_info.coupon) {
              if(this.news_info.coupon[i].cosubtration.toString().length > 4) {
                this.news_info.coupon[i].cosubtration = 999
              }
              this.news_info.coupon[i].codiscount = this.news_info.coupon[i].codiscount.toString().slice(0, 3)
            }
            this.detailDialog = true;
          }
        })
      },
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../styles/myIndex";

  .m-circle-body{
    padding: 10px 14px;
    background-color: #eee;
    .m-video-one{
      position: relative;
      width: 350px;
      border-radius: 5px;
      box-shadow: 0 2.5px 3px 0 rgba(0, 0, 0, 0.16);
      /*margin-bottom: 15px;*/
      background-color: #fff;
      padding-bottom: 13px;
      .m-mark-label{
        position: absolute;
        top:5px;
        right:0;
        height: 16.5px;
        line-height: 16.5px;
        padding: 0 12.5px;
        background-color: #E9E9E9;
        border-radius: 5px 0 0 5px;
        box-shadow: 3px 5px 6px 0 rgba(0, 0, 0, 0.16);
        font-size: 18px;
        color: #999999;
        &.active{
          color: #C70000;
        }
      }
      h3{
        font-size: 14px;
        font-weight: bold;
        text-align: left;
        padding: 5px 10px;
      }
      .m-video-box{
        position: relative;
        .m-video{
          display: block;
          width: 350px;
          height: 180px;
          position: absolute;
          top:0;
          left: 0;
        }
        .m-icon-video{
          display: block;
          width: 54.5px;
          height: 54.5px;
          position: absolute;
          top: 62.5px;
          left: 149px;
          background: url("/static/images/icon-video.png") no-repeat;
          background-size: 100% 100%;
        }
        .m-video-time{
          position: absolute;
          bottom: 2px;
          right: 20px;
          color: #000;
        }
      }
      .m-img-box {
        width: 350px;
        height: 180px;
        position: relative;
        background-color: #ffffff;
        .m-img {
          max-width: 350px;
          max-height: 180px;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
        }
      }
      .m-text{
        width: 340px;
        text-align: left;
        padding: 5px 11px;
        /*text-indent: 2em;*/
        overflow: hidden; // 超出的文本隐藏
        text-overflow: ellipsis;    // 溢出用省略号显示
        display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
        -webkit-box-orient: vertical; // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
      }

      .m-video-like{
        position: absolute;
        top: 80.5px;
        right: 8px;
        color: #fff;
        height: 13.5px;
        line-height: 13.5px;
        .m-like-icon{
          display: inline-block;
          width: 14px;
          height: 13.5px;
          background: url("/static/images/icon-collect.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: text-bottom;
          margin-right: 5px;
          &.active{
            background: url("/static/images/icon-collect-active.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .m-video-icon-ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        margin: 9px 0 0;
        color: #999;
        li{
          width: 33.3%;
          text-align: center;
          line-height: 15px;
          align-items: center;
          font-size: 10px;
        }
        .m-border{
          border-left: 1px solid #999999;
          border-right: 1px solid #999999;
        }
        .m-icon-like{
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url("/static/images/icon-like.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 5px;
          &.active{
            background: url("/static/images/icon-like-active.png") no-repeat;
            background-size: 100% 100%;
          }
        }
        .m-icon-comment{
          display: inline-block;
          width: 13.5px;
          height: 10.5px;
          background: url("/static/images/icon-comment.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 5px;
        }
        .m-icon-transmit{
          display: inline-block;
          width: 11.5px;
          height: 10px;
          background: url("/static/images/icon-transmit.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .m-invite-course {
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        z-index: 10;
      }
      .m-refuse-reason{
        padding: 7px 0;
        border-top: 1px solid #CCCCCC;
        text-align: left;
        margin: 15px 10px 0 10px;
        color: #C70000;
        font-size: 9px;
      }
    }
  }
  .m-circle-detail {
    position: relative;
    height: 45rem;
    overflow: auto;
    overflow-x: hidden;
  }
  .m-toc-label{
    color: #409EFF;
  }
  .m-circle-content{
     padding: 0 0 50px 0;
     .m-circle-title{
       font-size: 14px;
       font-weight: bold;
       margin-left: 14px;
       text-align: left;
     }
     .m-author-box {
       display: flex;
       align-items: center;
       margin: 12.5px 20px;
       font-size: 12px;
       .m-author-img {
         display: block;
         width: 20px;
         height: 20px;
         border-radius: 50%;
         margin-right: 9px;
         border: none;
         background: url("/static/images/logo.png") no-repeat;
         background-size: 100% 100%;
       }
       .m-author-name {
         flex: 1;
         text-align: left;
         color: #999999;
       }
     }
     .m-circle-img{
       display: block;
       width: 375px;
       max-height: 100%;
       background-color: #9fd0bf;
       /*margin: 14px 0 30px ;*/
     }
     .m-content{
       padding: 23px 23px 0 23px;
       text-align: left;
       .m-video-box{
         position: relative;
         .m-img-box {
           width: 350px;
           height: 180px;
           position: relative;
           background-color: #ffffff;
           .m-img {
             max-width: 350px;
             max-height: 180px;
             position: absolute;
             top: 0;
             right: 0;
             bottom: 0;
             left: 0;
             margin: auto;
           }
         }
         .m-video{
           display: block;
           width: 100%;
           height: 180px;
           border-radius: 5px;
           margin-bottom: 10px;
           /*border: 1px red solid;*/
         }
         .m-video-img{
           position: absolute;
           top:0;
           left: 0;
           width: 100%;
           height: 180px;
           border-radius: 5px;
         }
         .m-icon-video{
           display: block;
           width: 54.5px;
           height: 54.5px;
           position: absolute;
           top: 65px;
           left: 145px;
           background: url("/static/images/icon-video.png") no-repeat;
           background-size: 100% 100%;
         }
         .m-video-time{
           position: absolute;
           /*bottom: -75px;*/
           right: 6.5px;
           color: #000;
         }
       }
       h3{
         font-size: 14px;
         font-weight: bold;
         margin-bottom: 10px;
       }
       p{
         margin-bottom: 10px;
         color: #666666;
       }
     }
   }
  .m-circle-foot{
    width: 375px;
    position: fixed;
    bottom: -35px;
    z-index: 200;
    display: flex;
    justify-content: space-between;
    box-shadow: 2.5px 2.5px 3px 2.5px rgba(0, 0, 0, 0.16);
    padding: 15px 24.5px 15px 22.5px;
    background-color: #fff;
    margin: 0 0 65px 0;
    font-size: 9px;
    &:after{
      content: '';
      display: block;
      clear: both;
    }
    .m-circle-comment{
      display: block;
      width: 45px;
      height: 22.5px;
      line-height: 17.5px;
      font-size: 12px;
      padding: 1.5px 5px;
      background: url("/static/images/icon-circle-comment.png") no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
    .m-icon-btn{
      display: inline-block;
      padding: 2.5px 9px 0 9px;
      background-color: #ccc;
      border-radius: 5px;
      color: #fff;
      font-size: 12px;
      line-height: 21px;
      margin-right: 7.5px;
      vertical-align: middle;
      &.active{
        background-color: #22A7D2;
      }
      .m-icon-zan{
        display: inline-block;
        width: 19px;
        height: 19px;
        background: url("/static/images/icon-zan.png") no-repeat;
        background-size: 100% 100%;
        vertical-align: text-top;
      }
      .m-icon-cai{
        display: inline-block;
        width: 19px;
        height: 19px;
        background: url("/static/images/icon-cai.png") no-repeat top;
        background-size: 100% 100%;
        vertical-align: text-bottom;
      }
    }
  }
  .m-box {
    margin: -50px 0 60px -5px;
    .m-item {
      text-align: left;
      .m-box-title {
        font-size: 14px;
        font-weight: bold;
        margin: 0 0 7.5px 23px;
        &.m-margin {
          margin: 10px 0 -5px 23px;
        }
      }
    }
  }
</style>
