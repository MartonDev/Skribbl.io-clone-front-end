import React, { Component } from 'react'

import Socket from '../game/Socket.js'

import '../styles/Players.css'

export default class Players extends Component {

  constructor () {

    super()

    this.state = {

      players: Socket.Game.players

    }

  }

  componentDidMount () {

    if(this.props.endGame) {

      //TODO: fix this, it overrides this.state.players with sorted KEYs, but no values
      Object.keys(this.state.players).sort((a, b) => {

        return this.state.players[a].points - this.state.players[b].points

      })

      return

    }

    Socket.io.on('playerJoin', this.onPlayerJoin.bind(this))
    Socket.io.on('playerLeave', this.onPlayerLeave.bind(this))
    Socket.io.on('pointsUpdate', this.onPointsUpdate.bind(this))

  }

  componentWillUnmount () {

    Socket.io.removeAllListeners('playerJoin')
    Socket.io.removeAllListeners('playerLeave')
    Socket.io.removeAllListeners('pointsUpdate')

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

  onPointsUpdate (playerID, currentPoints) {

    Socket.Game.players[playerID].points = currentPoints
    this.setState({ players: Socket.Game.players })

  }

  render () {

    let playersItems = Object.keys(this.state.players).map(key =>

      <li key={key}>

        <h1>{this.state.players[key].name} {key === Socket.Game.playerData.id ? '(You)' : null}</h1>
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
