<template>
  <div>
    <p>
      房主：{{creater}} / 房号： {{roomId}}
    </p>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      creater: '',
      roomId: '',
      roomInfo: null
    }
  },
  activated() {
    let params = this.$route.params
    this.roomId = params.roomId
    this.getRoomInfo()
  },
  methods: {
    getRoomInfo() {
      this.$socket.emit('getRoomInfo',this.roomId, (err, data) => {
        console.log('获取房间数据', data)
        if (data) {
          this.creater = data.creater
          this.roomInfo = data
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
