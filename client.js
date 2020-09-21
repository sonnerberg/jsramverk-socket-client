import io from 'socket.io-client'

const socket = io('http://localhost:3000')

const newMessage = document.getElementById('new-message')
const allMessages = document.getElementById('all-messages')

socket.on('connect', () => {
  socket.on('chat message', (message) => {
    const addedMessage = document.createElement('p')

    addedMessage.textContent = message

    allMessages.append(addedMessage)
  })

  newMessage.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      socket.emit('chat message', event.target.value)
      event.target.value = ''
    }
  })
})

socket.on('disconnect', () => console.info('Disconnected!'))
