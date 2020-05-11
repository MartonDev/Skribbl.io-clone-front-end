import React, { Component } from 'react'

import Chat from '../components/Chat'
import Players from '../components/Players'
import WordsContainer from '../components/WordsContainer'
import { Redirect } from 'react-router-dom'

import Socket from '../game/Socket.js'

import '../styles/Waiting.css'

export default class Waiting extends Component {

  constructor () {

    super()

    if(Socket.Game === undefined)
      return

    console.log(Socket.Game)

    this.state = { status: Socket.Game.status }

    Socket.io.on('startGame', this.onStartGame.bind(this))

  }

  onStartGame (rounds, timeout) {

    if(Socket.Game.status === 'running')
      return

    Socket.Game.round = 1
    Socket.Game.rounds = rounds
    Socket.Game.timeout = timeout
    Socket.Game.status = 'running'
    this.setState({ status: 'running' })
    console.log('Starting game')

  }

  render () {

    if(Socket.Game === undefined)
      return <Redirect to="/#" />

    if(this.state.status === 'running')
      return <Redirect to="/game" />

    return (

      <div className="Waiting">

        <Players></Players>
        <WordsContainer></WordsContainer>
        <Chat></Chat>

      </div>

    )

  }

}
