import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import socketIOClient from 'socket.io-client'

import Socket from './game/Socket.js'

import Home from './pages/Home'
import Waiting from './pages/Waiting'
import Game from './pages/Game'
import Results from './pages/Results'

import './styles/App.css'

const ENDPOINT = 'http://127.0.0.1:8000',
socket = socketIOClient(ENDPOINT)

Socket.io = socket

ReactDOM.render(

  <Router>

    <div>

      <Switch>

        <Route path="/" exact component={ Home } />

        <Route path="/waiting" component={ Waiting } />
        <Route path="/game" component={ Game } />
        <Route path="/results" component={ Results } />

      </Switch>

    </div>

  </Router>,

  document.getElementById('app')

)
