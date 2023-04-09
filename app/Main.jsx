import React, { useState, useEffect } from 'react';
import {
    FlatList, StyleSheet, Text, View, Image, ImageBackground, Dimensions, Linking,
  } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { Checkbox, Modal, Portal, IconButton, Searchbar, Provider, List } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from "expo-router";
import Restaurant from './Restaurant.jsx';
import { FOURSQUARE_API_KEY, geolocationDbUrl, foursquareBasePath, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from "@env";

const ItemSeparator = ({ title }) => (
  <View
    style={{
      height: 1,
      width: "100%",
      backgroundColor: "#607D8B",
    }}
  />
);

const ALL_RESTAURANTS_CODE = "13000"
const HALAL_CODE = "13191"
const KOSHER_CODE = "13287"
const VEGAN_CODE = "13377"

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
    const [categories, setCategories] = useState(ALL_RESTAURANTS_CODE);
    const [latitudeDelta, setLatitudeDelta] = useState(0.0922);
    const [longitudeDelta, setLongitudeDelta] = useState(0.0421);
    const [sort, setSort] = useState("distance");
    const [distance, setDistance] = useState(true)
    const [rating, setRating] = useState(false)
    const [relevance, setRelevance] = useState(false)
    const [withMenusOnly, setWithMenusOnly] = useState(false);
    const [filterVisible, setFiltersVisible] = useState(false);
    const [menus, setMenus] = useState([]);
    const [halal, setHalal] = useState(false);
    const [kosher, setKosher] = useState(false);
    const [vegan, setVegan] = useState(false);

    const handleChangeDistance = () => {
      if(!distance){
        setDistance(true)
        setRating(false)
        setRelevance(false)
        setSort("distance")
        setResults([])
      }
    }
    const handleChangeRating = () => {
      if(!rating){
        setDistance(false)
        setRating(true)
        setRelevance(false)
        setResults([])
        setSort("rating")
      }
    }
    const handleChangeRelevance = () => {
      if(!relevance){
        setDistance(false)
        setRating(false)
        setRelevance(true)
        setResults([])
        setSort("relevance")
      }
    }



    const handleHalalChange = () => {
      setHalal(!halal)
      if(!halal){
        setKosher(false)
        setVegan(false)
        setCategories(HALAL_CODE)
        setResults([])
        return
      }
      setCategories(ALL_RESTAURANTS_CODE)
    }
    const handleKosherChange = () => {
      setKosher(!kosher)
      if(!kosher){
        setHalal(false)
        setVegan(false)
        setCategories("13287")
        setResults([])
        return
      }
      setCategories(ALL_RESTAURANTS_CODE)
    }
    const handleVeganChange = () => {
      setVegan(!vegan)
      if(!vegan){
        setHalal(false)
        setKosher(false)
        setResults([])
        setCategories("13377")
        return
      }
      setCategories(ALL_RESTAURANTS_CODE)
    }


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

      const response = await axios.get(geolocationDbUrl);
      if (response.data && response.data.latitude && response.data.longitude) {
          console.log("Using geolocationDb API")
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
          Authorization: FOURSQUARE_API_KEY
        },
        params: {
          query: text,
          ll: `${latitude},${longitude}`,
          sort,
          limit: 50,
          categories
        }
      }
      const response = await axios.get(foursquareBasePath, options);
      if(response.data.results){
        const resultsWithMenu = []
        const menusFound = []
          if(!withMenusOnly){
            setResults(response.data.results.slice(0, 5))
            return
          }
          for(const result of response.data.results){
            const menuOptions = {
              params: {
                client_id: FOURSQUARE_CLIENT_ID,
                client_secret: FOURSQUARE_CLIENT_SECRET,
                v: '20120609'
              }
            }
            try{
              const menuResponse = await axios.get(`https://api.foursquare.com/v2/venues/${result.fsq_id}/menu`, menuOptions)
              // console.log(menuResponse.data.response.menu.menus.count)
              if (menuResponse.data && menuResponse.data.response.menu.menus.count > 0) {
                resultsWithMenu.push(result)
                menusFound.push(menuResponse.data.response.menu.menus.items)
              }
            }
            catch(e){
              console.log(e.response.data)
            }
            if(withMenusOnly.length>4){
              break
            }
          }
          console.log("results with menu: ", resultsWithMenu)
          setResults(resultsWithMenu)
          setMenus(menusFound)
      }
    }

  return (
    <Provider>
    <View style={styles.container}>
      <View style={{paddingLeft: Dimensions.get('window').width * 0.7 }}>
        <Searchbar 
          style={styles.searchbar} 
          placeholder={"What are you craving?"} 
          value={input} 
          onChangeText={(text) => {
            setInput(text);
            getResults(text)
          }}
        />
      </View>
      <View style={{paddingLeft: Dimensions.get('window').width * 0.99, }}>
        <IconButton 
          icon='menu'
          backgroundColor='white'

          size={35}
          onPress={() => navigation.navigate('Sidebar')}
          style={styles.profileIcon}
        />
      </View>
      
      <IconButton
        icon='filter-menu'
        style={styles.filterIcon}
        size={35}
        backgroundColor='white'
        onPress={() => setFiltersVisible(!filterVisible)}
      />
      
      <Portal>
        <Modal visible={filterVisible} onDismiss={() => setFiltersVisible(false)} contentContainerStyle={styles.filterModal}>
        <List.Accordion title={'Sort By'}>
            <Checkbox.Item 
              label='Distance'
              status={distance ? 'checked' : 'unchecked'}
              onPress={handleChangeDistance}
            />
            <Checkbox.Item 
              label='Rating'
              status={rating ? 'checked' : 'unchecked'}
              onPress={handleChangeRating}
            />
            <Checkbox.Item 
              label='Relevance'
              status={relevance ? 'checked' : 'unchecked'}
              onPress={handleChangeRelevance}
            />
          </List.Accordion>
          <Checkbox.Item
            status={withMenusOnly ? 'checked' : 'unchecked'}
            onPress={() => {
              setWithMenusOnly(!withMenusOnly);
              setInput("");
              setResults([]);
              console.log(withMenusOnly)
            }}
            label="Only show restaurants with menu data"
          >
          </Checkbox.Item>
          <List.Accordion title={'Dietary Restrictions'}>
            <Checkbox.Item 
              label='Halal'
              status={halal ? 'checked' : 'unchecked'}
              onPress={handleHalalChange}
            />
            <Checkbox.Item 
              label='Kosher'
              status={kosher ? 'checked' : 'unchecked'}
              onPress={handleKosherChange}
            />
            <Checkbox.Item 
              label='Vegan/Vegetarian'
              status={vegan ? 'checked' : 'unchecked'}
              onPress={handleVeganChange}
            />
          </List.Accordion>
        </Modal>
      </Portal>
      

        
      {latitude && longitude && <MapView
        
        provider="google"
        style={styles.map}
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
      { results[0] && 
          <FlatList
            style={{position: 'absolute', top: Dimensions.get('window').height * 0.13, zIndex: 1}}
            data={results}

            renderItem={({item}) => (
                <View style={{backgroundColor: 'white'}}><Text onPress={() => navigation.navigate('Restaurant', {id: item.fsq_id})} style={{fontSize: 19}}>{item.name}, <Text style={{color: 'gray'}}>{item.location.address}</Text></Text></View>
            )}
            ItemSeparatorComponent={ItemSeparator}
	        />  }
      <StatusBar style="auto" />
    </View>
    </Provider>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  searchbar: {
    width: Dimensions.get('window').width * 0.8, 
    border: '5px solid white',
    position: 'absolute',
    top: Dimensions.get('window').height * 0.07
  },
  map: {
    flex: 1, 
    width: '100%', 
    zIndex: -1 
  },
  profileIcon: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.07,
  },
  filterIcon: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.01,
    right: Dimensions.get('window').width * 0.03,
    zIndex: 3
  },
  filterModal: {
    backgroundColor: 'white',
    position: 'absolute',
    padding: 20,
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.4,
    bottom: -Dimensions.get('window').height * 0.05,
    marginBottom: 0
  }
});
