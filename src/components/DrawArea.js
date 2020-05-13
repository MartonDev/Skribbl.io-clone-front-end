import React, { Component } from 'react'

import Socket from '../game/Socket.js'

import Button from './Button'
import { ChromePicker } from 'react-color'
import { Redirect } from 'react-router-dom'

import '../styles/DrawArea.css'

export default class DrawArea extends Component {

  constructor () {

    super()

    this.state = {

      isDrawing: false,
      prevPos: { offsetX: 0, offsetY: 0 },
      strokeStyle: '#000',
      tool: 'pencil',
      backgroundColor: '#fff',
      displayColorPicker: false,
      displayBackgroundColorPicker: false,
      word: '',
      isPlayerDrawing: false,
      round: Socket.Game.round,
      timeLeft: (Socket.Game.timeout / 1000),
      gameEnded: false

    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)
    this.reDrawOnCanvas = this.reDrawOnCanvas.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
    this.handleDrawingData = this.handleDrawingData.bind(this)

    Socket.io.on('drawWord', this.onWordChange.bind(this))
    Socket.io.on('currentDrawer', this.handleDrawerChange.bind(this))
    Socket.io.on('receiveDrawingData', this.handleDrawingData.bind(this))
    Socket.io.on('receiveBackgroundData', this.handleBackgroundColorData.bind(this))
    Socket.io.on('receiveRubber', this.handleRubber.bind(this))
    Socket.io.on('pointsUpdate', this.onPointsUpdate.bind(this))
    Socket.io.on('roundNumberChange', this.onRoundNumberChange.bind(this))
    Socket.io.on('endGame', this.onGameEnded.bind(this))
    Socket.io.on('wordTip', this.onWordTip.bind(this))

  }

  line = []
  lines = []
  drawerCanvasWidth = null

  handleDrawingData (drawingData, drawerWidth) {

    console.log('Receiving drawing data')

    this.lines = this.lines.concat([drawingData])
    this.line = []
    this.drawerCanvasWidth = drawerWidth

    let last = {x: null, y: null}

    for(let i = 0; i < drawingData.length; i++) {

      this.drawOnCanvas(drawingData[i].style, drawingData[i].stop.offsetX, drawingData[i].stop.offsetY, last.x === null ? drawingData[i].stop.offsetX : last.x, last.y === null ? drawingData[i].stop.offsetY : last.y)

      last = {

        x: drawingData[i].stop.offsetX,
        y: drawingData[i].stop.offsetY

      }

    }

  }

  handleBackgroundColorData (bgColor) {

    this.setState({ backgroundColor: bgColor })

  }

  handleRubber (offsetX, offsetY) {

    this.ctx.clearRect(offsetX - 4, offsetY - 4, 8, 8)

    for(let i = 0; i < this.lines.length; i++) {

      for(let j = 0; j < this.lines[i].length; j++) {

        if(this.lines[i][j] === undefined)
          continue

        if(this.lines[i][j].stop.offsetX > offsetX - 4 && this.lines[i][j].stop.offsetX < offsetX + 4 && this.lines[i][j].stop.offsetY > offsetY - 4 && this.lines[i][j].stop.offsetY < offsetY + 4)
          delete this.lines[i][j]

      }

    }

  }

  onWordTip (wordHelp) {

    this.setState({ word: wordHelp })

  }

  onRoundNumberChange (roundNumber) {

    this.setState({ round: roundNumber })
    Socket.Game.round = roundNumber
    this.setState({ isDrawing: false })

  }

  onWordChange (word) {

    this.setState({ word: word, timeLeft: (Socket.Game.timeout / 1000), backgroundColor: '#fff' })

    let count = Socket.Game.timeout / 1000,
    countDown = setInterval(() => {

      if(this.state.timeLeft === (Socket.Game.timeout / 1000) && count !== (Socket.Game.timeout / 1000)) {

        clearInterval(countDown)
        return

      }

      count--
      this.setState({ timeLeft: count })

      if(count === 0)
        clearInterval(countDown)

    }, 1000)

  }

