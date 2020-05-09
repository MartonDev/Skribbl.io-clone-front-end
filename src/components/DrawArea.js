import React, { Component } from 'react'

import Socket from '../game/Socket.js'

import '../styles/DrawArea.css'

export default class DrawArea extends Component {

  constructor () {

    super()

    this.state = {

      isDrawing: false,
      prevPos: { offsetX: 0, offsetY: 0 },
      line: [],
      strokeStyle: '#000'

    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)

  }

  onMouseDown (el) {

    const { offsetX, offsetY } = el.nativeEvent
    this.setState({ isDrawing: true, prevPos: { offsetX, offsetY } })

  }

  onMouseMove (el) {

    if(!this.state.isDrawing)
      return

    const { offsetX, offsetY } = el.nativeEvent,
    offset = { offsetX, offsetY },
    pos = {

      start: { ...this.prevPos },
      stop: { ...offset }

    }

    this.setState({ line: this.state.line.concat(pos) })
    this.draw(this.state.prevPos, offset, this.state.strokeStyle)

  }

  stopDrawing () {

    if(!this.state.isDrawing)
      return

    this.setState({ isDrawing: false })
    this.sendCanvasData()
    this.setState({ line: [] })

  }

  draw (prevPos, currPos, strokeStyle) {

    const { offsetX, offsetY } = currPos,
    { offsetX: x, offsetY: y } = prevPos

    this.ctx.beginPath()

    this.ctx.strokeStyle = strokeStyle

    this.ctx.moveTo(x, y)
    this.ctx.lineTo(offsetX, offsetY)
    this.ctx.stroke()

    this.setState({ prevPos: { offsetX, offsetY } })
    this.sendCanvasData()

  }

  async sendCanvasData () {

    //TODO: send all painting data
    console.log('Sending drawing data...')

  }

  componentDidMount () {

    this.canvas.width = this.drawArea.clientWidth - 20
    this.canvas.height = this.drawArea.clientWidth - 20
    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
    this.ctx.lineWidth = 5

  }

  render () {

    return (

      <div className="DrawArea" ref={(ref) => (this.drawArea = ref)}>

        <canvas ref={(ref) => (this.canvas = ref)} style={{ background: 'white' }} onMouseDown={this.onMouseDown} onMouseLeave={this.stopDrawing} onMouseUp={this.stopDrawing} onMouseMove={this.onMouseMove}></canvas>

      </div>

    )

  }

}
