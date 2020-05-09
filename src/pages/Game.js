import React from 'react'

import { Redirect } from 'react-router-dom'

import Socket from '../game/Socket.js'

import '../styles/Game.css'

export default class Game extends React.Component {

  constructor () {

    super()

    if(Socket.Game === undefined)
      return

    console.log(Socket.Game)

  }

  render () {

    if(Socket.Game === undefined)
      return <Redirect to="/#" />

    return (

      <div className="Game">



      </div>

    )

  }

}
