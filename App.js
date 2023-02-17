import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font'
import { TouchableOpacity } from 'react-native-web';


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
          <TouchableOpacity  onPress={() => Linking.openURL('https://accounts.google.com/signin')} style={{backgroundColor:'white', borderRadius: 9, height:Dimensions.get('window').height * 0.06 }}>
              <View style={{flexDirection: 'row', paddingTop:Dimensions.get('window').height * 0.015}}>
                <Icon name="google" color="black" size={30} style={{paddingLeft:10}}></Icon>
                <Text style={{ paddingLeft: 15, color: 'blue'}}>
                  Login with Google
                </Text>
              </View>
            </TouchableOpacity> 
            <br/>
          <TouchableOpacity onPress={() => alert('Error connecting to Facebook SSO Login API')} style={{backgroundColor:"#3b5998", borderRadius: 9, height:Dimensions.get('window').height * 0.06 }}>
              <View style={{flexDirection: 'row', paddingTop:Dimensions.get('window').height * 0.015}}>
                <Icon name="facebook" color="white" size={30} style={{paddingLeft:15}}></Icon>
                <Text style={{ paddingLeft: 20, color: 'white'}}>
                  Login with Facebook
                </Text>
              </View>
          </TouchableOpacity>
          <br/>
          <TouchableOpacity onPress={() => alert('Error connecting to Apple SSO Login API')} style={{backgroundColor:'black', borderRadius: 9, height:Dimensions.get('window').height * 0.06 }}>
            <View style={{flexDirection: 'row', paddingTop:Dimensions.get('window').height * 0.015}}>
              <Icon name="apple" color="white" size={30} style={{paddingLeft:10}}></Icon>
              <Text style={{ paddingLeft: 15, color: 'white'}}>
                Login with Apple
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    
  );
}


