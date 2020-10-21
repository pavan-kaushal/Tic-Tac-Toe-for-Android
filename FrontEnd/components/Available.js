import React, { Component } from 'react'
import {  View, TouchableOpacity ,StyleSheet,Alert} from 'react-native'

export class Available extends Component {
    constructor(props) {
        super(props);
        
    }

    handlePress=()=>{
        if(this.props.currentChance==this.props.player){
        this.props.move(this.props.i,this.props.j,this.props.player,this.props.box,this.props.roomName)
        }
        else{
            Alert.alert("Opponent's Turn");
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={this.handlePress}>
                <View style={styles.square} ></View>
            </TouchableOpacity>
        )
    }
}

export default Available

const styles = StyleSheet.create({
    square: {
        width: 100,
        height: 100,
        backgroundColor: '#D3D3D3',
        borderWidth: 1,
        display:"flex"
    }
  });