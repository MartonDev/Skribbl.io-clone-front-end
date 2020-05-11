import React, { Component } from 'react'

import { Redirect } from 'react-router-dom'
import Players from '../components/Players'

import Socket from '../game/Socket.js'

import '../styles/Results.css'

export default class Results extends Component {

  constructor () {

    super()
    this.state = {

      name: '',
      gameCode: '',
      redirectToWaiting: false

    }

  }

  render () {

    if(Socket.Game === undefined)
      return <Redirect to="/#" />

    return (

      <div className="Home">

        <h1 className="title">Results</h1>

        <Players endGame></Players>

      </div>

    )

  }

}
