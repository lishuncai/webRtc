<template>
  <div id="app">
    <div id="nav">
      <mu-appbar style="width: 100%;" color="primary">
          <router-link to="/">
            Home
          </router-link>/
          <router-link to="/video">
            本地1V1
          </router-link>/
          <router-link to="/meeting">
            会议室
          </router-link>
      </mu-appbar>
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: auto;
}

#nav {

  a {
    font-weight: bold;
    color: #fff;
    &.router-link-exact-active {
      color: #47d495
    }
  }
}
</style>
