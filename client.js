import io from 'socket.io-client'

// Use in deployed version
const socket = io('https://socket-server.sonnerberg.me')

// Use locally
// const socket = io.connect('http://localhost:8300')

const allMessages = document.getElementById('all-messages')
let nickname
let newMessage
let nicknameValue

const showMessageInput = () => {
  const inputs = document.getElementById('inputs')
  const labelMessage = document.createElement('label')
  labelMessage.setAttribute('for', 'new-message')
  labelMessage.textContent = 'Write new message:'
  const inputMessage = document.createElement('input')
  inputMessage.setAttribute('class', 'new-message')
  inputMessage.setAttribute('id', 'new-message')
  inputs.appendChild(labelMessage)
  inputs.appendChild(inputMessage)
  newMessage = document.getElementById('new-message')
  newMessage.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      if (20 >= nickname.value.length && 3 <= nickname.value.length) {
        const name = nickname.value
        const message = event.target.value
        socket.emit('chat message', {
          name,
          message,
        })
        addMessage('', name, message)
        event.target.value = ''
      }
    }
  })
}

const showNicknameInput = () => {
  const inputs = document.getElementById('inputs')
  const labelNickname = document.createElement('label')
  labelNickname.setAttribute('for', 'nickname')
  labelNickname.textContent = 'Nickname:'
  const inputNickname = document.createElement('input')
  inputNickname.setAttribute('class', 'new-message')
  inputNickname.setAttribute('id', 'nickname')
  inputNickname.setAttribute('minlength', '3')
  inputNickname.setAttribute('maxlength', '20')
  inputNickname.setAttribute('required', true)
  inputNickname.setAttribute('autofocus', true)
  inputs.appendChild(labelNickname)
  inputs.appendChild(inputNickname)
  nickname = document.getElementById('nickname')
  nickname.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      nicknameValue = event.target.value
      socket.emit('join room', { name: nicknameValue })
      labelNickname.remove()
      inputNickname.remove()
      showMessageInput()
      const inputMessage = document.getElementById('new-message')
      inputMessage.focus()
    }
  })
}

if (!nicknameValue) showNicknameInput()

const scrollToBottom = () => (allMessages.scrollTop = allMessages.scrollHeight)

const addMessage = (time, name, message) => {
  const addedMessage = document.createElement('p')

  addedMessage.textContent = `${time} ${name ? name : ''}: ${message}`

  allMessages.append(addedMessage)
  scrollToBottom()
}

socket.on('chat message', ({ time, name, message }) => {
  addMessage(time, name, message)
})

socket.on('disconnect', () => console.info('Disconnected!'))
