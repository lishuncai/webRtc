<template>
  <div>
    <div>
      1.0.0
      <!-- <h1>房间{{ roomId }}</h1> -->
      <div class="main">
        <button @click="getUserMediaStream" :disabled="!account">打开录像</button>
        <button @click="call">call他</button>
        <button @click="stopStream">关闭通话</button>
        <div class="mine">
          <video ref="mineVideo" class="mine-video" src="" autoplay />
        </div>
        <div class="others" refs="othersBox"></div>
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
      candidate: null
    }
  },
  computed: {
    isAlive() {
      return this.$store.state.socketALive
    }
  },

  methods: {
    createOthervideo(stream) {
      this.streams.push(stream)
      const video = document.createElement('video')
      video.className = 'others-video'
      video.autoplay = true
      video.srcObject = stream
      this.$refs.othersBox.appendChild(video)
    },
    stopStream() {
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
          const video = this.$refs.mineVideo
          video.srcObject = stream
          video.onloadedmetadata = (e) => {
            console.log('可以播放了')
            video.play()
            this.initPeer()
            this.call()
          }
        })
        .catch((err) => {
          console.error(err)
        })
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
      try {
        this.peer.addStream(this.localstream)
      } catch (err) {
        throw ('添加流信息失败', err)
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
          this.createOthervideo(event.stream)
        }
      }
      this.$socket.on('candidate', (data) => {
        console.log('收到candidate')
        this.peer.addIcecandidate(data.detail)
      })
      this.$socket.on('answer', (data) => {
        console.log('收到answer')
        this.peer.setRemoteDescription(data)
      })
      this.$socket.on('offer', async (data) => {
        console.log('推送answer')
        await this.peer.setRemoteDescription(data)
        const answer = await this.peer.createAnswer()
        this.answer = answer
        await this.peer.setLocalDescription(answer)
        this.$socket.emit('answer', {
          roomId: this.roomId,
          account: this.account,
          desc: this.peer.localDescription
        })
      })
    },
    async call() {
      const offer = await this.peer.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })
      console.log('创建offer信息完成')
      this.offer = offer
      await this.onCreateOffer(offer)
    },
    // 生成offer信息
    async onCreateOffer(desc) {
      this.peer.setLocalDescription(desc, () => {
        this.$socket.emit('offer', {
          roomId: this.roomId,
          account: this.account,
          desc
        }) // 呼叫端设置本地 offer 描述
      })
      console.log('保存offer描述')
    }
  }
}
</script>

<style lang='scss' scoped>
.main {
  overflow: hidden;
  .mine {
    width: 10%;
    max-width: 200px;
    min-width: 100px;
    height: auto;
    max-height: 200px;
    min-height: 100px;
    float: right;
    background: #eee;
    video {
      width: 100%;
    }
  }
  .others {
    float: left;
    .others-video {
      width: 100px;
      height: 100px;
      background: #eee;
    }
  }

}
</style>
