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
  // <label for='new-message'><strong>Write new message:</strong></label>
  // <input id="new-message" class="new-message" value="" />
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
        socket.emit('chat message', {
          name: nickname.value,
          message: event.target.value,
        })
        event.target.value = ''
      }
    }
  })
}

const showNicknameInput = () => {
  const inputs = document.getElementById('inputs')
  // <label for='nickname'><strong>Nickname:</strong></label>
  // <input id="nickname" class="new-message" value="" minlength="3"
  //     maxlength="20" required />
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

socket.on('chat message', ({ time, name, message }) => {
  const addedMessage = document.createElement('p')

  addedMessage.textContent = `${time} ${name ? name : ''}: ${message}`

  allMessages.append(addedMessage)
  scrollToBottom()
})

socket.on('disconnect', () => console.info('Disconnected!'))
