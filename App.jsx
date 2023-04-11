import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'
import { TouchableOpacity } from 'react-native';
import LoginButton  from './assets/App/LoginButton.jsx';
import 'expo-dev-client';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Allison': require('./assets/fonts/Allison.ttf'),
  })
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
      resizeMode: "cover",
    },
    logoText: {
      position: 'relative', 
      color: 'white', 
      fontFamily: 'Allison', 
      fontSize: 130, 
      zIndex: 3, 
      elevation: 3, 
      textAlign: 'center',
      top: -Dimensions.get('window').height / 6,
    },
    button:{
      size: 50,
      width: Dimensions.get('window').width * 0.8,
      alignSelf: 'center', 
    }
  })  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source="https://14thlane.ro/files/pages/1/OurStory2.webp" resizeMode="cover" style={styles.image}>
        <Text style={styles.logoText}>FoodFinder</Text>
        <View style={styles.button}>
          <LoginButton name="google" iconColor= "black" text="Login with Google" backgroundColor= "white" textColor="blue" onPress={() => Linking.openURL('https://accounts.google.com/signin')}/>
          <br/>
          <LoginButton name="facebook" iconColor= "white" text="Login with Facebook" backgroundColor= "#3b5998" textColor="white" onPress={() => alert("Not set up")}/>
          <br/>
          <LoginButton name="apple" iconColor= "white" text="Login with Apple" backgroundColor= "black" textColor="white" onPress={() => alert("Not set up")}/>
        </View>
      </ImageBackground>
    </View>
    
  );
}