  onPointsUpdate (playerID, currentPoints) {

    if(playerID === Socket.Game.playerData.id) {

      this.setState({ word: Socket.Game.lastChatMessage})

    }

  }

  handleDrawerChange (drawerID) {

    Socket.Game.currentDrawerID = drawerID
    this.setState({ isPlayerDrawing: false })
    this.clearCanvas()

    this.lines = []
    this.line = []

    if(drawerID === Socket.Game.playerData.id) {

      this.drawerCanvasWidth = null
      this.setState({ isPlayerDrawing: true })

    }

  }

  onMouseDown (e) {

    const { offsetX, offsetY } = e.nativeEvent
    this.setState({ isDrawing: true, prevPos: { offsetX, offsetY } })

  }

  onMouseMove (e) {

    if(!this.state.isDrawing)
      return

    if(!this.state.isPlayerDrawing)
      return

    const { offsetX, offsetY } = e.nativeEvent,
    offset = { offsetX, offsetY },
    pos = {

      start: { ...this.prevPos },
      stop: { ...offset }

    }

    if(this.state.tool === 'rubber') {

      this.ctx.clearRect(offsetX - 4, offsetY - 4, 8, 8)
      Socket.io.emit('rubber', offsetX, offsetY)

      for(let i = 0; i < this.lines.length; i++) {

        for(let j = 0; j < this.lines[i].length; j++) {

          if(this.lines[i][j] === undefined)
            continue

          if(this.lines[i][j].stop.offsetX > offsetX - 4 && this.lines[i][j].stop.offsetX < offsetX + 4 && this.lines[i][j].stop.offsetY > offsetY - 4 && this.lines[i][j].stop.offsetY < offsetY + 4) {

            delete this.lines[i][j]

          }

        }

      }

      return

    }

    const lineWithStyle = this.line.concat(pos)
    lineWithStyle.style = this.state.strokeStyle
    this.line = lineWithStyle

    this.draw(this.state.prevPos, offset, this.state.strokeStyle)

  }

  stopDrawing () {

    if(!this.state.isDrawing)
      return

    if(!this.state.isPlayerDrawing)
      return

    this.setState({ isDrawing: false })
    this.lines = this.lines.concat([this.line])
    this.sendCanvasData()
    this.line = []

  }

  draw (prevPos, currPos, strokeStyle) {

    const { offsetX, offsetY } = currPos,
    { offsetX: x, offsetY: y } = prevPos

    this.drawOnCanvas(strokeStyle, x, y, offsetX, offsetY)

    this.setState({ prevPos: { offsetX, offsetY } })
    this.sendCanvasData()

  }

  drawOnCanvas (strokeStyle, x, y, offsetX, offsetY) {

    this.ctx.beginPath()

    this.ctx.strokeStyle = strokeStyle

    if(!this.state.isPlayerDrawing && this.drawerCanvasWidth != null) {

      x = (x / this.drawerCanvasWidth * 100) * (this.canvas.width / 100)
      y = (y / this.drawerCanvasWidth * 100) * (this.canvas.width / 100)
      offsetX = (offsetX / this.drawerCanvasWidth * 100) * (this.canvas.width / 100)
      offsetY = (offsetY / this.drawerCanvasWidth * 100) * (this.canvas.width / 100)

    }

    this.ctx.moveTo(x, y)
    this.ctx.lineTo(offsetX, offsetY)
    this.ctx.stroke()

  }

  sendCanvasData () {

    if(!this.state.isPlayerDrawing)
      return

    for(let i = 0; i < this.line.length; i++) this.line[i].style = this.state.strokeStyle

    console.log('Sending drawing data...')
    Socket.io.emit('drawingData', this.line, this.canvas.width)

  }

