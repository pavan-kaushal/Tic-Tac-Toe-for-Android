import React, { Component } from 'react'
import { Text, View ,TouchableOpacity ,StyleSheet,TextInput} from 'react-native'
import { Available } from './Available';
import { NotAvailable } from './NotAvailable';

export class JoinRoom extends Component {

  constructor(props) {
    super(props)
    this.state = {
       roomName:this.props.roomName,
    }
  }
  updateFormField (fieldName) {
    return (event) => {
      this.setState({
        [fieldName]: event.nativeEvent.text,
      })
    }
  }

  submitRoomName(){
    this.props.joinRoom(this.state.roomName)
    //this.props.timer()
   this.timer= setInterval(() => {
      this.props.emitter()
    }
      , 1000);
    
  }
  
  leaveroom=()=>{
    clearInterval(this.timer)
    console.log("leaving :",this.state.roomName)
    this.props.leaveRoom(this.state.roomName)
    this.props.setCalled()
  }
  
    render() {
      if(this.props.loading)
      return(<Text style={{marginTop:70,fontSize:30,color:'blue',backgroundColor: '#D3D3D3',textAlign: 'center'}}>Loading...</Text>)
        if(!this.props.called){
        return (
            <View >
              <Text style={styles.header}>Join Room </Text>
                <View style={styles.inputContainer}>
              <TextInput
                  style={styles.textInput}
                  placeholder="Room code..."
                  maxLength={30}
                  onChange={this.updateFormField('roomName')}
              />
          </View>
                <TouchableOpacity style={styles.saveButton} onPress={() => this.submitRoomName()}>
                    <Text style={styles.saveButtonText}>Join</Text>
                </TouchableOpacity>
                <Text style={styles.danger}>*** RoomCode Should Not Have Spaces ***</Text>
            </View>
        )
      }
      else{
        let boxItems = this.props.box.map((row,i) => {
          console.log(row)
          return (
            <View style={styles.container} key={i}>
              { 
                row.map((element,j) =>{
                    if(element==" ")
                    return (<Available i={i} j={j}  player={this.props.player} currentChance={this.props.currentChance} move={this.props.handleMove} box={this.props.box} key={3*i+j} roomName={this.state.roomName}></Available>);
                    else
                    return (<NotAvailable value={this.props.box[i][j]} key={3*i+j}></NotAvailable>);
                  }
                ) 
              }
            </View>
          ) 
        });
        let colour= this.props.currentChance=="X"?"red":"blue"
        let myColour= this.props.player=="X"?"red":"blue"
      return (
        <View style={styles.parent}>
          <Text>{this.props.countDown}</Text>
          <TouchableOpacity  style={styles.button} onPress={this.leaveroom} >
              <Text style={styles.buttonText}>Exit Room</Text>
          </TouchableOpacity>
          
          {
            this.props.currentChance==this.props.player?<Text style={{fontSize:20,color:colour}}>Your Turn...</Text>:<Text style={{fontSize:20,color:colour}}>Opponent's Turn...</Text>
          }
          <Text style={{fontSize:20,color:'black'}}>You : <Text style={{fontSize:30,color:myColour}}>{this.props.player}</Text></Text>
          {
        boxItems
        } 
        {
          this.props.p2Joined?<Text style={{fontSize:20,backgroundColor:"#00FFFF",marginTop:30,color:"black"}}>Player 2 In the Room...<Text style={{color:"#228B22"}}>&#10003; &#x2713;</Text> </Text>:<Text style={{fontSize:20,backgroundColor:"#FF00FF",marginTop:30,color:"white"}}>Player 2 Not In Room...</Text>
        }
        </View>
          );
      }
    }



}
const styles = StyleSheet.create({
    container2: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    header: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
      fontWeight: 'bold'
    },
    saveButton: {
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: '#007BFF',
        padding: 15,
        margin: 45,
        marginTop: 15
      },
      saveButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
      },
      inputContainer: {
        paddingTop: 15
      },
      textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
      },
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
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom:12,
        marginTop:-70,
        marginLeft:-250
      },
      buttonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff'
      },
      danger:{
        textAlign: 'center',
        fontSize: 15,
        color: 'red'
      }
  });
export default JoinRoom
