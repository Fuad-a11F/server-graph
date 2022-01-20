const express = require("express");

const Graph = require('./model/graph')
const Users = require('./model/user')
const Rooms = require('./model/room')
const { startApp, app, io } = require("./startApp");

app.use(express.json())

let understand = 0

let temp = {}

let start = true

// app.get('/', async (req,res) => {
//     let s = await Users.find({_id: '61e849ab56bd09cdc1965ce2'})
//     let k = await Rooms.find({room: '123'})

//     // if (k.length > 0) {
//     //     let gg = await Rooms.updateOne({room: '123'}, {$push: {user: '61e849ab56bd09cdc1965ce2'}})
//     //     console.log(gg);
//     // }

//     console.log(k);
//     res.json(k)
// })

app.put('/api/start/', (req, res) => {
    start = true
    res.send('ok')
})

app.put('/api/finish/', (req, res) => {
    start = false
    res.send('ok')
})

// async function SaveUserInDataBase(room) {
//     let findRoom = await Rooms.find({room})

//     if (findRoom.length != 0) {

//     }

//     else {

//     }


//     return new Promise((resolve, reject) => {
//         setTimeout(() => resolve(console.log('3')), 2000)
//     })
// }

io.on('connection',  (socket) => {
    socket.on('connected', async (room) => {
        socket.join(room)

        // await SaveUserInDataBase(room.room)

        if (Array.isArray(temp[room.room])) {
            temp[room.room].push({[socket.id]: {
                vote: null,
            }})
        }
        
        else {
            temp[room.room] = [
                {
                    [socket.id]: {
                        vote: null,
                    }
                }
            ]
        }

        setInterval(() => {    
            try {
                
                socket.emit('online', Object.keys(temp[room.room]).length)
            } catch (error) {
                
            }   
        }, 1000)

        setInterval(async () => {
            if (start) {
                let graph = new Graph({
                    y: (Math.round((understand / Object.keys(temp).length) * 100)).toString()
                })
                await graph.save()
                
                socket.emit('percent', Math.round((understand / Object.keys(temp).length) * 100))
            }
        }, 2000)
    }) 

    socket.on('plus', (room) => {
        let index = temp[room].findIndex((el) => el.hasOwnProperty(socket.id))

        if (!temp[room][index][socket.id].vote) {
            temp[room][index][socket.id].vote = true
            understand++
        }
    }) 

    socket.on('minus', (room) => {
        let index = temp[room].findIndex((el) => el.hasOwnProperty(socket.id))
        
        if (temp[room][index][socket.id].vote) {
            understand--
            temp[room][index][socket.id].vote = false
        }

        else if (temp[room][index][socket.id].vote == null) {
            temp[room][index][socket.id].vote = false
        }
    })

    socket.on("disconnecting", () => {
        // try {
        //     console.log(temp);
        //     let index = temp['3'].findIndex((el) => el == socket.id)

        //     if (temp['3'][socket.id].vote) {
        //         understand--
        //     }

        //     temp['3'].splice(index, 1)
        // } catch (error) {
        //     console.log(error);
        // }
        temp = {}
        understand = 0
    });
})


startApp()