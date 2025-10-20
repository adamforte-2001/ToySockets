import useSignalRChatroom from "./useSignalRChatroom";
import useSocketMessenger from "./useSocketMessenger";
import { HubConnectionState } from "@microsoft/signalr";
import { ref, computed } from 'vue';


export default function useChatRoom(){
    const signalRChatroom = useSignalRChatroom();
    const socketMessenger = useSocketMessenger();

    /**@type {import('vue').Ref<boolean>} */
    const onSignalChat = ref(false);

    /** @type {import('vue').ComputedRef<boolean>} */
    const connected = computed(() => 
        onSignalChat.value ? signalRChatroom.connectionState.value == HubConnectionState.Connected
            : socketMessenger.connectionState.value == WebSocket.OPEN
    );
    /** @type {import('vue').ComputedRef<import('vue').Ref<string>>} */
    const inputValue = computed(() => 
        onSignalChat.value ? signalRChatroom.inputValue
        : socketMessenger.inputValue
    );
    /** @type {import('vue').ComputedRef<{from:string, message:string}[]>} */
    const messageFeed = computed(() =>
        onSignalChat.value ? signalRChatroom.messageFeed.value 
        : socketMessenger.messageFeed.value 
    );
    /**@type {import('vue').ComputedRef<() => void>} */
    const send = computed(() =>
        onSignalChat.value ? signalRChatroom.send 
        : socketMessenger.send
    );

    /** @type {() => void} */
    function toggleChat(){
        onSignalChat.value = !onSignalChat.value;
    }
    
    return{ 
        connected: connected,
        inputValue: inputValue,
        messageFeed: messageFeed,
        send: send,
        toggleChat: toggleChat,
        onSignalChat: onSignalChat
    };
};