const mongoose = require('mongoose');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express()

const httpServer = createServer(app);

const PORT = process.env.PORT || 5000

const io = new Server(httpServer, { 
    cors: {
        origin: "*"
    }
});

async function startApp() {
    try {
        await mongoose.connect('mongodb+srv://admin:JavaScript2001@cluster0.rqn8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {})
        httpServer.listen(PORT, () => {
            console.log('Working...');
        })        
    } 
    catch (error) {
        console.log(error);
    }
}

module.exports = {startApp, app, io}