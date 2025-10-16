# Vue + ASP.NET WebSocket Messaging Example

This project demonstrates a **real-time messaging system** using Vue 3 on the frontend and an **ASP.NET Core console application** as a WebSocket server. The architecture is designed to show a clean separation of concerns using **composables** in Vue and a lightweight WebSocket backend.

---

## Project Structure

### Frontend (Vue 3)

- **Components**
  - `SocketMessenger.vue`: Displays the message queue and input field.
- **Composables**
  - `useSocketMessenger.js`: Handles WebSocket connection, message queue, and sending messages.

#### Features

- **Reactive message feed**: Messages from the client and server are tracked in a reactive array.
- **Input binding**: Input field is bound to a composable reactive variable; messages are sent via a parameter-less `send()` method.
- **Validation**: Incoming server messages are validated with `Zod` schema.
- **Connection management**: WebSocket connection is established on component mount and closed on unmount.

#### Example Usage in Component

```vue
<template>
  <div class="card">
    <h1>Message Queue</h1>
    <ul>
      <li v-for="(msg, i) in socketMessenger.messageFeed" :key="i">
        {{ msg.sender }}: {{ msg.message }}
      </li>
    </ul>

    <input v-model="socketMessenger.inputValue" @keyup.enter="socketMessenger.send" placeholder="Type a message" />
    <button @click="socketMessenger.send">Send</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const socketMessenger = inject("socketMessenger");
</script>
```
## Backend (ASP.NET Core Console App)

* WebSocket server running on ws://localhost:3001/ws.
* Accepts client connections, listens for messages, and sends responses back.


## Technologies Used

* Frontend

    * Vue 3 with <script setup> syntax

    * Composition API and composables

    * Zod for runtime message validation

* Backend

    * ASP.NET Core (console app)

    * WebSockets with AcceptWebSocketAsync

    * Optional controller or middleware-based endpoints

* Communication

    * WebSocket protocol (ws://localhost:3001/ws)

    * JSON message schema: { message: string }

# Setup Instructions

## Backend

1. Navigate to the backend project folder.
2. Run `dotnet run`.
3. Confirm it listens on `http://localhost:3001`.

## Frontend

1. Navigate to the Vue project folder.
2. Install dependencies:

```sh
npm install
# or
yarn
```

3. Start the development server:

```sh
npm run dev
```
