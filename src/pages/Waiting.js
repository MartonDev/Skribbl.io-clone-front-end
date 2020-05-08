import React from 'react'

import Button from '../components/Button'
import Chat from '../components/Chat'
import { Redirect } from 'react-router-dom'

import Socket from '../game/Socket.js'

import '../styles/Waiting.css'

export default class Waiting extends React.Component {

  constructor () {

    super()
    console.log(Socket.Game)

    this.state = { status: Socket.Game.status }

    Socket.io.on('playerJoin', this.onPlayerJoin.bind(this))
    Socket.io.on('playerLeave', this.onPlayerLeave.bind(this))
    Socket.io.on('startGame', this.onStartGame.bind(this))

  }

  startGame () {

    Socket.io.emit('startGame')

  }

  onPlayerJoin (playerName, playerID) {

    if(Socket.Game.status === 'running')
      return

    Socket.Game.players[playerID] = {

      name: playerName,
      points: 0

    }

    console.log(`${playerName} joined. Players: `, Socket.Game.players);

  }

  onPlayerLeave (playerName, playerID) {

    if(Socket.Game.status === 'running')
      return

    delete Socket.Game.players[playerID]

    console.log(`${playerName} left. Players: `, Socket.Game.players);

  }

  onStartGame () {

    if(Socket.Game.status === 'running')
      return

    Socket.Game.status = 'running'
    this.setState({ status: 'running' })
    console.log('Starting game')

  }

  render () {

    if(this.state.status === 'running')
      return <Redirect to="/game" />

    return (

      <div className="Waiting">

        <Button name="startGame" click={this.startGame.bind(this)}>Start game!</Button>
        <Chat></Chat>

      </div>

    )

  }

}
