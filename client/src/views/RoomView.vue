<template>
  <div>
    <div>
      <button
        @click="call"
      >开始通话</button>
      <!-- <button @click="getUserMediaStream">创建通话</button> -->
      <button @click="stopStream">关闭通话</button>
    </div>
    <div class="main">
      <div
        class="others"
        refs="othersBox"
      ></div>
      <div class="mine">
        <video
          ref="mineVideo"
          class="mine-video"
          src=""
          autoplay
        />
      </div>
    </div>
    <div
      class="note-wrapper"
      ref="noteWrapper"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: null,
    account: null
  },
  data() {
    return {
      offer: null,
      answer: null,
      candidate: null,
      peer: null,
      localstream: null,
      streams: [],
      isALive: false
    }
  },
  computed: {
    keepAlive() {
      return this.$store.state.keepAlive
    }
  },
  watch: {
    keepAlive: {
      handler(val) {
        if (val) {
          this.join()
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (window.keepAlive) {
      this.join()
    } else {

    }
  },
  methods: {
    join() {
      this.$socket.emit('join', {
        roomId: this.roomId,
        account: this.account
      }, (err, data) => {
        if (err) throw (err)
        this.getUserMediaStream()
        const newNode = document.createElement('div')
        newNode.innerHTML = `<span>${this.account}</span>`
        const children = this.$refs.noteWrapper.children
        this.$refs.noteWrapper.insertBefore(newNode, children[0])
      })
    },
    createOthervideo(stream) {
      this.streams.push(stream)
      const video = document.createElement('video')
      video.className = 'others-video'
      video.autoplay = true
      video.srcObject = stream
      this.$refs.othersBox.appendChild(video)
    },
    stopStream() {
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
      try {
        this.peer.addStream(this.localstream)
      } catch (err) {
        throw ('添加流信息失败', err)
      }
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.$socket.emit('candidate', {
            account: this.account,
            candidate: event.candidate
          })
        } else {
          this.$toast.error('没有获取到候选信息')
        }
      }
      this.peer.onaddstream = (event) => {
        if (event.stream) {
          this.createOthervideo(event.stream)
        }
      }
      this.peer.addIceCandidate = (event) => {
        if (event.candidate) {
          this.$socket.emit('candidate', {
            account: this.account,
            desc: event.candidate
          })
        } else {
          console.log('没有获取到候选信息')
        }
      }
      this.$socket.on('candidate', (data) => {
        this.peer.addIceCandidate(data.candidate)
      })
      this.$socket.on('answer', (data) => {
        this.peer.setRemoteDescription(data)
      })
      this.$socket.on('offer', async (data) => {
        this.peer.setRemoteDescription(data)
        const answer = await this.peer.createAnswer()
        this.answer = answer
        this.peer.setLocalDescription(answer)
        this.$socket.emit('answer', {
          account: this.account,
          desc: answer
        })
      })
    },
    async call() {
      if (!this.peer) {
        this.$toast.error('通话失败')
      }
      console.log('创建offer信息')
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
      console.log('设置offer描述')
      try {
        this.$socket.emit('offer', {
          account: this.account,
          desc
        }) // 呼叫端设置本地 offer 描述
        // await this.peerB.setRemoteDescription(desc) // 接收端设置远程 offer 描述
      } catch (err) {
        console.error(err)
      }
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
  .note-wrapper {
    position: fixed;
    overflow-y: scroll;
    right: 0;
    bottom: 10px;
    width: 160px;
    min-height: 200px;
    border: 1px dashed #aaa;
    opacity: 0.56;
    z-index: 10;
  }
}
</style>
