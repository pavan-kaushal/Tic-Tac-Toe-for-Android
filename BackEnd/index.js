const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port =  3000 ;
let rooms=io.sockets.adapter.rooms

conditions=(temp,data)=>{
      //horizontal///////////////////////////////////////
      if( (JSON.stringify(temp[0]) == JSON.stringify(["X","X","X"])) || (JSON.stringify(temp[0]) == JSON.stringify(["O","O","O"])) ){
        io.to(data.room).emit("won",temp[0][0])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;
        }
        if( JSON.stringify(temp[1]) == JSON.stringify(["X","X","X"]) || (JSON.stringify(temp[1]) == JSON.stringify(["O","O","O"])) ){
        io.to(data.room).emit("won",temp[1][1])
        rooms[data.room].symbols=["X","O"]
        temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
        rooms[data.room].chance=1
        return true;

        }
        if( JSON.stringify(temp[2]) == JSON.stringify(["X","X","X"]) || (JSON.stringify(temp[2]) == JSON.stringify(["O","O","O"])) ){
          io.to(data.room).emit("won",temp[2][2])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;

        }
    
        //vertical////////////////////////////////////
        if((temp[0][0]===temp[1][0] && temp[1][0]===temp[2][0]  && temp[0][0]=="X") || (temp[0][0]===temp[1][0] && temp[1][0]===temp[2][0]  && temp[0][0]=="O") ){
          console.log("-------------vertical-----------------")
          io.to(data.room).emit("won",temp[0][0])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;

        }
        if((temp[0][1]===temp[1][1] && temp[1][1]===temp[2][1]  && temp[1][1]=="X") || (temp[0][1]===temp[1][1] && temp[1][1]===temp[2][1]  && temp[1][1]=="O") ){
          console.log("-------------vertical-----------------")
          io.to(data.room).emit("won",temp[0][1])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;

        }
        if((temp[0][2]===temp[1][2] && temp[1][2]===temp[2][2]  && temp[2][2]=="X") || (temp[0][2]===temp[1][2] && temp[1][2]===temp[2][2]  && temp[2][2]=="O") ){
          console.log("-------------vertical-----------------")
          io.to(data.room).emit("won",temp[0][2])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;

        }
        //diagonal////////////////////////////////////
        if( ( (temp[0][0]===temp[1][1] && temp[1][1]===temp[2][2]) &&temp[1][1]!=" ") || ( (temp[0][2]===temp[1][1] && temp[1][1]===temp[2][0]) &&temp[1][1]!=" ")  ){
          console.log("-------------Diagonal-----------------")
          io.to(data.room).emit("won",temp[1][1])
          rooms[data.room].symbols=["X","O"]
          temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
          rooms[data.room].chance=1
          return true;

        }
        let next=data.player=="X"?"O":"X";
        console.log(temp)
        rooms[data.room].box=temp
        rooms[data.room].next=next
      io.to(data.room).emit("change state",{ box : rooms[data.room].box , next: rooms[data.room].next });
      return false;

}

io.on("connection", socket => {
  console.log("a player connected ");
//////////////////////////////////////////////////
  socket.on("create room", dummy => {
    var roomname=Date.now();
    console.log("create room called , sending : ",roomname);
    socket.join(roomname)
    rooms[roomname].symbols=["X","O"]
    rooms[roomname].chance=1
    rooms[roomname].box=[[" "," "," "],[" "," "," "],[" "," "," "]]
    rooms[roomname].next="X"
    io.to(socket.id).emit("room code", roomname)
  });

  socket.on("join room", room => {
    if(rooms[room] ){
  console.log('Number of clients : ',rooms[room].length);
      if(rooms[room].symbols.size!=0)
      {
        if(rooms[room].symbols.size==1){
            io.to(room).emit("p2 message",true)
        }
      console.log("player : ",rooms[room].symbols[0]," in room ",room)
      io.to(socket.id).emit("symbol",{ player:rooms[room].symbols[0] , next:rooms[room].next });
      rooms[room].symbols.splice(0, 1);
      socket.join(room) 
    }
    else{
      console.log(room," : -----room full----")
      io.to(socket.id).emit("error","room full");
    }
          }  
          else{
              console.log(room," : -----invalid room----")
      io.to(socket.id).emit("error","invalid room");
          }   
});

  socket.on("get room data",room=>{
    if(rooms[room]){
     io.to(socket.id).emit("change state",{ box:rooms[room].box , next:rooms[room].next })
      }
  })

  socket.on("p2 check",data=>{
    if(rooms[data.room]){
    console.log("p2 check in room : ",data.room)
    console.log("Clients : ",rooms[data.room].length)
    if(rooms[data.room].length>1)
    io.to(data.room).emit("p2 message",true);
    else
    {  
       let value= data.player=="X"?"O":"X"
       if(!rooms[data.room].symbols.includes(value)){
       console.log("adding ",value," to room : ",data.room)
       rooms[data.room].symbols.push(value)
      }
       io.to(data.room).emit("p2 message",false);
    }
  }
  })
///////////////////////////////////////////////

  
  socket.on("new move", data => {
    console.log("new move from player ",data.player," at ","(",data.i," , ",data.j,") from room : ",data.room)
    //if()   //emit p2 message false
    let temp=data.box;
    temp[data.i][data.j]=data.player;
    console.log(data);
    rooms[data.room].chance=rooms[data.room].chance+1
    
    let won=conditions(temp,data)

    console.log(temp)
    
    if(rooms[data.room].chance==10 && !won){
      symbols=["X","O"]
      temp=[[" "," "," "],[" "," "," "],[" "," "," "]]
      rooms[data.room].chance=1
      io.emit("won","draw")
      let next=data.player=="X"?"O":"X";
      rooms[data.room].next=next
      rooms[data.room].box=temp
    io.to(data.room).emit("change state",{ box : temp , next: rooms[data.room].next });
    }
      
    
  });
  
  socket.on("leaving", data => {
    console.log(socket.rooms)
      console.log("player ",data.player," leaving room :",data.room)
      rooms[data.room].symbols.push(data.player);
      socket.leave(data.room)
      io.to(data.room).emit("p2 message",false)
  });

  socket.on("disconnect", data => {
    console.log(socket.id," disconnected")

});


});


server.listen(port, () => console.log("server running on port:" + port));