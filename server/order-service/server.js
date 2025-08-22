const app = require("./app.js");
require("dotenv").config();
const http = require("http");
const { initSocket } = require("./socket");
// const {Server} = require("socket.io");

const server = http.createServer(app);
const io = initSocket(server);

// const io = new Server(server, {
//     cors: {
//         origin: [
//             "http://localhost:5000",
//             "http://localhost:5001",
//             "http://localhost:5002",
//             "http://localhost:5003",
//             "http://localhost:3001",
//             "http://localhost:3002",
//             "http://localhost:3003",
//             "http://localhost:3004"
//         ],
//         methods: ["GET", "POST"]
//     }
// });
// console.log("io in server", io);


// io.on("connection", (socket) => {
//     console.log("A user is connected ", socket.id);
//     socket.on("joinOrderRoom", (orderId) => {
//         socket.join(`order_${orderId}`);
//         console.log(`User joined room order_${orderId}`);
//     })

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// })



const PORT = process.env.PORT || 3004

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

