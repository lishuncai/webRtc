<template>
  <div class="video-wrapper">
     <div>
      <h2>昵称：{{ account }}</h2>
    </div>
    <div class="button-wrapper">
      <mu-button class="btn" color="secondary" @click="createRoom"
        >创建房间</mu-button
      >
      <mu-button class="btn" color="teal" @click="showEnterRoomId=true"
        >加入房间</mu-button
      >
    </div>

    <mu-dialog
      title="输入房间号"
      width="600"
      max-width="80%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="showEnterRoomId"
    >
      <mu-text-field style="width: 100%" v-model="joinRoomId"></mu-text-field>
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="showEnterRoomId = false"
        >算了</mu-button
      >
      <mu-button slot="actions" flat color="primary" @click="enterRoom"
        >加入</mu-button
      >
    </mu-dialog>
    <mu-dialog
      title="输入昵称"
      width="600"
      max-width="80%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="showEnterAccount"
    >
      <mu-text-field v-model="account" style="width: 100%"></mu-text-field>
      <p style="color: red">{{ errorMsg }}</p>
      <mu-button slot="actions" flat color="primary" @click="confirmAccount"
        >加入</mu-button
      >
    </mu-dialog>
  </div>
</template>

<script>
export default {
  name: 'meeting',
  data() {
    return {
      isCreater: true,
      roomId: '',
      joinRoomId: '',
      account: '',
      showEnterRoomId: false,
      errorMsg: '',
      showEnterAccount: false
    }
  },

  async mounted() {
    const account = this.$store.getters.account
    if (!account) {
      this.showEnterAccount = true
    } else {
      this.account = account
    }
  },

  computed: {
    isAlive() {
      return this.$store.state.socketAlive
    }
  },
  methods: {
    confirmAccount() {
      if (this.account) {
        this.$store.commit('account', this.account)
        this.showEnterAccount = false
      } else {
        this.errorMsg = '请输入昵称'
      }
    },
    enterRoom() {
      if (!this.isAlive) {
        this.$toast.warning('请求失败，socket未连接上')
        return
      }
      this.intoRoom()
      this.showEnterRoomId = false
    },
    createRoom() {
      if (!this.isAlive) {
        this.$toast.warning('请求失败，socket未连接上')
        return
      }
      this.$io.socket.emit('createRoom', this.account, (data) => {
        if (data) {
          this.roomId = data.roomId
          this.joinRoomId = data.roomId
          console.log('房间数据', data)
          this.intoRoom()
        } else {
          this.$toast.error('创建失败')
        }
      })
    },
    intoRoom() {
      this.$io.socket.emit('enterRoom', {
        roomId: this.joinRoomId,
        account: this.account
      }, (err) => {
        if (!err) {
          this.$router.push({
            path: `/Room/${this.joinRoomId}`
          })
        } else {
          this.$toast.error(err)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.button-wrapper {
  margin-top: 10px;
  .btn {
    margin: 0 10px;
  }
}
</style>
