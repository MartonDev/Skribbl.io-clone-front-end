import React from 'react'

import Socket from '../game/Socket.js'

import '../styles/Players.css'

export default class Players extends React.Component {

  constructor () {

    super()

    this.state = {

      players: Socket.Game.players

    }

    Socket.io.on('playerJoin', this.onPlayerJoin.bind(this))
    Socket.io.on('playerLeave', this.onPlayerLeave.bind(this))

  }

  onPlayerJoin (playerName, playerID) {

    Socket.Game.players[playerID] = {

      name: playerName,
      points: 0

    }
    this.setState({ players: Socket.Game.players })

    console.log(`${playerName} joined. Players: `, Socket.Game.players);

  }

  onPlayerLeave (playerName, playerID) {

    delete Socket.Game.players[playerID]
    this.setState({ players: Socket.Game.players })

    console.log(`${playerName} left. Players: `, Socket.Game.players);

  }

  render () {

    let playersItems = Object.keys(this.state.players).map(key =>

      <li key={key}>

        <h1>{this.state.players[key].name}</h1>
        <h2>{this.state.players[key].points} points</h2>

      </li>

    )

    return (

      <div className="Players">

        <h1 className="title">Players</h1>

        <ul>

          {playersItems}

        </ul>

      </div>

    )

  }

}
