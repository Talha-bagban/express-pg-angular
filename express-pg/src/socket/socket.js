import { Server } from "socket.io";


let io;

export const intializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:4300",
        },
    });
        
    io.on("connection", (socket) => { // connection is required because Socket.IO uses the connection event when a client connects.
        console.log("Socket connected:", socket.id, "transport:", socket.conn.transport.name);

        socket.on("join", (userId) => { // Backend receives from front-end Event, join, Data, userId
            socket.join(userId); // Creates room for this userId
            console.log(`User ${userId} joined room`);
        });

        socket.on("disconnect", (reason) => { // Runs when Browser closed, Internet lost, Logout
            console.log("Socket disconnected:", socket.id, reason);
        });
    });
}

export { io };



