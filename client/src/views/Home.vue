<template>
  <div class="home">
    <router-view></router-view>
    <h1 class="title">
      Welcome!
    </h1>
    <div class="input-account-wrapper">
      <label>
        <p>输入你的大名</p>
        <p>
          <input type="text" class="input-box" v-model="account" @blur="confirmAccount($event)" @keyup.enter="emitBlur($event)" maxlength="5">
        </p>
      </label>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      account: ''
    }
  },
  mounted () {
    this.account = this.oldAccount
  },
  computed: {
    oldAccount() {
      return this.$store.getters.account || ''
    }
  },
  methods: {
    emitBlur(e) {
      e.target.blur()
    },
    confirmAccount() {
        this.$store.commit('account', this.account)
        return
        
      if (this.account.trim()) {
        this.$store.commit('account', this.account)
      } else {
        this.account = this.oldAccount
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin: 20px 0;
}
.input-account-wrapper {
  // width: 100%;
  text-align: center;
  .input-box {
    margin-top: 8px;
    padding: 8px;
    font-size: 20px;
    font-weight: bold;
    border: 0;
    border-bottom: 1px solid #eee;
    &:focus {
      border: 0;
      border-bottom: 1px solid #ccc;
      outline: none;
      box-shadow: none
    }
    text-align: center;
  }
}
</style>
