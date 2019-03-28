<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.domain = 'yunbisai.com';
    let historyLen = history.length;
    if ((window !== window.parent) && !sessionStorage.getItem('historyLen')) {
      sessionStorage.setItem('historyLen',historyLen);
      console.log('appcreatedlen:',historyLen)
    }
  }
}
</script>

<style>
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  width: 750px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  /* overflow: hidden; */
}
</style>
