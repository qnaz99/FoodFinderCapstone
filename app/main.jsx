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
import { Restaurant } from './Restaurant.jsx';


import { YELP_API_KEY, FOURSQUARE_API_KEY } from "@env";

const ItemSeparator = ({ title }) => (
  <View
    style={{
      height: 1,
      width: "100%",
      backgroundColor: "#607D8B",
    }}
  />
);


function renderMenu(){
  console.log("rendering menu")
  return Restaurant
}


export default function Main() {
    const navigation = useNavigation();
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState("13000");
    const [latitudeDelta, setLatitudeDelta] = useState(0.0922);
    const [longitudeDelta, setLongitudeDelta] = useState(0.0421);
    const [sort, setSort] = useState("distance");

    useEffect(() => {(async () => {
      try{
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
      catch(e){
        console.log("Unable to get location: ", e)
      }
        
      if (latitude && longitude) return;

      const response = await axios.get("https://geolocation-db.com/json/");
      if (response.data && response.data.latitude && response.data.longitude) {
          setLatitude(response.data.latitude);
          setLongitude(response.data.longitude);  
      }
      // uncommenting these 2 lines will hardcode the location to TMU Campus
      // setLatitude(43.657780) 
      // setLongitude(-79.380480)
      return  
    })();}, []);

    async function getResults(text){
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3Fcizh8BbV7Okn7EbZKcVs+6KPtMq2lAI/vXYJf+wkHI='
        },
        params: {
          query: text,
          ll: `${latitude},${longitude}`,
          sort,
          limit: 5,
          categories
        }
      }
      const response = await axios.get("https://api.foursquare.com/v3/places/search", options);
      // {
      //   headers: {
      //       Authorization: `Bearer ${FOURSQUARE_API_KEY}`
      //   },
      //   params: {
      //       term: text,
      //       latitude: latitude,
      //       longitude: longitude,
      //       categories: ['restaurants', 'bars'],
      //       radius: 5000,
      //       limit: 5
      //   }
      // });
      if(response.data.results){
          setResults(response.data.results)
          // console.log("results: ", results[0].coordinates)
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
        rotateEnabled={false}
        onRegionChange={(region) => {
          setLatitudeDelta(region.latitudeDelta);
          setLongitudeDelta(region.longitudeDelta);
        }}
      >
        {results[0] && <Marker coordinate={{latitude: results[0].geocodes.main.latitude, longitude: results[0].geocodes.main.longitude}}></Marker>}
        {results[0] && <Marker coordinate={{latitude: results[0].geocodes.main.latitude-(latitudeDelta/35), longitude:results[0].geocodes.main.longitude}}><Text style={{fontWeight: 'bold'}}>{results[0].name}</Text></Marker>}

        {results[1] && <Marker coordinate={{latitude: results[1].geocodes.main.latitude, longitude: results[1].geocodes.main.longitude}}></Marker>}
        {results[1] && <Marker coordinate={{latitude: results[1].geocodes.main.latitude-(latitudeDelta/35), longitude:results[1].geocodes.main.longitude}}><Text style={{fontWeight: 'bold'}}>{results[1].name}</Text></Marker>}

        {results[2] && <Marker coordinate={{latitude: results[2].geocodes.main.latitude, longitude: results[2].geocodes.main.longitude}}></Marker>}
        {results[2] && <Marker coordinate={{latitude: results[2].geocodes.main.latitude-(latitudeDelta/35), longitude:results[2].geocodes.main.longitude}}><Text style={{fontWeight: 'bold'}}>{results[2].name}</Text></Marker>}

        {results[3] && <Marker coordinate={{latitude: results[3].geocodes.main.latitude, longitude: results[3].geocodes.main.longitude}}></Marker>}
        {results[3] && <Marker coordinate={{latitude: results[3].geocodes.main.latitude-(latitudeDelta/35), longitude:results[3].geocodes.main.longitude}}><Text style={{fontWeight: 'bold'}}>{results[3].name}</Text></Marker>}

        {results[4] && <Marker coordinate={{latitude: results[4].geocodes.main.latitude, longitude: results[4].geocodes.main.longitude}}></Marker>}
        {results[4] && <Marker coordinate={{latitude: results[4].geocodes.main.latitude-(latitudeDelta/35), longitude:results[4].geocodes.main.longitude}}><Text style={{fontWeight: 'bold'}}>{results[4].name}</Text></Marker>}

      </MapView>}
      { results[0] && results[1] && results[2] && results[3] && results[4] && 
          <FlatList
            style={{position: 'absolute', top: Dimensions.get('window').height * 0.13, zIndex: 1}}
            data={results}

            renderItem={({item}) => (
              <View>
                  {/* <Text onPress={() => navigation.navigate('/restaurant')}>{item.name}, <Text style={{color: 'gray'}}>{item.location.address1}</Text></Text> */}

                  <View style={{backgroundColor: 'white'}}><Text onPress={() => navigation.navigate('Restaurant')} style={{fontSize: 19}}>{item.name}, <Text style={{color: 'gray'}}>{item.location.address}</Text></Text></View>
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
