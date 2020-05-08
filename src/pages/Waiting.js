import React from 'react'

import Socket from '../game/Socket.js'

import '../styles/Waiting.css'

export default class Waiting extends React.Component {

  constructor () {

    super()
    console.log(Socket.Game)

    Socket.io.on('playerJoin', (playerName, playerID) => {

      Socket.Game.players[playerID] = {

        name: playerName,
        points: 0

      }

      console.log('Player joined. Players: ', Socket.Game.players);

    })

  }

  render () {

    return (

      <div className="Waiting">



      </div>

    )

  }

}
