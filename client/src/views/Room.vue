<template>
  <div>
    <p>
      房主：{{creater}} / 房号： {{roomId}}
    </p>
    <div class="note-wrapper">
      <div ref="noteWrapper"></div>
      <div class="input-box">
        <input type="text" v-model="chatMssage" @keyup.enter="sendMsg">
      </div>
    </div>
    <video-viewer :roomId="roomId" :creater="creater" :isCreater="isCreater"></video-viewer>
  </div>
</template>

<script>
import videoViewer from '@/views/videoViewer'
export default {
  name: '',
  data() {
    return {
      creater: null,
      roomId: null,
      roomInfo: null,
      chatMssage: '',
      isCreater: false
    }
  },
  components: {
    videoViewer
  },
  beforeDestroy () {
    this.socket.close()
  },
  beforeRouteLeave (to, from, next) {
    this.levelRoom()
    next()
  },
  created () {
    const params = this.$route.params
    this.roomId = params.roomId
    if (this.roomId) {
      this.socket = this.$io.getSocketSpace(`/room/${this.roomId}`)
    } else {
      this.$toast('房间id不存在')
    }
  },
  mounted() {
    this.initSocket()
    this.getRoomInfo()
  },
  computed: {
    account() {
      return this.$store.getters.account
    }
  },
  methods: {
    initSocket() {
      this.socket.on('roomMessage', (msg) => {
        if (this.$refs.noteWrapper) {
          const newNode = document.createElement('div')
          newNode.innerHTML = `<span>${msg}</span>`
          const children = this.$refs.noteWrapper.children
          this.$refs.noteWrapper.insertBefore(newNode, children[0])
        }
      })
    },
    sendMsg() {
      if (this.chatMssage.trim()) {
        this.socket.emit('chat', this.account + ': ' + this.chatMssage)
        this.chatMssage = ''
      }
    },
    levelRoom() {
      this.socket.emit('leave', {
        roomId: this.roomId,
        account: this.account
      })
    },
    getRoomInfo() {
      return new Promise((resolve, reject) => {
        this.socket.emit('getRoomInfo', this.roomId, (err, data) => {
          console.log('获取房间数据', data)
          if (data) {
            this.creater = data.creater
            this.roomInfo = data
            const account = this.$store.getters.account
            if (account === this.creater) {
              this.isCreater = true
            }
            resolve()
          } else {
            this.$toast.error(err)
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .note-wrapper {
    position: fixed;
    padding-left: 5px;
    overflow-y: auto;
    right: 0;
    bottom: 10px;
    width: 200px;
    height: 200px;
    border: 1px dashed #aaa;
    opacity: 0.56;
    z-index: 10;
    text-align: left;
    .input-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      input {
        width: 100%;
      }
    }
  }
</style>
