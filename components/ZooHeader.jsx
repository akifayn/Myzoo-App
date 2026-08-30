import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Fonts } from '../assets/fonts/fontsjs';
import { theme } from '../constants/theme';

const MENU_ITEMS = [
  { key: 'animals', label: 'Bugün Görebileceğiniz Hayvanlar', icon: 'paw-outline' },
  { key: 'events', label: 'Güncel Etkinlikler', icon: 'calendar-outline' },
  { key: 'feeding', label: 'Beslenme Saatleri', icon: 'restaurant-outline' },
  { key: 'contact', label: 'İletişim', icon: 'chatbubbles-outline' },
];

export default function ZooHeader({ scrollRef, animalsRef, eventsRef, feedingRef, contactRef }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const translateX = useSharedValue(280);

  useEffect(() => {
    if (menuVisible) {
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(280, { duration: 300 });
    }
  }, [menuVisible, translateX]);

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

    const refs = {
      animals: animalsRef,
      events: eventsRef,
      feeding: feedingRef,
      contact: contactRef,
    };
    const targetRef = refs[section];
    targetRef?.current?.measureLayout(scrollRef.current, (x, y) => {
      scrollRef.current?.scrollTo({ y: y - 10, animated: true });
    });
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/zoo-header.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.welcomeSmall}>Hoş geldiniz 👋</Text>
          <Text style={styles.welcomeText}>MyZoo</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menü</Text>
              <Pressable onPress={() => setMenuVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color={theme.colors.white} />
              </Pressable>
            </View>

            {MENU_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => navigateToSection(item.key)}
                style={({ pressed }) => [styles.menuItemContainer, pressed && styles.menuItemPressed]}
              >
                <View style={styles.menuIconBadge}>
                  <Ionicons name={item.icon} size={18} color={theme.colors.accent} />
                </View>
                <Text style={styles.menuItem}>{item.label}</Text>
              </Pressable>
            ))}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.bg,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  welcomeSmall: {
    fontSize: 12,
    color: theme.colors.inkSoft,
    fontFamily: Fonts.RobotoRegular,
  },
  welcomeText: {
    fontSize: 18,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadowSoft,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'flex-end',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingHorizontal: 18,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 22,
    color: theme.colors.white,
    fontFamily: Fonts.RobotoBold,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: theme.radius.md,
    marginBottom: 4,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.white,
    fontFamily: Fonts.RobotoMedium,
  },
});
