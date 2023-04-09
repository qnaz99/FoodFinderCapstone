import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer, Avatar, Title } from 'react-native-paper';
import { useNavigation } from "expo-router";


export function Sidebar(){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {/* <Avatar.Image size={120} source={require('/assets/avatar.png')} /> */}
        <View style={styles.userTextContainer}>
          <Title style={styles.userName}>Hi Samuel James !</Title>
        </View>
      </View>
      <Drawer.Item
        label="Search"
        icon="magnify"
        onPress={() => navigation.navigate('Main')}
        style={styles.drawerItem}
      />
      <Drawer.Item
        label="Orders"
        icon="clipboard-list"
        onPress={() => alert('Orders pressed')}
        style={styles.drawerItem}
      />
      <Drawer.Item
        label="Favorites"
        icon="heart"
        onPress={() => alert('Favorites pressed')}
        style={styles.drawerItem}
      />
      <Drawer.Item
        label="Reviews"
        icon="star"
        onPress={() => alert('Reviews pressed')}
        style={styles.drawerItem}
      />
      <Drawer.Item
        label="Invite a friend"
        icon="account-plus"
        onPress={() => alert('Invite a friend pressed')}
        style={styles.drawerItem}
      />
      <Drawer.Item
        label="Sign out"
        icon="logout"
        onPress={() => navigation.navigate('Login')}
        style={styles.drawerItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingLeft: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  userTextContainer: {
    marginLeft: 10,
    marginTop: 10
  },
  userName: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  drawerItem: {
    justifyContent: 'center',
    height: 70,

  },
});