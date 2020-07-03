<template>
  <div class="container">
    <el-dialog :visible="visible" title="评论视频预览" width="500" :modal="false" top="5vh" @close="close">
      <video ref="video" :src="videoSrc" :poster="posterSrc" controls autoplay width="375" height="667"></video>
    </el-dialog>
    <img :src="posterSrc" alt="" style="width: 50px;height: 50px;" @click="visible = true">
  </div>
</template>

<script>
  export default {
    name: "TableCellVideo",

    props: ['videoSrc', 'posterSrc'],

    components: {},

    data() {
      return {
        visible: false,
      }
    },

    watch: {
      visible(val){
        if(!val){
          this.$refs.video.pause();
        }
      }
    },

    computed: {},

    methods: {
      close(){
        this.visible = false;
      }
    },

    created() {

    },
  }
</script>

<style lang="less" scoped>
  @import "../../styles/myIndex";

  .container {

  }
</style>
