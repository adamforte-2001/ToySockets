<script setup>
  import useSocketMessenger from '../Composables/useSocketMessenger';
  const socketMessenger = useSocketMessenger();
</script>

<template>
  <div class="card">
        <div>
            <h2>Socket Message Feed</h2>
            <ul class="flex flex-col w-[100%]">
              <li v-for="(message, index) in socketMessenger.messageFeed.value" :key="index" 
              :class="{
                  'self-end': message.from == 'server', 
                  'self-start' : message.from == 'client'
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
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
