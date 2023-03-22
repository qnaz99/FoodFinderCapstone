import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { YELP_API_KEY, geolocationDbUrl } from "@env";
import axios from 'axios';

const yelpApiKey = process.env.YELP_API_KEY;

export default function Main() {
    const [latitude, setLatitude] = useState(null);
    
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {(async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        const locationFallback = await axios.get(geolocationDbUrl)
        if (status !== 'granted') {
            const response = await axios.get(geolocationDbUrl);
            if (response.data.latitude && response.data.longitude) {
                setLatitude(response.data.latitude);
                setLongitude(response.data.longitude);
            }
            return
        }
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
    })();}, []);



    return(
        <View>
            <Searchbar placeholder="What are you craving?" />
            <Text></Text>

        </View>
        
    )
}
