import React, { useCallback, useRef, useState, useEffect, useMemo, Component, createRef } from 'react';
import {
    FlatList, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Region, hello } from 'react-native-maps';
import { Searchbar, Modal } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { YELP_API_KEY, geolocationDbUrl } from "@env";





export default function Main() {

    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([])

    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //         setLong(position.coords.longitude),
    //         setLat(position.coords.latitude)
    //     }
    // )

    useEffect(() => {(async () => {
        // let location = await Location.getCurrentPositionAsync({});
        // setLatitude(location.coords.latitude);
        // setLongitude(location.coords.longitude);
        // if (latitude && longitude) return;
        const response = await axios.get("https://geolocation-db.com/json/");
        if (response.data && response.data.latitude && response.data.longitude) {
            setLatitude(response.data.latitude);
            setLongitude(response.data.longitude);  
        }
        return  
    })();}, []);

    async function getResults(text){
        const response = await axios.get("https://api.yelp.com/v3/businesses/search", {
            headers: {
                Authorization: `Bearer ${YELP_API_KEY}`
            },
            params: {
                    term: text,
                    latitude: latitude,
                    longitude: longitude,
                    categories: ['restaurants', 'bars'],
                    radius: 5000,
                    limit: 5
                }
        });
        if(response.data.businesses){
            setResults(response.data.businesses)
        }
    }

    

  return (
    <View style={styles.container}>
        <Searchbar style={styles.searchbar} placeholder={"What are you craving?"} value={input} onChangeText={(text) => {
					setInput(text);
                    getResults(text)
				}}/>
      {latitude && longitude && <MapView
        provider="google"
        style={{ flex: 1, width: '100%', zIndex: -1 }}
        googleMapsApiKey={"AIzaSyA3Tm7zj5CX0sEhD_wJdp6KXv2DK_LAHZc"}
        region={{latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
        showsUserLocation={true}
      >
        {/* <FlatList
            data={results}
            
	    />  */}
      </MapView>}
      <StatusBar style="auto" /> 
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  searchbar:{
    width: Dimensions.get('window').width * 0.8, 
    border: '5px solid white',
    position: 'absolute',
    top: Dimensions.get('window').height * 0.07
  }

});
