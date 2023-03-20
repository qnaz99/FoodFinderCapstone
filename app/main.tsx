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
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';


export default function Main() {
    return(
        <View>
            <Text>Test</Text>
        </View>
    )
}
