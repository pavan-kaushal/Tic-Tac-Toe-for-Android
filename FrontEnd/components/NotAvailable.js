import React, { Component } from 'react'
import { Text, View ,StyleSheet} from 'react-native'

export class NotAvailable extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        let textvalue=this.props.value=="X"?<Text style={{fontSize:90,marginTop:-15,marginLeft:20,color:'red'}}>{this.props.value}</Text>:<Text style={{fontSize:90,marginTop:-15,marginLeft:20,color:'blue'}}>{this.props.value}</Text>;
        return (
            <View>
                <View style={styles.square} ><Text style={{fontSize:90,marginTop:-15,marginLeft:20,color:'red'}}>{textvalue}</Text></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    square: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderWidth: 1,
        display:"flex"
    },
    innerCircle: {
        backgroundColor: '#F5FCFF',
        width: 70,
        height: 70,
        marginLeft:12,
        marginTop:12,
        borderRadius: 35,
      }
  });

export default NotAvailable
