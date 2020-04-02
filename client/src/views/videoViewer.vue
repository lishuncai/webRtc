<template>
  <div>
    <div>
      {{account}}
      <div class="main">
        <div class="button-wrapper">
          <mu-button @click="getUserMediaStream" :disabled="isConnecting">
            开始录像
          </mu-button>
          <mu-button @click="stopStream" :disabled="!isConnecting">关闭录像</mu-button>
          <mu-button @click="onPussSdpHandler">拉取对方录像</mu-button>
        </div>

        <div class="mine">
          <video ref="mineVideo" class="mine-video" src="" autoplay />
        </div>
        <div class="others" ref="othersBox"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: null,
    creater: null,
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
      isConnecting: false,
      peerList: {},
      targetUser: null
    }
  },
  mounted () {
    const path = `/room/${this.roomId}`
    this.socket = this.$io.getSocketSpace(path)
    this.init()
    this.emitJoin()
  },
  computed: {
    isAlive() {
      return this.$store.state.socketALive
    },
    account() {
      return this.$store.getters.account
    }
  },
  beforeDestroy() {
    if (this.localstream) {
      this.localstream.getTracks().forEach(track => {
        track.stop()
      })
    }
    this.stopStream()
    for (const k in this.peerList) {
      this.peerList[k].close()
      this.peerList[k] = null
      delete this.peerList[k]
    }
  },
  methods: {
    // 初始化 rconnection
    init() {
      this.peer = this.createPeer(this.account)
      this.peerList[this.account] = this.peer
      this.socket.on('joined', (data) => {
        console.log('onjoined', data)
        this.onJoined(data.list, data.account)
      })
      this.socket.on('leave', (data) => {
        if (data) {
          this.peerList[data] = null
          delete this.peerList[data]
          this.removeVideoBox(data)
        }
      })
      this.socket.on('candidate', (data) => {
        if (data.target !== this.account) return
        console.log('candidate', data, this)
        if (data.candidate) {
          console.log('收到candidate')
          const peer = this.peerList[data.sender]
          const candidate = new RTCIceCandidate(data.candidate)
          peer.addIceCandidate(candidate)
          .then(() => {
            console.log('设置candate成功')
          })
          .catch(err => {
            console.error(err)
          })
        } else {
          console.log('没有candidate', data.candidate)
        }
      })
      this.socket.on('answer', (data) => {
        if (data.target !== this.account) return
        console.log('answer', data)
        if (data.answer) {
          console.log('收到answer')
          const peer = this.peerList[data.sender]
          const desc = new RTCSessionDescription(data.answer)
          peer.setRemoteDescription(desc)
        } else {
          console.log('没有answer内容', data)
        }
      })
      this.socket.on('offer', async (data) => {
        if (data.target !== this.account) return
        if (data.offer) {
          console.log('搜到offer')
          const peer = this.peerList[data.sender]
          if (peer) {
            const desc = new RTCSessionDescription(data.offer)
            peer.setRemoteDescription(desc)
            .then(() => {
              return this.localstream || this.getUserMediaStream()
            })
            .then(() => {
              if (this.localstream) {
                // 此行取代addStream()
                this.localstream.getTracks().forEach(track => peer.addTrack(track, this.localstream))
              }
              return peer.createAnswer()
            }, (err) => {
              // 打开录像失败或不被允许
              console.log('未授权录像')
              console.error(err)
            })
            .then((answer) => {
              return peer.setLocalDescription(answer)
            })
            .then(() => {
              this.socket.emit('answer', {
                roomId: data.roomId,
                sender: this.account,
                target: data.sender,
                answer: peer.localDescription
              })
            })
            .catch(err => {
              console.error(err)
            })
          } else {
            console.log('没有peer对象', this.peerList, data.account)
          }
        } else {
          console.log('offer内容不存在', data)
        }
      })
    },
    emitJoin() {
      this.socket.emit('join', {
        account: this.account,
        roomId: this.roomId
      }, (err) => {
        if (!err) {

        } else {
          this.$toast.warning(err)
        }
      })
    },
    onPussSdpHandler() {
      Object.keys(this.peerList).map(name => {
        if (name !== this.account) {
          const state = this.peerList[name].connectionState
          // peer状态详见MDN https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
          if (['connecting', 'connected', 'closed'].indexOf(state) > -1) {
            return
          }
          this.pussSdp(name, this.peerList[name])
        }
      })
    },
    onJoined(list, account) {
      if (Array.isArray(list) && list.length > 1) {
        list.map(name => {
          if (!this.peerList[name] && name !== this.account) {
            this.peerList[name] = this.createPeer(name)
          }
        })
      }
    },
    createOthervideo(event, v) {
      const videoWrapper = document.createElement('div')
      const text = document.createElement('span')
      text.className = 'username'
      text.textContent = v
      videoWrapper.className = 'room-video-wrapper'
      const video = document.createElement('video')
      video.id = 'v-' + v
      video.className = 'room-joins-video'
      video.autoplay = 'autoplay'
      video.playsinline = 'true'
      video.srcObject = event.stream
      videoWrapper.appendChild(video)
      videoWrapper.appendChild(text)
      const children = this.$refs.othersBox.children
      if (children[0]) {
        this.$refs.othersBox.insertBefore(videoWrapper, children[0])
      } else {
        this.$refs.othersBox.appendChild(videoWrapper)
      }
    },
    removeVideoBox(v) {
      const node = document.querySelector('v-' + v)
      node && node.remove()
    },
    stopStream() {
      this.isConnecting = false
      if (this.peer) {
        this.peer.close()
        this.peer = null
      }
      this.localstream.getTracks().forEach(track => {
        track.stop()
      })
      this.localstream = null
    },
    // 获取本地媒体流
    getUserMediaStream() {
      const constraints = {
        video: {
          facingMode: 'user' // 设置前/后摄像头
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

      return navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.localstream = stream
          console.log('本地流', typeof stream)
          const video = this.$refs.mineVideo
          video.srcObject = stream
          video.onloadedmetadata = (e) => {
            console.log('可以播放了')
            this.isConnecting = true
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },

    createPeer(v) {
      const PeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection
      console.log('PeerConnection', PeerConnection)
      const iceServer = {
        iceServers: [
          {
            urls: 'turn:shsg.vip:3478',
            username: 'shsg',
            credential: 'shsg'
          }
          // {
          //   urls: 'stun:stun.stunprotocol.org'
          // }
          // {
          //   urls: 'stun:stun.l.google.com:19302'
          // }
        ]
      }
      const peer = new PeerConnection(iceServer)
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit('candidate', {
            roomId: this.roomId,
            sender: this.account,
            target: v,
            candidate: event.candidate
          })
        } else {
          // console.log('没有获取到候选信息')
        }
      }
      peer.onaddstream = (event) => {
        if (event.stream) {
          const video = document.querySelector('#v-' + v)
          if (video) {
            video.srcObject = event.stream
          } else {
            this.createOthervideo(event, v)
          }
          console.log('收到媒体流', typeof event.stream)
        }
      }
      return peer
    },
    // 发送sdp消息
    async pussSdp(target, peer) {
      if (this.localstream) {
        this.localstream.getTracks().forEach(track => peer.addTrack(track, this.localstream))
      }
      const offer = await peer.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })
      console.log('创建offer信息完成')
      await peer.setLocalDescription(offer)
      console.log('保存offer描述')
      this.socket.emit('offer', {
        roomId: this.roomId,
        sender: this.account,
        target: target,
        offer: peer.localDescription
      }) // 呼叫端设置本地 offer 描述
    }
  }
}
</script>
<style>
.room-video-wrapper {
  text-align: center;
}
.room-video-wrapper .username {
  line-height: 26px;
  font-size: 12px;
  word-break: keep-all;
}
.room-joins-video {
  object-fit: cover;
  width: 25vw;
  height: 25vw;
  margin: 4%;
  max-width: 200px;
  max-height: 200px;
  border-radius: 100%;
  background: #eee;
}
</style>
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
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  .others {
    display: flex;
    flex-flow: row wrap;
  }
}
</style>
