import { ref, onMounted, onUnmounted, computed } from 'vue'
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
const env = import.meta.env;
/** @type {import('vue').Ref<import('@microsoft/signalr').HubConnection | null>} */
const _hubConnection = ref(null);
/** @type {import('vue').Ref<string | null>} */
const inputValue = ref('');
/** @type {import('vue').Ref<{from:string, message:string}[]>} */
const _messageFeed = ref([]);
/** @type {import('vue').Ref<import('@microsoft/signalr').HubConnectionState> | null } */
const connectionState = ref(HubConnectionState.Disconnected);

function send(){
    _hubConnection.value.invoke("Send", inputValue.value);
    _messageFeed.value.push({
        from: "Me",
        message:inputValue.value
    });
    inputValue.value = '';
}
function receive(message){
    _messageFeed.value.push({
        from: "Someone else",
        message:message
    });  
}

export default function useSignalRChatroom(){
    onMounted(() => {
        const url = `https://${env.VITE_SERVER}:${env.VITE_API_PORT}${env.VITE_API_ENDPOINT_SIGNALRHUB}`
        console.log(url);
        _hubConnection.value = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();
        _hubConnection.value.on("Receive", (message) => receive(message));
        _hubConnection.value.onreconnected(() => {
            connectionState.value = HubConnectionState.Connected;
        });
        _hubConnection.value.onreconnecting(() => {
            connectionState.value = HubConnectionState.Reconnecting;
        });

        _hubConnection.value.start()
            .then(() => {
                isConnected.value = HubConnectionState.Connected;
            }).catch(() => {
                connectionState.value = HubConnectionState.Disconnected;
            });

    });
    onUnmounted(() => {
        _hubConnection.value.stop();
    });
    /**
     * @returns {{
     *   connectionState: import('vue').ComputedRef<import('@microsoft/signalr').HubConnectionState>,
     *   inputValue: import('vue').Ref<string>,
     *   messageFeed: import('vue').ComputedRef<{from:string, message:string}[]>,
     *   send: () => void
     * }}
     */
    return {
        connectionState: connectionState,
        inputValue: inputValue,
        messageFeed: computed(() => [..._messageFeed.value]),
        send: send
    }
}