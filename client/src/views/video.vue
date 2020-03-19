<template>
  <div class="video-wrapper">
    <button @click="getUserMediaStream">点击录像</button>
    <button @click="stopStream">关闭录像</button>
    <button @click="call">call</button>
    <video
      id="rtcA"
      ref="videoA"
      src=""
      autoplay
    />
    <video
      id="rtcB"
      ref="videoB"
      src=""
      autoplay
    />
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      peerA: null,
      peerB: null,
      offerOption: '',
      localstream: null
    }
  },
  mounted() {
    // this.getUserMediaStream()
  },
  methods: {
    stopStream() {
      this.localstream.getTracks().forEach(track => {
        track.stop()
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
          const video = this.$refs.videoA
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
      // const iceServers = {
      //   iceServers: [
      //     {
      //       url: 'stun:stun.l.google.com:19302'
      //     }
      //   ]
      // }
      let iceServer = {
        "iceServers": [
          {
            "url": "stun:stun.l.google.com:19302"
          }
        ]
      };
      this.peerA = new PeerConnection(iceServer)
      this.peerB = new PeerConnection(iceServer)
      try {
        this.peerA.addStream(this.localstream)
      } catch (err) {
        throw ('添加流信息失败', err)
      }
      this.peerA.onicecandidate = (event) => {
        // 监听 A 的ICE候选信息 如果收集到，就添加给 B 连接状态
        if (event.candidate) {
          console.log('获取到候选信息')
          this.peerB.addIceCandidate(event.candidate)
        } else {
          console.log('没有获取到候选信息')
        }
      }
      // 如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
      // this.peerB.onaddstream = (event) => {
      //   const video = this.$refs.videoB
      //   video.srcObject = event.stream
      //   video.onloadedmetadata = (e) => {
      //     console.log('可以播放了')
      //     video.play()
      //   }
      // }
      this.peerB.onaddstream = (event) => {
        const video = this.$refs.videoB
        video.srcObject = event.stream
      }
      this.peerB.onicecandidate = (event) => {
        if (event.candidate) {
          this.peerA.addIceCandidate(event.candidate)
        }
      }
    },
    async call() {
      console.log('创建offer信息')

      const offer = await this.peerA.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })
      console.log('创建offer信息完成')
      await this.onCreateOffer(offer)
    },
    // 生成offer信息
    async onCreateOffer(desc) {
      console.log('设置offer描述')
      try {
        await this.peerA.setLocalDescription(desc) // 呼叫端设置本地 offer 描述
        await this.peerB.setRemoteDescription(desc) // 接收端设置远程 offer 描述
        let answer = await this.peerB.createAnswer()
        this.onCreateAnswer(answer)
      } catch (err) {
        console.error(err)
      }
    },
    // 生成answer信息
    async onCreateAnswer(answer) {
      console.log('设置answer描述')
      try {
        await this.peerB.setLocalDescription(answer) // 接收端设置本地 answer 描述
        await this.peerA.setRemoteDescription(answer) // 呼叫端端设置远程 answer 描述
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#rtcA,
#rtcB {
  width: 100%;
  margin-top: 10px;
  height: 300px;
  display: block;
  background-color: #eee;
}
</style>
