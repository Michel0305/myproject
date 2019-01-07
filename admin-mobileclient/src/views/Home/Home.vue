<template>
  <div class="wrapper">
    <search :isSearching="false" @click.native="changeToSearch"></search>
    <div class="tab">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">最新更新</mt-tab-item>
        <mt-tab-item id="2">动态</mt-tab-item>
        <mt-tab-item id="3">福利</mt-tab-item>
        <mt-tab-item id="4">互动</mt-tab-item>
      </mt-navbar>
    </div>
    
    <mt-tab-container v-model="selected" swipeable>
      <mt-tab-container-item id="1">
        <recommend/>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <classic/>
      </mt-tab-container-item>
      <mt-tab-container-item id="3">
        <major/>
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <expert/>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import classic from "@/views/Home/classic";
import expert from "@/views/Home/expert";
import major from "@/views/Home/major";
import recommend from "@/views/Home/recommend";
import search from "@/components/search";
export default {
  components: {
    classic,
    expert,
    major,
    recommend,
    search
  },
  data(){
    return{
      selected: "1",
    }
  },
  mounted(){
  },
  methods:{
    changeToSearch(){
      this.$router.push({path:'home/search'});
    }
  }
};
</script>

<style lang="stylus" scoped>
.wrapper
  // position fixed
  width 100%
  height 92%
  .mint-search
      height initial
  .mint-navbar .mint-tab-item.is-selected
    margin 0
    // position relative
    // .serch
    //   position absolute
    //   top: 0
    //   margin: 0 auto 
  // .tab
    // height 100px
    // width 100%
    // background-color red
    // display flex
    // justify-content center 
    // align-items center 
    // .tab-item
    //   flex:1
    //   background-color blue
  // .router
  //   height 400px
</style>
