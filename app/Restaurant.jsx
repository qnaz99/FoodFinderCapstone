/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Alert, Image, Text,
} from 'react-native';
import {
  Button, List, Checkbox, Title, Subheading, Divider, IconButton,
} from 'react-native-paper';
import axios from 'axios';
import { useSearchParams } from "expo-router";
import { FOURSQUARE_API_KEY, geolocationDbUrl, foursquareBasePath, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET } from "@env";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 16,
    backgroundColor: 'blue',
  },
});

function Restaurant({ route, navigation }) {
  const id = route.params.id
  const { user, extra } = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuData, setMenuData] = useState([]);

  const getMenu = async () => {
    const menuOptions = {
      params: {
        client_id: FOURSQUARE_CLIENT_ID,
        client_secret: FOURSQUARE_CLIENT_SECRET,
        v: '20120609'
      }
    }
    try{
      const menuResponse = await axios.get(`https://api.foursquare.com/v2/venues/${id}/menu`, menuOptions)
      menuResponse.data.response.menu.menus.items ? setMenuData(menuResponse.data.response.menu.menus.items) : setMenuData([])
      return
    }
    catch(e){
      console.log(e.response.data)
    }
  }

  
  const [menu, setMenu] = useState([
    {
      name: 'Burger',
      prices: '$5.99',
      description: 'A juicy burger with all the fixings.',
      quantity: 0,
    },
    {
      name: 'Fries',
      price: '$2.99',
      description: 'Crispy golden fries.',
      quantity: 0,
    },
    {
      name: 'Soda',
      price: '$1.99',
      description: 'Your choice of refreshing soda.',
      quantity: 0,
    },
  ]);
  useEffect(() => {
    getMenu()
  }, [])

  const handleSelectItem = (item) => {
    const updatedSelectedItems = [...selectedItems];
    const selectedItemIndex = updatedSelectedItems.findIndex((i) => i.item.id === item.id);
    if (selectedItemIndex > -1) {
      updatedSelectedItems[selectedItemIndex].quantity += 1;
    } else {
      updatedSelectedItems.push({ item, quantity: 1 });
    }
    setSelectedItems(updatedSelectedItems);
    setSelectedItem(item);
  };

  const handleAddToCart = (item) => {
    console.log('Adding item to cart:', item);
    const updatedMenu = [...menu];
    const index = updatedMenu.findIndex((i) => i.id === item.id);
    updatedMenu[index].quantity += 1;
    setMenu(updatedMenu);
    handleSelectItem(item);
  };

  const handleRemoveFromCart = (item) => {
    const updatedMenu = [...menu];
    const index = updatedMenu.findIndex((i) => i.id === item.id);
    updatedMenu[index].quantity -= 1;
    setMenu(updatedMenu);
    const updatedSelectedItems = [...selectedItems];
    const selectedItemIndex = updatedSelectedItems.findIndex((i) => i.item.id === item.id);
    if (selectedItemIndex > -1) {
      updatedSelectedItems[selectedItemIndex].quantity -= 1;
      if (updatedSelectedItems[selectedItemIndex].quantity === 0) {
        updatedSelectedItems.splice(selectedItemIndex, 1);
      }
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleDeselectItem = () => {
    setSelectedItem(null);
  };

  const handleCheckout = () => {
    setMenu(menu.map((item) => ({ ...item, quantity: 0 })));
    setSelectedItems([]);
    setSelectedItem(null);
    Alert.alert('Checkout', 'Thank you for your order!');
  };

  const renderMenu = () => (
    <>
    <Text/>
    <Text/>
    <Text/>
    <Text/>
    <List.Subheader onPress={() => navigation.goBack()}>Back</List.Subheader>
    {menuData.map((item) => (  
      <List.Accordion title={item.name}>
        {item.entries.items[0].entries.items.map((items) => (
          <List.Item
            key={items.id}
            title={items.name}
            description={items.price}
            onPress={() => handleAddToCart(item)}
          />
        ))}
      </List.Accordion>
    ))}

    <Button mode="contained" onPress={handleCheckout}>
      Checkout
    </Button>
    {/* </List.Accordion> */}
    </>
  );
  const renderSelectedItem = () => (
    <>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={handleDeselectItem}
        style={styles.backButton}
      />
      <View style={styles.selectedItemContainer}>
        <Image
          source={selectedItem.image}
          resizeMode="cover"
          style={styles.selectedItemImage}
        />
        <View style={styles.selectedItemDetails}>
          <Title>{selectedItem.name}</Title>
          <Subheading>{selectedItem.price}</Subheading>
          <Divider style={styles.divider} />
          <Text>{selectedItem.description}</Text>
          <Button mode="contained" onPress={() => handleAddToCart(selectedItem)}>
            Add to Cart
          </Button>
        </View>
      </View>
    </>
  );

  const renderCart = () => (
    <>
      <Title style={styles.title}>Cart</Title>
      <List.Section>
        {selectedItems.map((cartItem) => (
          <List.Item
            key={cartItem.item.id}
            title={cartItem.item.name}
            description={`${cartItem.quantity} x ${cartItem.item.price}`}
            right={() => (
              <>
                <Button
                  icon="minus"
                  mode="outlined"
                  onPress={() => handleRemoveFromCart(cartItem.item)}
                  style={styles.quantityButton}
                />
                <Subheading style={styles.quantityText}>{cartItem.quantity}</Subheading>
                <Button
                  icon="plus"
                  mode="outlined"
                  onPress={() => handleAddToCart(cartItem.item)}
                  style={styles.quantityButton}
                />
              </>
            )}
          />
        ))}
      </List.Section>
      <Button mode="contained" onPress={handleCheckout} style={styles.checkoutButton}>
        Checkout
      </Button>
    </>
  );

  return (
    <View style={styles.container}>
      {selectedItem ? (
        renderSelectedItem()
      ) : (
        <>
          {renderMenu()}
          {selectedItems.length > 0 && renderCart()}
        </>
      )}
    </View>
  );
}

export default Restaurant;
