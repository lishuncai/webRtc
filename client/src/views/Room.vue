<template>
  <div>
    <p>
      房主：{{creater}} / 房号： {{roomId}}
    </p>
    <video-viewer :roomId="roomId" :account="creater" :isCreater="isCreater"></video-viewer>
    <div class="note-wrapper" ref="noteWrapper"></div>
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
      isCreater: false
    }
  },
  components: {
    videoViewer
  },

  beforeRouteLeave (to, from, next) {
    this.levelRoom()
    next()
  },
  async activated() {
    const params = this.$route.params
    this.roomId = params.roomId
    await this.getRoomInfo()
  },
  mounted() {
    this.initSocket()
  },
  computed: {
    account() {
      return this.$store.getters.account
    }
  },
  methods: {
    initSocket() {
      this.$socket.on('joned', (data) => {
        const newNode = document.createElement('div')
        newNode.innerHTML = `<span>${data}</span>`
        const children = this.$refs.noteWrapper.children
        this.$refs.noteWrapper.insertBefore(newNode, children[0])
      })
      this.$socket.on('level', (data) => {
        const newNode = document.createElement('div')
        newNode.innerHTML = `<span>${data}</span>`
        const children = this.$refs.noteWrapper.children
        this.$refs.noteWrapper.insertBefore(newNode, children[0])
      })
    },
    levelRoom() {
      this.$socket.emit('leave', {
        roomId: this.roomId,
        account: this.account
      })
    },
    getRoomInfo() {
      return new Promise((resolve, reject) => {
        this.$socket.emit('getRoomInfo', this.roomId, (err, data) => {
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
    overflow-y: scroll;
    right: 0;
    bottom: 10px;
    width: 160px;
    height: 200px;
    border: 1px dashed #aaa;
    opacity: 0.56;
    z-index: 10;
  }
</style>
