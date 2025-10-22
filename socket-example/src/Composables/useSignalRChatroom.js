import { ref, onMounted, onUnmounted, computed } from 'vue'
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
const env = import.meta.env;
/**
 * @typedef {Object} Message
 * @property {string} body
 * @property {string} sender
 * @property {boolean} acknowledged
 */

/** @type {import('vue').Ref<import('@microsoft/signalr').HubConnection | null>} */
const _hubConnection = ref(null);
/** @type {import('vue').Ref<string | null>} */
const sendInputValue = ref('');
/** @type {import('vue').Ref<{from:string, message:string, acknowledged:boolean}[]>} */
const _messageFeed = ref([]);
/** @type {import('vue').Ref<import('@microsoft/signalr').HubConnectionState> | null } */
const connectionState = ref(HubConnectionState.Disconnected);
/**@type {import('vue').Ref<string>} */
const _topic = ref('default');
/**@type {import('vue').Ref<string>} */
const topicInputValue = ref('')
/**@type {import('vue').Ref<string>} */
const _connectionId = ref('');
/**
 * indexes on the _messageFeed of messages which have 
 * been sent but which have not been acknowledged
 * @type {import('vue').Ref<number[]>} */
const indexesInTransit = ref([])

/**@type {() => void} */
function switchTopic(){
    if (topicInputValue.value == _topic.value)
    {
        return;
    }
    _hubConnection.value.invoke("AddClientToTopic", _topic.value, topicInputValue.value)
    .then(() => {
        _topic.value = topicInputValue.value;
        _messageFeed.value = [];
        console.log(`topic set to ${_topic.value}`)
    }).catch((error) => {
        console.error(error);
    });
    
}
/**@type {() => string} */
function getTopicClass(){
    return _topic.value == topicInputValue.value ? "text-white" : "text-yellow-300";    
}
/**@type {(string) => void} */
function storeConnectionId(connectionId){
    _connectionId.value = connectionId;
}

function send(){
    _messageFeed.value.push({
        from: "Me",
        message:sendInputValue.value,
        acknowledged: false
    });
    indexesInTransit.value.push(_messageFeed.value.length - 1);
    _hubConnection.value.invoke("Send", sendInputValue.value, _topic.value);
    sendInputValue.value = '';
}
function receive(message, connectionId){
    if (connectionId == _connectionId.value){
        for(const index of indexesInTransit){
            if (_messageFeed.value[index].message == message){
                _messageFeed.value[index].acknowledged = true;
                return;
            } 
        }
    }
    console.log(`from ${connectionId}`);
    _messageFeed.value.push({
        from: "Someone else",
        message:message,
        acknowledged:true
    });  
}
/**@param {{from:string, message:string, acknowledged:boolean} message} */
function getMessageClass(message){
    let messageClass = 
    `rounded-lg px-1 py-[2px] text-gray-500 \
    ${message.from == "Me" ? "self-end" : "self-start"} \
    ${message.acknowledged ? "bg-green-400" : "bg-green-100"}`
    /** @returns {string} */
    return messageClass;
}

export default function useSignalRChatroom(){
    onMounted(() => {
        const url = `https://${env.VITE_SERVER}:${env.VITE_API_PORT}${env.VITE_API_ENDPOINT_SIGNALRHUB}`
        console.log(url);
        _hubConnection.value = new HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();
        _hubConnection.value.on("receive", (message, connectionId) => receive(message, connectionId));
        _hubConnection.value.on("storeConnectionId", storeConnectionId);
        _hubConnection.value.onreconnected(() => {
            connectionState.value = HubConnectionState.Connected;
        });
        _hubConnection.value.onreconnecting(() => {
            connectionState.value = HubConnectionState.Reconnecting;
        });

        _hubConnection.value.start()
            .then(() => {
                isConnected.value = HubConnectionState.Connected;
                switchTopic(_topic.value);
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
     *   send: () => void,
     *   getMessageClass: ({from:string, message:string, acknowledged:boolean}) => string
     *   switchTopic: () => void,
     *   topicInputValue: string,
     *   topicClass: import('vue').ComputedRef<string>
     * }}
     */
    return {
        connectionState: connectionState,
        sendInputValue: sendInputValue,
        messageFeed: computed(() => [..._messageFeed.value]),
        send: send,
        getMessageClass: getMessageClass,
        switchTopic: switchTopic,
        topicInputValue: topicInputValue, 
        topicClass: computed(getTopicClass)
    }
}