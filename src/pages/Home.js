import React from 'react'

import Button from '../components/Button'
import { Redirect } from 'react-router-dom'

import Socket from '../game/Socket.js'

import '../styles/Home.css'

export default class Home extends React.Component {

  constructor () {

    super()
    this.state = {

      name: '',
      gameCode: '',
      redirectToWaiting: false

    }

  }

  handleChange (e) {

    this.setState({ [e.target.name]: e.target.value })

  }

  joinGame (e) {

    Socket.io.emit('joinGame', this.state.name, this.state.gameCode, (success, players, status, playerID) => {

      if(!success)
        return

      console.log('Joined game. Players:', players, 'Game status:', status, 'PlayerID:', playerID)

      Socket.Game = {

        code: this.state.gameCode,
        status: status,
        playerData: { id: playerID, name: this.state.name, gameCode: this.state.gameCode, points: 0 }

      }

      this.setState({ redirectToWaiting: true })

    })

  }

  createRoom (e) {

    console.log('createRoom')

  }

  render () {

    if(this.state.redirectToWaiting)
      return <Redirect to="/waiting" />

    return (

      <div className="Home">

        <h1 className="title">Welcome!</h1>
        <h2 className="subtitle">Enter a code or create a new game!</h2>

        <input type="text" placeholder="Nickname..." name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />
        <input type="text" placeholder="Game code..." name="gameCode" value={this.state.gameCode} onChange={this.handleChange.bind(this)} />

        <Button click={this.joinGame.bind(this)}>Join game!</Button>

        <br/>

        <input type="text" placeholder="Nickname..." name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />

        <Button click={this.createRoom.bind(this)}>Create room!</Button>

      </div>

    )

  }

}
