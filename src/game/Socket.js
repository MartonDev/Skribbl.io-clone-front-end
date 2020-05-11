export default class Socket {

  io = null
  Game = {

    code: '',
    status: '',
    players: {},
    playerData: {},
    currentDrawerID: '',
    round: 0,
    rounds: 0,
    timeout: 0,
    lastChatMessage: ''

  }

}
