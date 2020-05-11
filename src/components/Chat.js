import React, { Component } from 'react'

import Socket from '../game/Socket.js'

import '../styles/Chat.css'

export default class Chat extends Component {

  constructor () {

    super()

    this.state = {

      messages: [],
      msg: ''

    }

  }

  componentDidMount () {

    Socket.io.on('messageReceive', this.onMessageReceive.bind(this))

  }

  componentWillUnmount () {

    Socket.io.removeAllListeners('messageReceive')

  }

  onMessageReceive (name, message) {

    this.setState({ messages: [...this.state.messages, { name: name, message: message }] })
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    console.log(this.state.messages)

  }

  handleChange (e) {

    this.setState({ [e.target.name]: e.target.value })

  }

  sendMessage (e) {

    if(e.key !== 'Enter')
      return

    Socket.io.emit('sendMessage', this.state.msg)
    Socket.Game.lastChatMessage = this.state.msg
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
          <div ref={(el) => this.messagesEnd = el}></div>

        </ul>

        <input name="msg" value={this.state.msg} onChange={this.handleChange.bind(this)} onKeyDown={this.sendMessage.bind(this)} type="text" className="MessageBox" placeholder="Press enter to send your message..." />

      </div>

    )

  }

}
