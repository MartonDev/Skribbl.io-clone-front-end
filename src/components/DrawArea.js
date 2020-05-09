import React, { Component } from 'react'

import Socket from '../game/Socket.js'

import Button from './Button'
import { ChromePicker } from 'react-color'

import '../styles/DrawArea.css'

export default class DrawArea extends Component {

  constructor () {

    super()

    this.state = {

      isDrawing: false,
      prevPos: { offsetX: 0, offsetY: 0 },
      line: [],
      lines: [],
      strokeStyle: '#000',
      tool: 'pencil',
      backgroundColor: '#fff',
      displayColorPicker: false,
      displayBackgroundColorPicker: false

    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)
    this.handleResize = this.handleResize.bind(this)

  }

  onMouseDown (e) {

    const { offsetX, offsetY } = e.nativeEvent
    this.setState({ isDrawing: true, prevPos: { offsetX, offsetY } })

  }

  onMouseMove (e) {

    if(!this.state.isDrawing)
      return

    const { offsetX, offsetY } = e.nativeEvent,
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
    this.ctx.lineWidth = 1

  }

  componentWillUnmount () {

    window.removeEventListener('resize', this.handleResize);

  }

  changeTool (e) {

    this.setState({ tool: e.target.name })

  }

  handlePencilColorPicker () {

    this.setState({ displayColorPicker: !this.state.displayColorPicker })

  }

  handleBackgroundColorPicker () {

    this.setState({ displayBackgroundColorPicker: !this.state.displayBackgroundColorPicker })

  }

  handleStrokeColorChange (color, e) {

    this.setState({ strokeStyle: color.hex })

  }

  handleBackgroundColorChange (color, e) {

    this.setState({ backgroundColor: color.hex })

  }

  render () {

    return (

      <div className="DrawArea" ref={(ref) => (this.drawArea = ref)}>

        <h1 className="Word">Word</h1>

        <canvas ref={(ref) => (this.canvas = ref)} style={{ background: this.state.backgroundColor }} onMouseDown={this.onMouseDown} onMouseLeave={this.stopDrawing} onMouseUp={this.stopDrawing} onMouseMove={this.onMouseMove}></canvas>

        <div className="Tools">

          <Button name="pencil" click={this.changeTool.bind(this)} tool={this.state.tool}>Pencil</Button>
          <Button name="rubber" click={this.changeTool.bind(this)} tool={this.state.tool}>Rubber</Button>
          <Button click={this.handlePencilColorPicker.bind(this)}>Pencil color</Button>
          <Button click={this.handleBackgroundColorPicker.bind(this)}>Bg color</Button>

          <div>

            <div style={{margin: '0 auto', display: 'inline-block'}}>

              { this.state.displayColorPicker ? <ChromePicker color={this.state.strokeStyle} onChangeComplete={this.handleStrokeColorChange.bind(this)} /> : null }
              { this.state.displayBackgroundColorPicker ? <ChromePicker color={this.state.backgroundColor} onChangeComplete={this.handleBackgroundColorChange.bind(this)} /> : null }

            </div>

          </div>

        </div>

      </div>

    )

  }

}
