<template>
  <div>
    <div>
      {{account}}
      <div class="main">
        <div class="button-wrapper">
          <mu-button @click="onPushSdpHandler">开始通话</mu-button>
          <mu-button @click="toggleStreamHandler('video')" :disabled="!openAudio">{{openVideo?'关闭录像':'打开录像'}}</mu-button>
          <mu-button @click="toggleStreamHandler('audio')" :disabled="!openVideo">{{openAudio?'关闭录音':'打开录音'}}</mu-button>
          <mu-button @click="onChangerCamera">切换摄像头</mu-button>
          <mu-button @click="exitRoom">退出房间</mu-button>
        </div>

        <div class="mine">
          <video ref="mineVideo" class="mine-video" src="" autoplay />
        </div>
        <div class="others" ref="othersBox">
          <div class="stream-box" v-for="(item, index) in streams" :key="index">
            <audio v-if="item.audio" :src-object.prop.camel="item.audio"></audio>
            <video class="stream-video" :src-object.prop.camel="item.video" autoplay playsinline></video>
            <p class="username">{{item.v}}</p>
          </div>
        </div>
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
      peerList: {},
      targetUser: null,
      openVideo: true,
      openAudio: true,
      camera: 'user' // user, environment
    }
  },
  mounted () {
    const path = `/room/${this.roomId}`
    this.socket = this.$io.getSocketSpace(path)
    this.initSocket()
    if (this.account) {
      this.emitJoin()
    }
  },
  computed: {
    isAlive() {
      return this.$store.state.socketALive
    },
    account() {
      return this.$store.getters.account
    },
    constraints() {
      return {
        video: {
          facingMode: this.camera === 'user' ? 'user' : { exact: 'environment' }
        },
        audio: true
      }
    }
  },
  beforeDestroy() {
    this.stopStream(this.localstream)
    this.$refs.mineVideo.srcObject = null
    for (const k in this.peerList) {
      this.peerList[k].close()
      this.peerList[k] = null
      delete this.peerList[k]
    }
  },
  methods: {
    // 初始化 rconnection
    initSocket() {
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
            .then((stream) => {
              this.setNewStream(stream, this.localstream)
              if (stream) {
                // 此行取代addStream()
                stream.getTracks().forEach(track => peer.addTrack(track, stream))
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
      // 对方关闭/打开了录像
      this.socket.on('video_enabled', (data) => {
        if (data.sender) {
          // const streamObj = this.streams.find(item => item.v === data.sender)
          // if (streamObj.video) {
          //   streamObj.video.forEach(track => {
          //     track.enabled = data.enabled
          //   })
          // }
        }
      })
      // 对方关闭/打开了录音
      this.socket.on('audio_enabled', (data) => {
        if (data.sender) {
          // const streamObj = this.streams.find(item => item.v === data.sender)
          // if (streamObj.audio) {
          //   streamObj.audio.forEach(track => {
          //     track.enabled = data.enabled
          //   })
          // }
        }
      })
    },
    exitRoom() {
      this.$router.push({
        path: '/meeting'
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
    async onPushSdpHandler() {
      try {
        const stream = await this.getUserMediaStream()
        this.setNewStream(stream, this.localstream)
      } catch (err) {
        if (err) return
      }
      console.log('打开录像，获取本地流')
      Object.keys(this.peerList).map(name => {
        if (name !== this.account) {
          const state = this.peerList[name].connectionState
          console.log('peer 连接状态', state)
          // peer状态详见MDN https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
          if (['connecting', 'connected'].indexOf(state) > -1) {
            return
          }
          this.pushSdp(name, this.peerList[name])
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
    /**
     * {String} v 用户名
     * {MediaStream} stream 媒体流
     * {String} type  媒体流类型： 视频，音频
     */
    updateStream(v, stream, type) {
      console.log('媒体流数据', {
        v,
        stream,
        type
      })
     console.log(this.streams)
      const result = this.streams.find(item => item.v === v)
      if (result) {
        result[type] = stream
      } else {
        this.streams.push({
          v,
          [type]: stream
        })
      }
      console.log('跟新媒体流数组', result, this.streams)
    },
    setNewStream(newStream, oldStream) {
      this.stopStream(oldStream)
      this.localstream = newStream
    },
    removeVideoBox(v) {
      console.log('有人离开', v)
      const index = this.streams.findIndex(item => item.v === v)
      if (index > -1) {
        this.streams.splice(index, 1)
        console.log('移除视频', index, v)
      }
    },
    stopStream(stream) {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop()
        })
      }
    },
    /**
     * {String} type track类型
     * {Boolean} enabled 状态
     */
    toggleStreamHandler(type) {
      let prop = null
      if (type === 'video') {
        prop = 'openVideo'
      } else if (type === 'audio') {
        prop = 'openAudio'
      } else {
        console.error('toggleStreamHandler 发生错误')
      }
      const flag = this[prop]
      this[prop] = !flag
      this.toggleStream(type, this[prop])
    },
    async toggleStream(type, enabled) {
      if (!this.localstream) return
      let message = ''
      if (type === 'audio') {
        message = 'audio_enabled'
      } else if (type === 'video') {
        message = 'video_enabled'
      }
      console.log('message', message)
      this.socket.emit(message, {
        sender: this.account,
        enabled
      })

      // 替换/替换流(可用于前后摄像头切换) ，参考： https://stackoverflow.com/questions/39126347/webrtc-switch-camera
      if (!enabled) {
        this.localstream.getTracks().forEach(track => {
          if (track.kind === type) {
            track.enabled = false // 单纯改变录像可渲染状态，不会关闭摄像头
            track.stop()
          }
        })
      } else {
        try {
          const stream = await this.getUserMediaStream()
          // 切换流
          await this.changePeerStream(stream, type)
          this.setNewStream(stream, this.localstream)
        } catch (err) {
          if (err) {
            console.error(err)
          }
        }
      }
    },

    async onChangerCamera() {
      const flag = this.camera
      this.camera = (flag === 'user' ? 'environment' : 'user')
      try {
        const stream = await this.getUserMediaStream()
        await this.changePeerStream(stream, 'video')
        this.setNewStream(stream, this.localstream)
      } catch (err) {
        if (err) {
          console.error(err)
          this.$toast.error('切换失败')
        }
      }
    },

    // 获取本地媒体流
    async getUserMediaStream() {
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
      console.log('constraints', this.constraints)
      // 获取设备列表
      // 参考 https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      console.log('所有设备列表', JSON.stringify(deviceList))
      // const audio = deviceList.find(device => device.kind === 'audioinput')
      // if (audio) {
      //   constraints.audio = {
      //     deviceId: audio.id
      //   }
      // }

      return navigator.mediaDevices.getUserMedia(this.constraints)
        .then((stream) => {
          console.log('本地流', typeof stream)
          const video = this.$refs.mineVideo
          video.srcObject = stream
          return stream
        })
    },

    changePeerStream(stream, type) {
      const promiseArr = []
      // 向每个peerconnection替换track
      Object.values(this.peerList).map(peer => {
         peer.getSenders().map(function(s) {
          if (s.track) {
            stream.getTracks().forEach(track => {
              if (track.kind === s.track.kind) {
                promiseArr.push(s.replaceTrack(track))
              }
            })
          }
        })
        return Promise.all(promiseArr)
        // const sender = peer.getSenders().find(function(s) {
        //   return (s.track && s.track.kind === type)
        // })
        // sender && stream.getTracks().forEach(track => {
        //   if (track.kind === type) {
        //     sender.replaceTrack(track)
        //   }
        // })
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
            urls: 'stun:47.106.9.184:3478'
          },
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
      peer.ontrack = (event) => {
        console.log('ontrack', event)
        const streams = event.streams
        const streamType = event.track.kind
        if (!streams || streams.length < 1) return
        // 区分流体类型, 音频流，视频流
        this.updateStream(v, streams[0], streamType)
      }
      return peer
    },
    // 发送sdp消息
    async pushSdp(target, peer) {
      if (this.localstream) {
        this.localstream.getTracks().forEach(track => {
          peer.addTrack(track, this.localstream)
        })
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
.stream-box {
  text-align: center;
  padding: 2%;
}
.stream-box .username {
  line-height: 26px;
  font-size: 12px;
  word-break: keep-all;
}
.stream-video {
  object-fit: cover;
  width: 25vw;
  height: 25vw;
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
    .stream-box {
      audio {
        position: absolute;
        opacity: 0;
      }
    }
  }
}
</style>
