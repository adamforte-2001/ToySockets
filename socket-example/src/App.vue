<script setup>
  import { provide } from 'vue';
  import ChatRoom from './components/ChatRoom.vue';
  import useChatRoom from './Composables/useChatRoom.js'
  import useSocketMessenger from './Composables/useSocketMessenger.js';
  import SocketMessenger from './Components/SocketMessenger.vue';
  const chatRoom = useChatRoom();
  provide("chatRoom", chatRoom);
  //const socketMessenger = useSocketMessenger();
  //provide("socketMessenger", socketMessenger);
</script>

<template>
  <ChatRoom/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
