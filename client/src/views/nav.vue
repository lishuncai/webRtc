<template>
  <div id="nav">
    <div>
      <i></i>
    </div>
    <div style="width: 100%;" color="primary">
        <router-link to="/">
          Home
        </router-link>|
        <router-link to="/meeting">
          会议室
        </router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#nav {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  background: var(--color-theme);
  a {
    font-weight: bold;
    &.router-link-exact-active {
      color: #47d495
    }
  }
}
</style>
