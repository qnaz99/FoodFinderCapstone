import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'
import { TouchableOpacity } from 'react-native-web';

export default function LoginButton(props) {
    return(
        <TouchableOpacity  onPress={() => Linking.openURL('https://accounts.google.com/signin')} style={{backgroundColor:props.backgroundColor, borderRadius: 9, height:Dimensions.get('window').height * 0.06 }}>
            <View style={{flexDirection: 'row', paddingTop:Dimensions.get('window').height * 0.015}}>
                <Icon name={props.name} color={props.iconColor} size={30} style={{paddingLeft:10}}></Icon>
                <Text style={{ paddingLeft: 15, color: props.textColor}}>
                    {props.text}
                </Text>
            </View>
        </TouchableOpacity>
    )   
}