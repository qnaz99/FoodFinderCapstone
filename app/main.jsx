import React, { useCallback, useRef, useState, useEffect, useMemo, Component, createRef } from 'react';
import {
    FlatList, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Region, hello } from 'react-native-maps';
import { Searchbar, Modal } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { Link } from "expo-router";
import { useNavigation } from "expo-router";


import { YELP_API_KEY, geolocationDbUrl } from "@env";

const ItemSeparator = ({ title }) => (
  <View
    style={{
      height: 1,
      width: "100%",
      backgroundColor: "#607D8B",
    }}
  />
);



export default function Main() {
    const navigation = useNavigation();
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([])
    const [addresses, setAddresses] = useState([])


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


        // const response = await axios.get("https://geolocation-db.com/json/");
        // if (response.data && response.data.latitude && response.data.longitude) {
        //     setLatitude(response.data.latitude);
        //     setLongitude(response.data.longitude);  
        // }
        setLatitude(43.657780)
        setLongitude(-79.380480)
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
        //console.log(response.data.businesses ? true : false)

        if(response.data.businesses){
            setResults(response.data.businesses)
            //console.log(results[0])
            setAddresses[response.data.businesses[0].location.address1, response.data.businesses[1].location.address1, response.data.businesses[2].location.address1, response.data.businesses[3].location.address1, response.data.businesses[4].location.address1]
        }
    }

    

  return (
    <View style={styles.container}>
        <Searchbar 
            style={styles.searchbar} 
            placeholder={"What are you craving?"} 
            value={input} 
            onChangeText={(text) => {
                setInput(text);
                getResults(text)
            }}
        />
        
      {latitude && longitude && <MapView
        provider="google"
        style={{ flex: 1, width: '100%', zIndex: -1 }}
        googleMapsApiKey={"AIzaSyA3Tm7zj5CX0sEhD_wJdp6KXv2DK_LAHZc"}
        region={{latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
        showsUserLocation={true}
      >
        {results[0] && <Marker title='HERE' coordinate={results[0].coordinates}></Marker>}
        {results[0] && <Marker coordinate={results[0].coordinates}><Text>{results[0].name}</Text></Marker>}

        {results[1] && <Marker coordinate={results[1].coordinates}></Marker>}
        {results[1] && <Marker coordinate={results[1].coordinates}><Text>{results[1].name}</Text></Marker>}

        {results[2] && <Marker coordinate={results[2].coordinates}></Marker>}
        {results[2] && <Marker coordinate={results[2].coordinates}><Text>{results[2].name}</Text></Marker>}

        {results[3] && <Marker coordinate={results[3].coordinates}></Marker>}
        {results[3] && <Marker coordinate={results[3].coordinates}><Text>{results[3].name}</Text></Marker>}

        {results[4] && <Marker coordinate={results[4].coordinates}></Marker>}
        {results[4] && <Marker coordinate={results[4].coordinates}><Text>{results[4].name}</Text></Marker>}


      </MapView>}
      { results[0] && results[1] && results[2] && results[3] && results[4] && 
          <FlatList
            style={{position: 'absolute', top: Dimensions.get('window').height * 0.13, zIndex: 1}}
            data={results}

            renderItem={({item}) => (
                <View>
                    {/* <Text onPress={() => navigation.navigate('/restaurant')}>{item.name}, <Text style={{color: 'gray'}}>{item.location.address1}</Text></Text> */}

                    <Link style={{backgroundColor: 'white', fontSize: 19}} href="/restaurant/"><Text>{item.name}, <Text style={{color: 'gray'}}>{item.location.address1}</Text></Text></Link>
                </View>
            )}
            ItemSeparatorComponent={ItemSeparator}
            
	    />  }
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
