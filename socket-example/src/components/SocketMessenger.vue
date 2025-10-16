<script setup>
  import { ref, inject, computed } from 'vue'
  const socketMessenger = inject("socketMessenger");
</script>

<template>
  <h1>Test</h1>

  <div class="card">
    <h2>Message Feed</h2>
    <ul class="flex flex-col w-[100%]">
      <li v-for="(message, index) in socketMessenger.messageFeed.value" :key="index" 
      :class="{
        'self-end': message.sender == 'server', 
        'self-start' : message.sender == 'client'
      }">
          {{ message.message}}
      </li>
    </ul>
    <input type="text" 
      v-model="socketMessenger.inputValue.value"
      @keyup.enter="socketMessenger.send"
      placeholder="Type a message"
    />    
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
