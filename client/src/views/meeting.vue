<template>
<div class="video-wrapper">
  <div>
    <h3>昵称：{{ account }}</h3>
  </div>
  <div class="button-wrapper">
    <h-button color="primary" class="btn" @click="createRoom"
    >创建房间</h-button
    >
    <Button class="btn" color="teal" @click="showEnterRoomId=true"
    >加入房间</Button
    >
  </div>
  <Modal
    :middle="true"
    v-model="showEnterRoomId">
    <div>
    <header class="h-modal-header">请输入房间Id</header>
    <div style="padding:15px">
      <input type="text" style="width: 100%" v-model="joinRoomId" placeholder="房间id">  

      <footer>
        <Button
        @click="showEnterRoomId = false"
        >算了</Button
        >
        <Button color="primary" @click="enterRoom" :disabled="!joinRoomId"
        >加入</Button
        >
      </footer>
    </div>
  </div>
  </Modal>

  <Modal
    :middle="true"
    v-model="showEnterAccount">
    <div>
      <header class="h-modal-header">请输入昵称</header>
      <div style="padding:15px">
        <input type="text" style="width: 100%" v-model="account" placeholder="昵称">
      </div>
      <footer>
        <Button color="primary" @click="confirmAccount" :disabled="!account">确认</Button>      
      </footer>      
    </div>   
  </Modal>

</div>
</template>

<script>
export default {
name: 'meeting',
data() {
return {
isCreater: true,
roomId: '',
errorMsg_join: '',
joinRoomId: '',
account: '',
showEnterRoomId: false,
errorMsg: '',
showEnterAccount: false
}
},
async mounted() {
const account = this.$store.getters.account
if (!account) {
  this.errorMsg = ''
this.showEnterAccount = true
} else {
this.account = account
}
},
computed: {
isAlive() {
return this.$store.state.socketAlive
}
},
methods: {
confirmAccount() {
if (this.account) {
this.$store.commit('account', this.account)
this.showEnterAccount = false
if (this.joinRoomId) {
  this.enterRoom()
}
} else {
this.$Message.warn = '请输入昵称'
}
},
enterRoom() {
if (!this.isAlive) {
this.$Message.warn('请求失败，socket未连接上')
return
}
if (!this.joinRoomId) {
  this.$Message.error = '房间id无效';
  return 
}
this.intoRoom()
this.showEnterRoomId = false
},
createRoom() {
if (!this.isAlive) {
this.$Message.warn('请求失败，socket未连接上')
return
}
this.$io.socket.emit('createRoom', this.account, (data) => {
if (data) {
this.roomId = data.roomId
this.joinRoomId = data.roomId
console.log('房间数据', data)
this.intoRoom()
} else {
this.$Message.error('创建失败')
}
})
},
intoRoom() {
if (!this.joinRoomId) {
this.$Message.warn('获取不到房间id,创建房间失败')
return
}
if (!this.account) {
this.showEnterAccount = true
return
}
this.$Loading()
this.$io.socket.emit('enterRoom', {
roomId: this.joinRoomId,
account: this.account
}, (err) => {
this.$Loading.close()
if (!err) {
this.$router.push({
path: `/Room/${this.joinRoomId}`
})
} else {
this.$Message.error(err)
}
})
}
}
}
</script>
<style lang='scss' scoped>
.video-wrapper {
h3 {
margin:  20px 0;
}
}
.button-wrapper {
margin-top: 10px;
.btn {
margin: 0 10px;
}
}
</style>