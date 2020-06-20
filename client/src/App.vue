<template>
  <div id="app">
    <router-view name="nav"></router-view>
    <transition :name="transitionName">
      <router-view default></router-view>
    </transition>
  </div>
</template>
<script>
document.documentElement.style = '--color-theme: #2196f3'
export default {
  data() {
    return {
      transitionName: null
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.matched[0] === from.matched[0]) {
        this.transitionName = 'fade'
      } else {
        this.transitionName = ''
      }
    }
  }
}
</script>
<style lang="scss">
html, body {
  height: 100%;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
