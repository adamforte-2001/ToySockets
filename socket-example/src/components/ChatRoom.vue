<script setup>
  /**
 * @typedef {Object} ChatRoom
 * @property {import('vue').ComputedRef<boolean>} connected
 * @property {import('vue').ComputedRef<import('vue').Ref<string>>} inputValue
 * @property {import('vue').ComputedRef<{from:string, message:string}[]>} messageFeed
 * @property {import('vue').ComputedRef<() => void>} send
 * @property {() => void} toggleChat
 * @property {import('vue').Ref<boolean>} onSignalChat
 */
  
  import { ref, inject, computed } from 'vue'
  /**@type {ChatRoom} */
  const chatRoom = inject("chatRoom");
</script>

<template>
    <h1>Test</h1>

    <div class="card">
        <div>
            <h2>Message Feed</h2>
            <ul class="flex flex-col w-[100%]">
            <li v-for="(message, index) in chatRoom.messageFeed.value" :key="index" 
            :class="{
                'self-end': message.sender == 'server', 
                'self-start' : message.sender == 'client'
            }">
                {{ message.message}}
            </li>
            </ul>
            <input type="text" 
            v-model="chatRoom.inputValue.value.value"
            @keyup.enter="chatRoom.send.value"
            placeholder="Type a message"
            />    
        </div>
    </div>
    <button v-on:click="chatRoom.toggleChat">Switch to {{chatRoom.onSignalChat.value ? "WebSocket" : "SignalR"}}</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
