<template>
  <div id="app">
      <router-view name="nav"></router-view>
      <router-view default></router-view>
  </div>
</template>
<script>
document.documentElement.style = '--color-theme: #2196f3'
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-height: 100%;
  overflow: auto;
}
</style>
