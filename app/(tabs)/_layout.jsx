import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { Fonts } from '../../assets/fonts/fontsjs';

export default function TabLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        [Fonts.RobotoBlack]: require('../../assets/fonts/Roboto-Black.ttf'),
        [Fonts.RobotoBlackItalic]: require('../../assets/fonts/Roboto-BlackItalic.ttf'),
        [Fonts.RobotoBold]: require('../../assets/fonts/Roboto-Bold.ttf'),
        [Fonts.RobotoBoldItalic]: require('../../assets/fonts/Roboto-BoldItalic.ttf'),
        [Fonts.RobotoItalic]: require('../../assets/fonts/Roboto-Italic.ttf'),
        [Fonts.RobotoLight]: require('../../assets/fonts/Roboto-Light.ttf'),
        [Fonts.RobotoLightItalic]: require('../../assets/fonts/Roboto-LightItalic.ttf'),
        [Fonts.RobotoMedium]: require('../../assets/fonts/Roboto-Medium.ttf'),
        [Fonts.RobotoMediumItalic]: require('../../assets/fonts/Roboto-MediumItalic.ttf'),
        [Fonts.RobotoRegular]: require('../../assets/fonts/Roboto-Regular.ttf'),
        [Fonts.RobotoThin]: require('../../assets/fonts/Roboto-Thin.ttf'),
        [Fonts.RobotoThinItalic]: require('../../assets/fonts/Roboto-ThinItalic.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Fontlar yüklenene kadar boş bir bileşen döndürür
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor:'#E7FBE6',  // Sekme çubuğunun arka plan rengi 
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 2, // İkonları ve yazıları biraz yukarı taşımak için
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#821131',  // Aktif sekme rengi
        tabBarInactiveTintColor:'#E85C0D',  // Pasif sekme rengi
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontFamily: Fonts.RobotoBoldItalic,
            fontSize: 14,
            color: '#272727', // Sekme etiketi rengi
          },
          tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="animalsCategory"
        options={{
          tabBarLabel: 'Animals',
          tabBarLabelStyle: {
            fontFamily: Fonts.RobotoBoldItalic,
            fontSize: 14,
            color: '#272727',
          },
          tabBarIcon: ({ color }) => <Ionicons name="paw" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel: 'Map',
          tabBarLabelStyle: {
            fontFamily: Fonts.RobotoBoldItalic,
            fontSize: 14,
            color: '#272727',
          },
          tabBarIcon: ({ color }) => <Ionicons name="map" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontFamily: Fonts.RobotoBoldItalic,
            fontSize: 14,
            color: '#272727',
          },
          tabBarIcon: ({ color }) => <Ionicons name="people" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
