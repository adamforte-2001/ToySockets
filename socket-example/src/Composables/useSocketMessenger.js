import { ref, onMounted, onUnmounted, computed } from 'vue'
import { z } from 'zod';

//improvements omitted for example simplicity: 
//  2) connection retry functionality

const socketDataSchema = z.object({
  message: z.string()
})

/** @type {import('vue').Ref<{from:string, message:string}[]>} */
const _messageFeed = ref([]);
const socket = ref(null);
const inputValue = ref('');
const connectionState = ref(WebSocket.CLOSED);
const env = import.meta.env;

function _send(msg){
  if (!(connectionState.value == WebSocket.OPEN)) {
    console.error("Error: socket connection is not open. Cannot send a message");
    return;
  }
  else {
    socket.value.send(msg)
    _messageFeed.value.push(
      {
        from: "client",
        message: msg
      }
    );
    inputValue.value = "";
  }
}

function send(){
  _send(inputValue.value);
}

//private
function handleData(data){
  let message;
  try {
    ({message} = socketDataSchema.parse(JSON.parse(data)));
  } catch(error) {
    if (error instanceof z.ZodError){
      console.error(error, "Unexpected data shape in message from socket");
    }
    else {
      console.error(error, "Unexpected error while handling socket message");
    }
    return;
  }
  _messageFeed.value.push(
    {
      from: "server",
      message: message
    }
  );
}

function retry() {
  //not implemented
}

export default function useSocketMessenger() {
  onMounted(()=>{
    const url = `wss://${env.VITE_API_SERVER}:${env.VITE_API_PORT}${env.VITE_API_ENDPOINT_SOCKET}`
    console.log(url);
    socket.value = new WebSocket(url);
    console.log(socket.value.readyState)
    socket.value.addEventListener("close", (message) => {
      console.log("Connection closed");
      connectionState.value = WebSocket.CLOSED;
    }); //consider adding retry functionality
    socket.value.addEventListener("open", () => {
      console.log("Connection Open");
      connectionState.value = WebSocket.OPEN;
    });

    socket.value.addEventListener("message", (e) => handleData(e.data));
  });

  onUnmounted(()=>{
    if (connectionState.value == WebSocket.OPEN){
      socket.value.close(1000, "Done with connection");
    }
  });
  
  /**
     * @returns {{
     *   send: () => void
     *   inputValue: import('vue').Ref<string>,
     *   messageFeed: import('vue').ComputedRef<{from:string, message:string}[]>,
     *   connectionState: import('vue').Ref<
     *    {0 | 1 | 2 | 3} 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
     *   >
     * }}
     */
  return {
    messageFeed: computed(() => [..._messageFeed.value]),
    send: send,
    inputValue: inputValue,
    connectionState: connectionState
  }
}
