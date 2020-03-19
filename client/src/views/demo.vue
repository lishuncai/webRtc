<template>
  <div class="camera_outer">
    <p>
      <button id="openMedia">打开</button>
      <button id="closeMedia">关闭</button>
      <button id="drawMedia">截取</button>
    </p>
    <video id="video" class="bg"></video>
    <canvas id="qr-canvas"></canvas>
  </div>
</template>
<script>
export default {
  data () {
    return {
      videoWidth: 3000,
      videoHeight: 300,
      imgSrc: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null
    }
  },
  mounted () {
    document.querySelector('#openMedia').click = openMedia
    document.querySelector('#closeMedia').click = closeMedia
    document.querySelector('#drawMedia').click = drawMedia

    var video = document.querySelector('video')
    // var text = document.getElementById('text')
    var canvas1 = document.getElementById('qr-canvas')
    var context1 = canvas1.getContext('2d')
    var mediaStreamTrack

    // 一堆兼容代码
    window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL)
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }

    // 摄像头调用配置
    var mediaOpts = {
      audio: false,
      video: true
      // video: {width: 1280, height: 720 }
      // video: {facingMode: {exact: "environment" } }// 或者 "user"
    }

    // 回调
    function successFunc (stream) {
      mediaStreamTrack = stream
      video = document.querySelector('video')
      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream
      }
      video.play()
    }
    function errorFunc (err) {
      alert(err.name)
    }

    // 正式启动摄像头
    function openMedia () {
      navigator.mediaDevices.getUserMedia(mediaOpts).then(successFunc).catch(errorFunc)
    }

    // 关闭摄像头
    function closeMedia () {
      mediaStreamTrack.getVideoTracks().forEach(function (track) {
        track.stop()
        context1.clearRect(0, 0, context1.width, context1.height)// 清除画布
      })
    }

    // 截取视频
    function drawMedia () {
      canvas1.setAttribute('width', video.videoWidth)
      canvas1.setAttribute('height', video.videoHeight)
      context1.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    }
  }
}
</script>
  <style lang="scss" scoped>
.camera_outer {
  position: relative;
  overflow: hidden;
  video,
  canvas,
  .tx_img {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
  }
  .btn_camera {
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
    line-height: 50px;
    text-align: center;
    color: #ffffff;
  }
  .bg_r_img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }
  .img_bg_camera {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    img {
      width: 100%;
      height: 100%;
    }
    .img_btn_camera {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.3);
      color: #ffffff;
      .loding_img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
