import {
  StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { YELP_API_KEY, geolocationDbUrl } from "@env";
import axios from 'axios';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapView from 'react-native-web-maps';
// import {default as FaSpinner} from "react-icons/lib/fa/spinner";
// import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, Dimensions } from 'react-native';
// import axios from 'axios';
// import { Searchbar } from 'react-native-paper';
// // import { MapView } from 'expo-mapview';
// import { Location } from 'expo';
// import { withScriptjs } from 'react-google-maps';
// import asyncLoader from 'react-async-script-loader';


const yelpApiKey = process.env.YELP_API_KEY;
export default function Main() {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const google = window.google;

    const styles = StyleSheet.create({
        searchbar:{
            width: Dimensions.get('window').width * 0.8, 
            border: '5px solid white',
        }
    });
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

    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //     center: [longitude, latitude], // starting position [lng, lat]
    //     zoom: 9 // starting zoom
    // });
    



    return(
        <View>
            <View style={{paddingLeft:Dimensions.get('window').width * 0.2,}}>
                <Searchbar style={styles.searchbar} placeholder="What are you craving?" />
            </View>
            <Text></Text><MapView provider={"google"} region={{latitude, latitude}}/>
        </View>
    )
}
//export default asyncLoader(withScriptjs(Main));


