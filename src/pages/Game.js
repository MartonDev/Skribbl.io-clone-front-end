import React, { Component } from 'react'

import Chat from '../components/Chat'
import Players from '../components/Players'
import DrawArea from '../components/DrawArea'
import { Redirect } from 'react-router-dom'

import Socket from '../game/Socket.js'

import '../styles/Game.css'

export default class Game extends Component {

  constructor () {

    super()

    if(Socket.Game === undefined)
      return

  }

  render () {

    if(Socket.Game === undefined)
      return <Redirect to="/#" />

    return (

      <div className="Game">

        <Players></Players>
        <DrawArea></DrawArea>
        <Chat></Chat>

      </div>

    )

  }

}
