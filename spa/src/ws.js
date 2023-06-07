import _ from 'lodash'
const port = 7779
class WS {
  constructor(endPoint, handleMessage) {
    this.ep = endPoint
    this.cb = handleMessage
    this.recnn = null
    this.stopped = false
    this.init()
  }
  init() {
    this.connected = false;
    this.ws = new WebSocket(this.ws_uri());
    _.bindAll(this, ['on_message', 'on_close', 'on_error', 'on_open', 'send', 'close'])
    this.ws.onmessage = this.on_message;
    this.ws.onclose = this.on_close;
    this.ws.onerror = this.on_error;
    this.ws.onopen = this.on_open;
  }

  on_message(evt) {
    try {
      this.cb(evt.data)
      // console.log(evt.data);
    } catch (err) {
      console.log(err, evt.data)
    }
  }
  close(){
    this.stopped = true
    this.ws.close()
  }
  on_error(err) {
    console.log('ws onerror: ', err)
  }
  on_close() {
    console.log('ws onclose')
    this.connected = false
    if(this.stopped) return
    this.recnn = setTimeout(this.init.bind(this), 1000)
  }
  on_open() {
    clearTimeout(this.recnn)
    this.connected = true
    console.log("ws connected to the server");
  }

  send(data) {
    if (!this.connected) {
      return setTimeout(this.send, 1000, data);
    }
    this.ws.send(data);
  }
  ws_uri() {
    let loc = window.location, ws_uri, h = loc.host;
    if (loc.protocol === "https:") {
      ws_uri = "wss:";
    } else if (loc.protocol === "http:") {
      ws_uri = "ws:";
    } else {
      ws_uri = "ws:";
      h = `localhost:${port}`;
    }
    if (import.meta.env.DEV) {
      h = `127.0.0.1:${port}`;
      // console.log(`[ws_uri] app is running in development mode`)
    } else {
      // console.log(`[ws_uri] app is running in production mode`)
    }
    ws_uri += "//" + h + this.ep;
    // console.log(ws_uri)
    return ws_uri;
  }
}
export default WS;