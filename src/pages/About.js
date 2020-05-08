import React from "react"
import { Link } from "react-router-dom"

export default class About extends React.Component {

  constructor () {

    super()

    this.linkStyle = {

      color: '#ff0000'

    }

  }

  render () {

    return (

      <div>

        About page
        <br/>
        <Link to="/" style={this.linkStyle}>Home</Link>

      </div>

    )

  }

}
