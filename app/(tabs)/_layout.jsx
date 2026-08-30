import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '../../assets/fonts/fontsjs';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const insets = useSafeAreaInsets(); // sistem tuş çubuğu yüksekliği

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
    return null;
  }

  const screens = [
    { name: 'home', label: 'Ana Sayfa', icon: 'home', iconOutline: 'home-outline' },
    { name: 'animalsCategory', label: 'Hayvanlar', icon: 'paw', iconOutline: 'paw-outline' },
    { name: 'map', label: 'Harita', icon: 'map', iconOutline: 'map-outline' },
    { name: 'profile', label: 'Profil', icon: 'person', iconOutline: 'person-outline' },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          height: 58 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          position: 'absolute',
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarLabelStyle: {
          fontFamily: Fonts.RobotoMedium,
          fontSize: 11,
        },
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarLabel: screen.label,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? screen.icon : screen.iconOutline} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
