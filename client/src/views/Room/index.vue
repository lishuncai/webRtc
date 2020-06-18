<template>
  <div class="Room">
    <div class="room-top-bar">
      <div class="munber-control">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-people"></use>
        </svg>
        <span class="count">{{peopleCounts}}</span>
      </div>
      <p class="room-info">房主：{{ creater }} / 房号：{{ roomId }}</p>
    </div>
    <div class="note-wrapper">
      <div ref="noteWrapper"></div>
      <div class="input-box">
        <i v-svgIcon="'#icon-enter'" class="svg-icon" @click="sendMsg"></i>
        <input type="text" v-model="chatMssage" @keyup.enter="sendMsg" />
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="icon-text call" @click="onPushSdpHandler">
        <i v-svgIcon="'#icon-callout'" class="svg-icon"></i>
        <span>通话</span>
      </div>
      <div class="icon-text call" :class="openVideo?'on':'off'" @click="toggleStreamHandler('video')">
        <i v-svgIcon="'#icon-camera'" class="svg-icon"></i>
        <span>录像</span>
      </div>
      <div class="icon-text call" :class="openAudio?'on':'off'" @click="toggleStreamHandler('audio')">
        <i v-svgIcon="'#icon-Mic'" class="svg-icon"></i>
        <span>录音</span>
      </div>
     <div class="icon-text call" @click="onChangerCamera">
        <i v-svgIcon="'#icon-Switch'" class="svg-icon"></i>
        <span>切换相机</span>
      </div>
      <div class="icon-text call"  @click="exitRoom">
        <i v-svgIcon="'#icon-exit'" class="svg-icon"></i>
        <span>退出</span>
      </div>
    </div>
    <!--显示区域-->
    <div class="main show-area">
      <div class="show-area-big">
        <audio v-if="bigVideo" :src-object.prop.camel="bigVideo.audio"></audio>
        <video v-if="bigVideo" ref="currentVideo" class="current-video" :src-object.prop.camel="bigVideo.video" autoplay />
      </div>
      <div class="others" ref="othersBox">
        <div class="other-show-box">
          <video ref="mineVideo" class="mime-video" src="" autoplay />
          <p class="username">{{account}}</p>
        </div>
        <div class="other-show-box" v-for="(item, index) in streams" :key="index">
          <audio v-if="item.audio" :src-object.prop.camel="item.audio"></audio>
          <video class="others-show-video" :src-object.prop.camel="item.video" autoplay playsinline></video>
          <p class="username">{{item.v}}</p>
        </div>      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data() {
    return {
      creater: null,
      roomId: null,
      roomInfo: null,
      chatMssage: '',
      isCreater: false,
      peopleCounts: 0,

      socket: null,
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
  beforeRouteEnter (to, from, next) {
    if (to.params.roomId) {
      next()
    } else {
      next('/meeting')
    }
  },
  beforeDestroy() {
    this.socket && this.socket.close()
    this.stopStream(this.localstream)
    for (const k in this.peerList) {
      this.peerList[k].close()
      this.peerList[k] = null
      delete this.peerList[k]
    }
    this.$refs.mineVideo.srcObject = null
  },

  beforeRouteLeave(to, from, next) {
    if (from.name === 'room') {
      this.levelRoom()
    }
    next()
  },

  created() {
    if (this.account) {
      this.roomId  = this.$route.params.roomId
      if (this.roomId) {
        const path = `/room/${this.roomId}`
        this.socket = this.$io.getSocketSpace(path)
      } else {
        this.$Message('未找到房间id')
      }
    } else {
      this.$Message('请先输入昵称')
      this.$router.push('/')
    }
  },
  mounted() {
    if (this.socket) {
      this.initSocket()
      this.getRoomInfo()
      if (this.account) {
        this.emitJoin()
      }
    }
  },
  computed: {
    account() {
      return this.$store.getters.account
    },
    isAlive() {
      return this.$store.state.socketALive
    },
    constraints() {
      return {
        video: {
          facingMode: this.camera === 'user' ? 'user' : { exact: 'environment' }
        },
        audio: true
      }
    },
    bigVideo() {
      return this.streams[1] || this.streams[0]
    }
  },
  methods: {
    initSocket() {
      this.peer = this.createPeer(this.account)
      this.peerList[this.account] = this.peer
      this.socket.on('roomMessage', (msg) => {
        if (this.$refs.noteWrapper) {
          const newNode = document.createElement('div')
          newNode.innerHTML = `<span>${msg}</span>`
          const children = this.$refs.noteWrapper.children
          this.$refs.noteWrapper.insertBefore(newNode, children[0])
        }
      })
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
              .then(async () => {
                if (this.localstream) {
                  return this.localstream
                } else {
                  const newStream = await this.getUserMediaStream()
                  this.localstream = newStream
                  return newStream
                }
              })
              .then((stream) => {
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
          const streamObj = this.streams.find(item => item.v === data.sender)
          if (streamObj.video) {
            streamObj.video.forEach(track => {
              track.enabled = data.enabled
            })
          }
        }
      })
      // 对方关闭/打开了录音
      this.socket.on('audio_enabled', (data) => {
        if (data.sender) {
          const streamObj = this.streams.find(item => item.v === data.sender)
          if (streamObj.audio) {
            streamObj.audio.forEach(track => {
              track.enabled = data.enabled
            })
          }
        }
      })
    },
    setMyStreamState(stream) {
      this.localstream.getTracks().forEach(track => {
        if ((track.kind === 'video' && !this.openVideo)||(track.kind === 'audio' && !this.openAudio)) {
          track.enabled = false // 单纯改变录像可渲染状态，不会关闭摄像头
          track.stop()
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
    emitJoin() {
      this.socket.emit('join', {
        account: this.account,
        roomId: this.roomId
      }, (err) => {
        if (!err) {

        } else {
          this.$Message.warn(err)
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
      if (this.socket) {
        this.socket.emit('leave', {
          roomId: this.roomId,
          account: this.account
        })
      }
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
            this.$Message.error(err)
          }
        })
      })
    },
    removeVideoBox(v) {
      console.log('有人离开', v)
      const index = this.streams.findIndex(item => item.v === v)
      if (index > -1) {
        this.streams.splice(index, 1)
        console.log('移除视频', index, v)
      }
    },
    exitRoom() {
      this.$Confirm('确定退出？').then(() => {
        this.$router.push({
          path: '/meeting'
        })
      }).catch(() => {});
    },

    async onPushSdpHandler() {
      this.$Loading()
      try {
        const stream = await this.getUserMediaStream()
        this.setNewStream(stream, this.localstream)
        this.setMyStreamState(stream)
      } catch (err) {
        if (err) return
      }
      this.$Loading.close()
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

    setNewStream(newStream, oldStream) {
      if (oldStream) {
        this.stopStream(oldStream)
      }
      this.localstream = newStream
    },

    stopStream(stream) {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.enabled = false
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
        // this.localstream.getTracks().forEach(track => {
        //   if (track.kind === type) {
        //     track.enabled = false // 单纯改变录像可渲染状态，不会关闭摄像头
        //     track.stop()
        //   }
        // })
          this.setMyStreamState(this.localstream)

      } else {
        try {
          const stream = await this.getUserMediaStream()
          // 切换流
          await this.changePeerStream(stream, type)
          this.setNewStream(stream, this.localstream)
          this.setMyStreamState(stream)

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
        this.setMyStreamState(stream)        
      } catch (err) {
        if (err) {
          console.error(err)
          this.$Message.error('切换失败')
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
        let sender = peer.getSenders()
        sender.map(function(s) {
          if (s.track) {
            stream.getTracks().forEach(track => {
              if (track.kind === s.track.kind) {
                if (s.track.kind === type) {
                  promiseArr.push(s.replaceTrack(track))
                }
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

<style lang='scss' scoped>
@import './style.scss';
</style>
