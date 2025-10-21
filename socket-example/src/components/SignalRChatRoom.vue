<script setup>
    import useSignalRChatroom from '../Composables/useSignalRChatroom';
    const signalRChatroom = useSignalRChatroom();
</script>

<template>
    <div class="flex flex-col py-1">
        <p>Set a topic</p>
        <input v-model="signalRChatroom.topicInputValue.value" placeholder="topic" @keyup.enter="signalRChatroom.switchTopic">
        <button v-on:click="signalRChatroom.switchTopic">Set topic</button>
    </div>
    <div class="py-1">
        <h2>SignalR Message Feed</h2>
        <ul class="flex flex-col w-[100%]">
        <li v-for="(message, index) in signalRChatroom.messageFeed.value" :key="index" 
        :class="signalRChatroom.getMessageClass(message)">
            {{ message.message}}
        </li>
        </ul>
        <input type="text" 
        v-model="signalRChatroom.sendInputValue.value"
        @keyup.enter="signalRChatroom.send"
        placeholder="Type a message"
        />    
    </div>
</template>
