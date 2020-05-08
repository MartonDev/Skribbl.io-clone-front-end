import React from 'react'

import Socket from '../game/Socket.js'

import '../styles/Game.css'

export default class Game extends React.Component {

  constructor () {

    super()
    console.log(Socket.Game)

  }

  render () {

    return (

      <div className="Game">



      </div>

    )

  }

}
