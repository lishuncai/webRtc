<template>
  <div class="video-wrapper">
     <div>
      <h2>昵称：{{ account }}</h2>
    </div>
    <div class="button-wrapper" if="!showMedia">
      <mu-button class="btn" color="secondary" @click="createRoom"
        >创建房间</mu-button
      >
      <mu-button class="btn" color="teal" @click="showEnterRoomId=true"
        >加入房间</mu-button
      >
    </div>
    <div v-if="showMedia">
      <!-- <h1>房间{{ roomId }}</h1> -->
      <div class="main">
        <button @click="join" :disabled="account">加入通话</button>
        <!-- <button @click="getUserMediaStream">创建通话</button> -->
        <button @click="stopStream">关闭通话</button>
        <div class="mine">
          <video ref="mineVideo" class="mine-video" src="" autoplay />
        </div>
        <div class="others" refs="othersBox"></div>
        <div class="note-wrapper" ref="noteWrapper"></div>
      </div>
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
      peer: null,
      localstream: null,
      streams: [],
      isCreater: true,
      roomId: '',
      joinRoomId: '',
      account: '',
      offer: null,
      answer: null,
      candidate: null,
      showEnterRoomId: false,
      errorMsg: '',
      showMedia: false,
      showEnterAccount: false
    }
  },

  async mounted() {
    let account = localStorage.getItem('account')
    if (!account) {
      this.showEnterAccount = true
    } else {
      this.account = account
    }
  },
  methods: {
    initSocket() {
      this.$socket.on('joned', data => {
        this.call()
        let newNode = document.createElement('div')
        newNode.innerHTML = `<span>${data}</span>`
        let children = this.$refs.noteWrapper.children
        this.$refs.noteWrapper.insertBefore(newNode, children[0])
      })
    },
    confirmAccount() {
      if (this.account) {
        localStorage.setItem('account', this.account)
        this.showEnterAccount = false
      } else {
        this.errorMsg = '请输入昵称'
      }
    },
    enterRoom() {
      let joinRoomId = this.joinRoomId
      this.showEnterRoomId = false
    },
    createRoom() {
      this.$socket.emit('createRoom', this.account, (data) => {
        this.roomId = data.roomId
        this.joinRoomId = data.roomId
        console.log('房间数据', data)
        this.$router.push({
          path: `/Room/${data.roomId}`
        })
      })
    },
    async join() {
      return new Promise((resolve, reject) => {
        this.$socket.emit('join', (err, data) => {
          // this.account  = data.account
          console.log('加入功能')
          resolve()
        })
      })

      // if (!this.roomId) {
      //   this.$socket.emit('join', (err, id) => {
      //     if (err) throw err
      //     this.roomId = id
      //   })
      // }
    },
    createOthervideo(stream) {
      this.streams.push(stream)
      const video = document.createElement('video')
      video.className = "others-video"
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
      let iceServer = {
        "iceServers": [
          {
            "url": "stun:stun.l.google.com:19302"
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
          console.log('没有获取到候选信息')
        }
      }
      this.peer.onaddstream = (event) => {
        if (event.stream) {
          this.createOthervideo(event.stream)
        }
      }
      this.peer.addIcecandidate = (event) => {
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
        this.peer.addIcecandidate(data.candidate)
      })
      this.$socket.on('answer', (data) => {
        this.peer.setRemoteDescription(data)
      })
      this.$socket.on('offer', async (data) => {
        this.peer.setRemoteDescription(data)
        let answer = await this.peer.createAnswer()
        this.answer = answer
        this.peer.setLocalDescription(answer)
        this.$socket.emit('answer', {
          account: this.account,
          desc: answer
        })
      })
    },
    async call() {
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
.button-wrapper {
  margin-top: 36%;
  .btn {
    margin: 0 10px;
  }
}
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
