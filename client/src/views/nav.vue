<template>
  <div id="nav">
    <div>
      <i></i>
    </div>
    <div style="width: 100%;" color="primary">
        <router-link to="/" :class="{on: current==='home'}">
          Home
        </router-link>|
        <router-link to="/meeting" :class="{on: current==='meeting'}">
          会议室
        </router-link>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      current: 'home'
    }
  },
  watch: {
    $route(to, from) {
      this.current = to.name.toLowerCase
    }
  }
}
</script>
<style lang="scss" scoped>
#nav {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  background: var(--color-theme);
  a {
    font-weight: bold;
    line-height: 1.5;
    &.router-link-exact-active {
      color: #47d495 !important;
    }
  }
}
</style>
