import React, { Component } from 'react'
import { Text, View ,TouchableOpacity ,StyleSheet,Share} from 'react-native'

export class CreateRoom extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      roomText:"",
    }
    
  }

  roominfo=()=>{
    this.props.getRoom()
    this.setState({
      roomtext:this.props.roomText
    })
  }

  handleShare = () => {
    message = `${this.props.roomText}`;
    return Share.share(
        {message},
        {dialogTitle:`Share or Copy Room Code `}
    );
}
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Create new Room </Text>
                <TouchableOpacity style={styles.saveButton} onPress={this.roominfo}>
                    <Text style={styles.saveButtonText}>Create</Text>
                </TouchableOpacity>
                {
                 this.props.loading?<Text style={styles.roomCodeText}><Text style={{color:'blue'}}>Loading.....</Text></Text>: this.props.roomText!=""?<Text style={styles.roomCodeText}>{this.props.roomText}      <Text onPress={this.handleShare} style={{color: 'white', fontSize:24,backgroundColor:'#3740ff'}}> &#10150; </Text></Text>:<Text></Text>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
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
        padding: 10,
        margin: 45,
        marginTop: 10
      },
      saveButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
      },
      roomCodeText:{
        fontSize:20,
        textAlign: 'center',
        backgroundColor: '#D3D3D3'
      }
  });
export default CreateRoom
