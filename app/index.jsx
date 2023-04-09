import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
} from 'react-native';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import LoginButton from '../assets/app/LoginButton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_GUID } from "@env"
import * as SplashScreen from 'expo-splash-screen';
import { Link } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main  from './Main.jsx';
import Restaurant from './Restaurant.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useNavigation } from "expo-router";






const Stack = createNativeStackNavigator();

const googleGuid = GOOGLE_GUID; // necessary due to race condition against react-native-dotenv

SplashScreen.preventAutoHideAsync();

WebBrowser.maybeCompleteAuthSession();

function Login() {
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '276689317757-pl1dm02l981r5cll4kvq5p5f0sndatkn.apps.googleusercontent.com',
    expoClientId: '276689317757-0lseqcitvnussnbil3mfe9uhmfsu4ktd.apps.googleusercontent.com'
  });
  const [fontsLoaded] = useFonts({
    Allison: require('./../assets/fonts/Allison.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
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
        <ImageBackground source={{url: "https://cdn.archilovers.com/projects/e1300c81-8547-47b4-9357-8010bc6c6699.jpg"}} resizeMode="cover" style={styles.image}>
          <Text style={styles.logoText}>FoodFinder</Text>
          
          <View style={styles.button}>
            <LoginButton name="google" iconColor="black" text="Login with Google" backgroundColor="white" textColor="blue" onPress={() => promptAsync()}/>
            <Text></Text>
            <LoginButton name="facebook" iconColor="white" text="Login with Facebook" backgroundColor="#3b5998" textColor="white" onPress={() => navigation.navigate('Main')} />
            <Text></Text>
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


export default function App() {
  return (
    
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={ Login } />
        <Stack.Screen name="Main" component={ Main } />
        <Stack.Screen name="Restaurant" component={ Restaurant } />
        <Stack.Screen name="Sidebar" component={ Sidebar } />

      </Stack.Navigator>
    
  );
}
