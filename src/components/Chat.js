import React from 'react'

import Socket from '../game/Socket.js'

import '../styles/Chat.css'

export default class Chat extends React.Component {

  constructor () {

    super()

    this.state = {

      messages: [],
      msg: ''

    }

    Socket.io.on('messageReceive', this.onMessageReceive.bind(this))

  }

  onMessageReceive (name, message) {

    this.setState({ messages: [...this.state.messages, { name: name, message: message }] })
    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
    console.log(this.state.messages)

  }

  handleChange (e) {

    this.setState({ [e.target.name]: e.target.value })

  }

  sendMessage (e) {

    if(e.key !== 'Enter')
      return

    Socket.io.emit('sendMessage', this.state.msg)
    this.setState({ msg: '' })

  }

  render () {

    let chatMessages = this.state.messages.map((message, index) =>

      <li key={index}>

        {message.name}: {message.message}

      </li>

    )

    return (

      <div className="Chat">

        <ul>

          {chatMessages}
          <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el }}></div>

        </ul>

        <input name="msg" value={this.state.msg} onChange={this.handleChange.bind(this)} onKeyDown={this.sendMessage.bind(this)} type="text" className="MessageBox" placeholder="Press enter to send your message..." />

      </div>

    )

  }

}