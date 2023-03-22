import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { TouchableOpacity } from 'react-native-web';
import LoginButton from '../assets/app/LoginButton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_GUID } from "@env"

const googleGuid = GOOGLE_GUID; // necessary due to race condition against react-native-dotenv

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  console.log(GOOGLE_GUID)
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: googleGuid,
  });
  const [fontsLoaded] = useFonts({
    Allison: require('./../assets/fonts/Allison.ttf'),
  });
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
      resizeMode: 'cover',
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
    button: {
      size: 50,
      width: Dimensions.get('window').width * 0.8,
      alignSelf: 'center',
    },
  });

  return (
      <View style={styles.container}>
        <StatusBar />
        <ImageBackground source="https://14thlane.ro/files/pages/1/OurStory2.webp" resizeMode="cover" style={styles.image}>
          <Text style={styles.logoText}>FoodFinder</Text>
          <View style={styles.button}>
            <LoginButton name="google" iconColor="black" text="Login with Google" backgroundColor="white" textColor="blue" onPress={() => promptAsync()} />
            <br />
            <LoginButton name="facebook" iconColor="white" text="Login with Facebook" backgroundColor="#3b5998" textColor="white" onPress={() => alert('Not set up')} />
            <br />
            <LoginButton name="apple" iconColor="white" text="Login with Apple" backgroundColor="black" textColor="white" onPress={() => alert('Not set up')} />
          </View>
        </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
