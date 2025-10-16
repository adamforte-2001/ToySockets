import { ref, onMounted, onUnmounted, computed } from 'vue'
import { z } from 'zod';

//improvements omitted for example simplicity: 
//  1) an isOpen reference bool that could be used in the UI to inform the user of connection state 
//  2) connection retry functionality

const socketDataSchema = z.object({
  message: z.string()
})
const _messageFeed = ref([]);
const socket = ref(null);
const inputValue = ref('');

function _send(msg){
  if (!(socket?.value.readyState == WebSocket.OPEN)) {
    console.error("Error: socket connection is not open. Cannot send a message");
    return;
  }
  else {
    socket.value.send(msg)
    _messageFeed.value.push(
      {
        sender: "client",
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
        sender: "server",
        message: message
      }
    );
}

function retry() {
  //not implemented
}

export function useSocketMessenger() {
  
  onMounted(()=>{
    socket.value = new WebSocket('ws://localhost:3001/ws');
    socket.value.addEventListener("close", () => {console.log("Connection closed")}); //consider adding retry functionality
    socket.value.addEventListener("message", (e) => handleData(e.data));
  });

  onUnmounted(()=>{
    if (socket?.value.readyState == WebSocket.OPEN){
      socket.value.close(1000, "Done with connection");
    }
  });
  return {
    messageFeed: computed(() => [..._messageFeed.value]),
    send: send,
    inputValue: inputValue
  }
}
