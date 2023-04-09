import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'
import { TouchableOpacity } from 'react-native';
import { Link } from "expo-router";


export default function LoginButton(props) {
    return(
        // note: a function must be passed into the onPress prop
        <TouchableOpacity onPress={props.onPress} style={{backgroundColor:props.backgroundColor, borderRadius: 9, height:Dimensions.get('window').height * 0.06 }}>
            <View style={{flexDirection: 'row', paddingTop:Dimensions.get('window').height * 0.015}}>
                <Icon name={props.name} color={props.iconColor} size={30} style={{paddingLeft:10}}></Icon>
                <Text style={{ color: props.textColor, paddingLeft:10, paddingTop:5}}>
                    {props.text}
                </Text>
            </View>
        </TouchableOpacity>
    )   
}