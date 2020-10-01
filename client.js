import io from 'socket.io-client'

// Use in deployed version
const socket = io('https://socket-server.sonnerberg.me')

// Use locally
// const socket = io('http://localhost:8300')

const newMessage = document.getElementById('new-message')
const allMessages = document.getElementById('all-messages')
const nickname = document.getElementById('nickname')

const scrollToBottom = () => (allMessages.scrollTop = allMessages.scrollHeight)

socket.on('connect', () => {
  console.info('Connected!')
  socket.on('chat message', ({ time, name, message }) => {
    const addedMessage = document.createElement('p')

    addedMessage.textContent = `${time} ${name ? name : ''}: ${message}`

    allMessages.append(addedMessage)
    scrollToBottom()
  })

  newMessage.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      if (20 >= nickname.value.length && 3 <= nickname.value.length) {
        socket.emit('chat message', {
          name: nickname.value,
          message: event.target.value,
        })
        event.target.value = ''
      }
    }
  })
})

socket.on('disconnect', () => console.info('Disconnected!'))
