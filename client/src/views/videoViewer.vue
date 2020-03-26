<template>
  <div>
    <div>
      版本：1.0.9
      <div class="main">
        <div class="button-wrapper">
          <mu-button @click="getUserMediaStream" :disabled="isConnecting">
            开始录像
          </mu-button>
          <mu-button @click="createCannel">初始化连接</mu-button>
          <mu-button @click="stopStream">关闭通话</mu-button>
        </div>

        <div class="mine">
          <video ref="mineVideo" class="mine-video" src="" autoplay />
        </div>
        <div class="others" ref="othersBox">
          <video id="rtcB" src="" autoplay class="othersvideo" ref="videoB" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: null,
    account: null,
    isCreater: {
      type: Boolean,
      default: false
    }
  },
  name: '',
  data() {
    return {
      peer: null,
      localstream: null,
      streams: [],
      offer: null,
      answer: null,
      answerOther: null,
      candidate: null,
      isConnecting: false
    }
  },
  computed: {
    isAlive() {
      return this.$store.state.socketALive
    }
  },
  methods: {
    createOthervideo(event) {
      this.streams.push(event.stream)
      const video = document.createElement('video')
      video.className = 'othersvideo'
      video.autoplay = 'autoplay'
      video.srcObject = event.stream
      const children = this.$refs.othersBox.children
      if (children[0]) {
        this.$refs.othersBox.insertBefore(video, children[0])
      } else {
        this.$refs.othersBox.appendChild(video)
      }
    },
    stopStream() {
      this.isConnecting = false
      if (!this.localstream) {
        this.$toast.warning('当前无录像')
        return
      }
      this.localstream.getTracks().forEach(track => {
        track.stop()
      })
      this.streams.map(stream => {
        stream.getTracks().map(track => {
          track.stop()
        })
      })
    },
    // 获取本地媒体流
    getUserMediaStream() {
      const constraints = {
        video: {
          facingMode: 'user'
        },
        audio: true
      }
      // 兼容写法
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }

      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.localstream = stream
          console.log('本地流', typeof stream)
          const video = this.$refs.mineVideo
          video.srcObject = stream
          video.onloadedmetadata = (e) => {
            console.log('可以播放了')
            this.isConnecting = true
            video.play()
            this.createCannel()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    createCannel() {
      this.initPeer()
      this.callOther()
    },
    // 初始化 RTCPeerConnection
    initPeer() {
      const PeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection

      console.log('PeerConnection', PeerConnection)
      const iceServer = {
        iceServers: [
          {
            url: 'stun:stun.l.google.com:19302'
          }
        ]
      }
      this.peer = new PeerConnection(iceServer)
      console.log('this.peer', this.peer)
      if (this.localstream) {
        this.peer.addStream(this.localstream)
      }
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.$socket.emit('candidate', {
            roomId: this.roomId,
            candidate: event.candidate
          })
        } else {
          console.log('没有获取到候选信息')
        }
      }
      this.peer.onaddstream = (event) => {
        if (event.stream) {
          this.createOthervideo(event)
          console.log('收到媒体流', typeof event.stream, event.stream)
          this.$refs.videoB.srcObject = event.stream
        }
      }
      this.$socket.on('candidate', (data) => {
        if (data.candidate) {
          console.log('收到candidate')
          this.peer.addIceCandidate(data.candidate)
        } else {
          console.log('没有candidate', data.candidate)
        }
      })
      this.$socket.on('answer', (data) => {
        if (data.answer) {
          console.log('收到answer')
          this.answerOther = data
          this.peer.setRemoteDescription(data.answer)
        } else {
          console.log('没有answer内容', data)
        }
      })
      this.$socket.on('offer', async (data) => {
        if (data.offer) {
          console.log('搜到offer')
          await this.peer.setRemoteDescription(data.offer)
          const answer = await this.peer.createAnswer()
          this.answer = answer
          await this.peer.setLocalDescription(answer)

          this.$socket.emit('answer', {
            roomId: this.roomId,
            account: this.account,
            answer: this.peer.localDescription
          })
          console.log('推送answer')
        } else {
          console.log('offer内容不存在', data)
        }
      })
    },
    async callOther() {
      const offer = await this.peer.createOffer({
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
      })
      console.log('创建offer信息完成')

      await this.peer.setLocalDescription(offer)
      console.log('保存offer描述')
      this.$socket.emit('offer', {
        roomId: this.roomId,
        account: this.account,
        offer
      }) // 呼叫端设置本地 offer 描述
    }
  }
}
</script>

<style lang='scss' scoped>
.main {
  overflow: hidden;
  .button-wrapper {
    button {
      margin: 2%;
    }
  }
  .mine {
    margin: 2%;
    max-width: 200px;
    width: 30vw;
    height: 30vw;
    max-height: 200px;
    float: right;
    background: #eee;
    video {
      width: 100%;
      height: 100%;
    }
  }
  .others {
    display: flex;
    flex-flow: row wrap;
    .othersvideo{
      width: 25vw;
      height: 25vw;
      margin: 4%;
      max-width: 200px;
      max-height: 200px;
      border-radius: 100%;
      background: #eee;
    }
  }
}
</style>
