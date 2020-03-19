<template>
  <div class="video-wrapper">
    <button @click="getUserMediaStream">点击录像</button>
    <video id="rtcA" ref="videoA" src="" preload="auto" />
    <video id="rtcB" ref="videoB" src="" preload="auto" />
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      peerA: null,
      peerB: null,
      offerOption: ''
    }
  },
  mounted () {
    // this.getUserMediaStream()
  },
  methods: {
    // 获取本地媒体流
    getUserMediaStream () {
      const constraints = {
        video: true,
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
          const video = this.$refs.videoA

          // video.srcObject = window.URL.createObjectURL(stream)
          video.src = window.URL.createObjectURL(stream) || stream
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
    initPeer () {
      const PeerConnection = window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection

      console.log('PeerConnection', PeerConnection)
      this.peerA = new PeerConnection(this.getIceServers())
      this.peerB = new PeerConnection(this.getIceServers())
      this.peerA.addStream(this.localstream)
      this.peerA.onicecandidate = (event) => {
        // 监听 A 的ICE候选信息 如果收集到，就添加给 B 连接状态
        if (event.candidate) {
          this.peerB.addIceCandidate(event.candidate)
        }
        this.call()
      }
      this.peerB.onaddstream = (stream) => {
        const video = this.$refs.videoB
        video.src = window.URL.createObjectURL(stream) || stream
        video.onloadedmetadata = (e) => {
          console.log('可以播放了')
          video.play()
          this.initPeer()
        }
      }
      this.peerB.onicecandidate = (event) => {
        if (event.candidate) {
          this.peerA.addIceCandidate(event.candidate)
        }
      }
    },
    async call () {
      const offer = await this.peerA.createOffer(this.offerOption)
      await this.onCreateOffer(offer)
    },
    // 生成offer信息
    async onCreateOffer (desc) {
      try {
        await this.peerB.setLocalDescription(desc) // 呼叫端设置本地 offer 描述
        await this.peerA.setRemoteDescription(desc) // 接收端设置远程 offer 描述
        await this.onCreateAnswer()
      } catch (err) {
        console.error(err)
      }
    },
    // 生成answer信息
    async onCreateAnswer () {
      try {
        const answer = await this.peerA.createAnswer() // 接收端创建 answer
        await this.peerA.setLocalDescription(answer) // 接收端设置本地 answer 描述
        await this.peerB.setRemoteDescription(answer) // 呼叫端端设置远程 answer 描述
      } catch (err) {
        console.error(err)
      }
    },
    // 设置iceServers
    getIceServers () {
      return {
        iceServers: [
          { url: 'stun:stun.l.google.com:19302' } // 谷歌的公共服务
        ]
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
