import { WebSocketServer } from "ws"
import { IntersectionModel } from "./db.js"

export const startWebSocket = ()=>{

const wss = new WebSocketServer({port:8080})

console.log("WebSocket running on 8080")

wss.on("connection",(socket)=>{

console.log("client connected")

const interval = setInterval(async()=>{

const intersections = await IntersectionModel.find()

socket.send(JSON.stringify(intersections))

},1000)

socket.on("close",()=>{
clearInterval(interval)
})

})

}