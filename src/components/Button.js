import React from 'react'

import '../styles/Button.css'

export default class Button extends React.Component {

  click (e) {

    if(!this.props.click)
      return

    this.props.click(e)

  }

  render () {

    return (

      <button onClick={this.click.bind(this)} name={this.props.name} className="Button">

        {this.props.children}

      </button>

    )

  }

}
