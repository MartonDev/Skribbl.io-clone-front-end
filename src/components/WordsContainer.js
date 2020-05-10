import React, { Component } from 'react'

import Button from '../components/Button'

import Socket from '../game/Socket.js'

import '../styles/WordsContainer.css'

export default class WordsContainer extends Component {

  constructor () {

    super()

    this.state = {

      wordsCount: Socket.Game.wordsCount,
      addWord: ''

    }

    Socket.io.on('wordAdded', this.onWordAdded.bind(this))

  }

  handleChange (e) {

    this.setState({ [e.target.name]: e.target.value })

  }

  onWordAdded (count) {

    this.setState({ wordsCount: count })
    Socket.Game.wordsCount = count

  }

  startGame () {

    Socket.io.emit('startGame')

  }

  addNewWord () {

    Socket.io.emit('addWord', this.state.addWord.split('\n'))
    this.setState({ addWord: '' })

  }

  render () {

    return (

      <div className="WordsContainer">

        <h1 className="title">Words ({this.state.wordsCount})</h1>

        <textarea placeholder="Enter new words (one each line)..." name="addWord" value={this.state.addWord} onChange={this.handleChange.bind(this)}></textarea>

        <h1 className="title">Game code: <i>{Socket.Game.code}</i></h1>

        <Button name="addNewWord" click={this.addNewWord.bind(this)}>Add words!</Button>
        <Button name="startGame" click={this.startGame.bind(this)}>Start game!</Button>

      </div>

    )

  }

}
