<script setup>  
    import { ref, computed } from 'vue'
    import SignalRChatRoom from './SignalRChatRoom.vue';
    import SocketMessenger from './SocketMessenger.vue';
    const usingSignalRChat = ref(false);
    function toggleChat() {
        usingSignalRChat.value = !usingSignalRChat.value;
    }
</script>

<template>
    <div v-if="!usingSignalRChat">
        <SocketMessenger/>
    </div>
    <div v-else>
        <SignalRChatRoom/>
    </div>
    <button v-on:click="toggleChat">Switch to {{usingSignalRChat ? "WebSocket" : "SignalR"}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
