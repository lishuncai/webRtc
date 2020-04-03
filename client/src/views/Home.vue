<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >

    <div class="input-account-wrapper">
      <label>
        <h1>输入你的大名</h1>
        <mu-text-field class="input-box" v-model="account" @blur="confirmAccount($event)" @keyup.enter="emitBlur($event)"></mu-text-field>
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
.input-account-wrapper {
  width: 100%;
  text-align: center;
  .input-box {
    width: 80%;
    ::v-deep input {
      font-size: 26px;
      text-align: center;
    }
  }
}
</style>
