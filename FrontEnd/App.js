import React, { Component } from "react";
import { StyleSheet, Text, Alert ,Share } from "react-native";
import io from "socket.io-client";
import { LogBox } from 'react-native';
import { Container, Header,  Tab, Tabs , Left, Body, Right, Title} from 'native-base';
import { CreateRoom } from'./components/CreateRoom';
import { JoinRoom } from './components/JoinRoom';
LogBox.ignoreAllLogs();

//console._errorOriginal = console.error.bind(console);
    //console.error = () => {};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        box:[[" "," "," "],[" "," "," "],[" "," "," "]],
        player:"",
        currentChance:"",
        called:false,
        p2Joined:false,
        roomText:"",
        roomName:""
    };
    this.emitter=this.emitter.bind(this);
    
  }


  componentDidMount() {//,{transports: ['websocket'],pingTimeout: 30000}
  this.socket = io("http://192.168.43.203:3000");
 

  this.socket.on("change state",data=>{
    this.setState({
      box:data.box,
     currentChance:data.next
    });
  })
  

  this.socket.on("won",winner=>{
    this.setState({
      box:[[" "," "," "],[" "," "," "],[" "," "," "]],
        player:"",
        currentChance:"",
        called:false,
        p2Joined:false
    });
    if(winner!="draw")
    {
    Alert.alert(winner==this.state.player?"You":"Opponent" +" won!!")
    }
    else{
      Alert.alert("DRAW !!")
    }
  })

  this.socket.on("error",msg=>{
    Alert.alert(msg)
  })
  
  this.socket.on("p2 message",check=>{
    if(this.state.p2Joined!=check)
    this.setState({
      p2Joined:check
    })
  })

  

}

getRoom=()=>{
  console.log("reached getRoom()")
  this.socket.emit("create room")
  this.socket.on("room code",room=>{
    console.log(room)
    this.setState({
      roomText:room,
    })
  })

}
handleShare = () => {
  url='https://mega.nz/folder/AT5HGapR#_PjMvQkgbi4_KIcifc4yTw';
  message = `\nDownload the Sudoku Game App:${url}\n\nShared via Sudoku App`;
  return Share.share(
      {message, url: url},
      {dialogTitle:`Share app link `}
  );
}

handleMove=(i,j,player,box,room)=>{
  this.socket.emit("new move",{ i:i , j:j , player:player ,box:box ,room:room}) 
}

emitter(){
  this.socket.emit("p2 check",{ room:this.state.roomName ,player: this.state.player})
}

joinRoom=(roomCode)=>{
  this.socket.emit("get room data",roomCode)
  console.log("room join : ",roomCode)
  this.socket.emit("join room",roomCode)
  this.setState({
    roomName:roomCode
  })
  this.socket.on("symbol",data=>{
    this.setState({
      player :data.player,
      currentChance:data.next
    });
    this.setState({
      called :true
  });
})
}

leaveRoom=()=>{
  this.socket.emit("leaving",{ room : this.state.roomName,player : this.state.player })
}
setCalled=()=>{
  this.setState({
       called:false
    })
}

//////////////////////////////////////////////////////////////////////////////////////////
  render() {
    console.log(this.state.box)
    //render's return statement//////////////////////////////////////// 
    return(
      <Container>
              <Header hasTabs >
              <Left/>
                <Body>
                  <Title>🎮 Sudoku </Title>
                </Body>
                <Right >
                <Text name="share" onPress={this.handleShare} style={{color: 'white', fontSize:24}}>&#10150;</Text>
                </Right>
              </Header>
              <Tabs>
                <Tab heading="Create">
                  <CreateRoom roomText={this.state.roomText} getRoom={this.getRoom} />
                </Tab>
                <Tab heading="Join">
                  <JoinRoom box={ this.state.box } player={ this.state.player } currentChance={ this.state.currentChance } called={ this.state.called }  p2Joined={ this.state.p2Joined } joinRoom={this.joinRoom} handleMove={ this.handleMove } leaveRoom={this.leaveRoom} setCalled={this.setCalled} roomName={this.state.roomName} emitter={this.emitter}/>
                </Tab>
              </Tabs>
            </Container>
      );

    
      
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    width: 300,
    flexDirection: 'row',
    
  },
  parent:{
    marginTop:80,
    alignItems : "center" 
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom:12    
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff'
  }
});

