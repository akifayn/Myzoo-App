import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Fonts } from '../assets/fonts/fontsjs';

export default function ZooHeader({ scrollRef, animalsRef, eventsRef, feedingRef,contactRef }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const translateX = useSharedValue(130);

  useEffect(() => {
    if (menuVisible) {
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(130, { duration: 300 });
    }
  }, [menuVisible]);

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleMenuPress = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToSection = (section) => {
    setMenuVisible(false);

    switch (section) {
      case 'animals':
        animalsRef.current?.measureLayout(scrollRef.current, (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        });
        break;
      case 'events':
        eventsRef.current?.measureLayout(scrollRef.current, (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        });
        break;
      case 'feeding':
        feedingRef.current?.measureLayout(scrollRef.current, (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        });
        case 'contact': // İletişim bölümü için eklenen kısım
        contactRef.current?.measureLayout(scrollRef.current, (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        });
        break;
      default:
        break;
  };

    let yPosition = 0;
    switch (section) {
      case 'animals':
        yPosition = 200;
        break;
      case 'events':
        yPosition = 600;
        break;
      case 'feeding':
        yPosition = 1000;
        break;
      default:
        break;
    }

    scrollRef.current?.scrollTo({ y: yPosition, animated: true });
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/zoo-header.png')}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Hoşgeldiniz</Text>
      </View>

      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#E85C0D" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <BlurView intensity={80} style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
            
            <Pressable style = {styles.closeButtonContainer} onPress={() => setMenuVisible(false)}>
              <Image source={require('../assets/images/close.png')} style = {styles.closeButton}></Image>
            </Pressable>
            <Text style={ styles.menüTitleContainer}>Menü</Text>

            <Pressable onPress={() => navigateToSection('animals')} style={styles.menuItemContainer}>
              <Image source={require('../assets/images/habitat.png')} style={styles.menuIcon} />
              <Text style={styles.menuItem}>Bugün Görebileceğiniz Hayvanlar</Text>
            </Pressable>

            <Pressable onPress={() => navigateToSection('events')} style={styles.menuItemContainer}>
              <Image source={require('../assets/images/activity.png')} style={styles.menuIcon} />
              <Text style={styles.menuItem}>Güncel Etkinlikler</Text>
            </Pressable>

            <Pressable onPress={() => navigateToSection('feeding')} style={styles.menuItemContainer}>
              <Image source={require('../assets/images/food.png')} style={styles.menuIcon} />
              <Text style={styles.menuItem}>Beslenme Saatleri</Text>
            </Pressable>

            <Pressable onPress={() => navigateToSection('contact')} style={styles.menuItemContainer}>
              <Image source={require('../assets/images/communicate.png')} style={styles.menuIcon} />
              <Text style={styles.menuItem}>İletişim</Text>
            </Pressable>

          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
    marginLeft: 120,
    
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menüTitleContainer:{
    position:'absolute',
    top:80,
    left:10,
    fontFamily:Fonts.RobotoBlack
  },
  menuContainer: {
    width: 150,
    height: '100%',
    backgroundColor: '#E7FBE6',
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 70,
  },
  closeButtonContainer:{
    bottom:165,
    left:100
  },
  closeButton:{
    width: 17,
    height: 17,
    
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 7,
  },
  menuItem: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