  reDrawOnCanvas () {

    console.log('re-drawing')
    this.clearCanvas()

    this.canvas.width = this.drawArea.clientWidth - 20
    this.canvas.height = this.drawArea.clientWidth - 20

    for(let j = 0; j < this.lines.length; j++) {

      let last = {x: null, y: null}

      for(let i = 0; i < this.lines[j].length; i++) {

        if(this.lines[j][i] === undefined) {

          last = {x: null, y: null}
          continue

        }

        this.drawOnCanvas(this.lines[j].style, this.lines[j][i].stop.offsetX, this.lines[j][i].stop.offsetY, last.x === null ? this.lines[j][i].stop.offsetX : last.x, last.y === null ? this.lines[j][i].stop.offsetY : last.y)

        last = {

          x: this.lines[j][i].stop.offsetX,
          y: this.lines[j][i].stop.offsetY

        }

      }

    }

  }

  clearCanvas () {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

  }

  componentDidMount () {

    window.addEventListener('resize', this.reDrawOnCanvas)

    this.canvas.width = this.drawArea.clientWidth - 20
    this.canvas.height = this.drawArea.clientWidth - 20
    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
    this.ctx.lineWidth = 1

  }

  componentWillUnmount () {

    window.removeEventListener('resize', this.reDrawOnCanvas);

  }

  changeTool (e) {

    this.setState({ tool: e.target.name })

  }

  handlePencilColorPicker () {

    if(this.state.displayColorPicker)
      return

    this.setState({ displayColorPicker: true })

  }

  handleBackgroundColorPicker () {

    if(this.state.displayBackgroundColorPicker)
      return

    this.setState({ displayBackgroundColorPicker: true })

  }

  handleStrokeColorChange (color, e) {

    this.setState({ strokeStyle: color.hex })

  }

  handleBackgroundColorChange (color, e) {

    this.setState({ backgroundColor: color.hex })
    Socket.io.emit('backgroundColorChange', color.hex)

  }

  closePencilColorPicker () {

    this.setState({ displayColorPicker: false })

  }

  closeBgColorPicker () {

    this.setState({ displayBackgroundColorPicker: false })

  }

  onGameEnded () {

    this.setState({ gameEnded: true })

  }

  render () {

    if(this.state.gameEnded)
      return <Redirect to="/results" />

    return (

      <div className="DrawArea" ref={(ref) => (this.drawArea = ref)}>

        <h1 className="Word"><span className="Time">{this.state.timeLeft} : {Socket.Game.timeout / 1000}</span>{this.state.word}<span className="Round">Round { this.state.round } of { Socket.Game.rounds }</span></h1>

        <canvas ref={(ref) => (this.canvas = ref)} style={{ background: this.state.backgroundColor }} onMouseDown={this.onMouseDown} onMouseLeave={this.stopDrawing} onMouseUp={this.stopDrawing} onMouseMove={this.onMouseMove}></canvas>

        { this.state.isPlayerDrawing ?

          <div className="Tools">

            <Button name="pencil" click={this.changeTool.bind(this)} tool={this.state.tool}>Pencil</Button>
            <Button name="rubber" click={this.changeTool.bind(this)} tool={this.state.tool}>Ereaser</Button>
            <Button click={this.handlePencilColorPicker.bind(this)}>

              Pencil color
              <div className="ColorPickerPlaceholder">

                { this.state.displayColorPicker ? <div className="ColorPickerContainer"><div className="ColorPickerDismiss" onClick={this.closePencilColorPicker.bind(this)}></div><ChromePicker color={this.state.strokeStyle} onChangeComplete={this.handleStrokeColorChange.bind(this)} /></div> : null }

              </div>

            </Button>
            <Button click={this.handleBackgroundColorPicker.bind(this)}>

              Bg color
              <div className="ColorPickerPlaceholder">

                { this.state.displayBackgroundColorPicker ? <div className="ColorPickerContainer"><div className="ColorPickerDismiss" onClick={this.closeBgColorPicker.bind(this)}></div><ChromePicker color={this.state.backgroundColor} onChangeComplete={this.handleBackgroundColorChange.bind(this)} /></div> : null }

              </div>

            </Button>

          </div>

        : null }

      </div>

    )

  }

}
