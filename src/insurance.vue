<template>
  <div id="app">
    <router-view/>
    <img src="http://dev-open.yunbisai.com/api/Fraud/forge" alt="" class="forge-img">
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    if (this.$route.query.order_id) {
      sessionStorage.setItem('wxOrderId',this.$route.query.order_id);
    }
  }
}
</script>

<style >
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  width: 750px;
  height: 100%;
  margin: 0 auto;
}
.forge-img{
  width: 0px;
  height: 0px;
  display: none;
}
</style>
