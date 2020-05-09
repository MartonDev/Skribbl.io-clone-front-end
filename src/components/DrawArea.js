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
      lines: [],
      strokeStyle: '#000'

    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)
    this.handleResize = this.handleResize.bind(this)

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

    },
    lineWithStyle = this.state.line.concat(pos)

    for(let i = 0; i < lineWithStyle.length; i++) {

      lineWithStyle[i].style = this.state.strokeStyle

    }

    this.setState({ line: lineWithStyle })
    this.draw(this.state.prevPos, offset, this.state.strokeStyle)

  }

  stopDrawing () {

    if(!this.state.isDrawing)
      return

    this.setState({ isDrawing: false, lines: this.state.lines.concat([this.state.line]) })
    this.sendCanvasData()
    this.setState({ line: [] })

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

    this.ctx.moveTo(x, y)
    this.ctx.lineTo(offsetX, offsetY)
    this.ctx.stroke()

  }

  async sendCanvasData () {

    //TODO: send all painting data
    console.log('Sending drawing data...')

  }

  handleResize (e) {

    this.canvas.width = this.drawArea.clientWidth - 20
    this.canvas.height = this.drawArea.clientWidth - 20

    for(let j = 0; j < this.state.lines.length; j++) {

      let last = {x: null, y: null}

      for(let i = 0; i < this.state.lines[j].length; i++) {

        this.drawOnCanvas(this.state.lines[j][i].style, this.state.lines[j][i].stop.offsetX, this.state.lines[j][i].stop.offsetY, last.x === null ? this.state.lines[j][i].stop.offsetX : last.x, last.y === null ? this.state.lines[j][i].stop.offsetY : last.y)

        last = {

          x: this.state.lines[j][i].stop.offsetX,
          y: this.state.lines[j][i].stop.offsetY

        }

      }

    }

  }

  componentDidMount () {

    window.addEventListener('resize', this.handleResize)

    this.canvas.width = this.drawArea.clientWidth - 20
    this.canvas.height = this.drawArea.clientWidth - 20
    this.ctx = this.canvas.getContext('2d')
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
    this.ctx.lineWidth = 5

  }

  componentWillUnmount () {

    window.removeEventListener('resize', this.handleResize);

  }

  render () {

    return (

      <div className="DrawArea" ref={(ref) => (this.drawArea = ref)}>

        <canvas ref={(ref) => (this.canvas = ref)} style={{ background: 'white' }} onMouseDown={this.onMouseDown} onMouseLeave={this.stopDrawing} onMouseUp={this.stopDrawing} onMouseMove={this.onMouseMove}></canvas>

      </div>

    )

  }

}
