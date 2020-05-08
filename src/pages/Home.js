import React from 'react'

import Button from '../components/Button'

import '../styles/Home.css'

export default class Home extends React.Component {

  constructor () {

    super()
    this.state = {

      gameCode: ''

    }

  }

  changeGameCode (e) {

    this.setState({ gameCode: e.target.value })

  }

  joinGame (e) {

    console.log(this.state.gameCode)

  }

  createRoom (e) {

    console.log('createRoom')

  }

  render () {

    return (

      <div className="Home">

        <h1 className="title">Welcome!</h1>
        <h2 className="subtitle">Enter a code or create a new game!</h2>

        <input type="text" placeholder="Game code..." value={this.state.title} onChange={this.changeGameCode.bind(this)} />
        
        <Button click={this.joinGame.bind(this)}>Join game!</Button>
        <Button click={this.createRoom.bind(this)}>Create room!</Button>

      </div>

    )

  }

}
