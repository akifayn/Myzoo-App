import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Pressable, TextInput, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';

const WelcomeScreen = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Butonun başlangıç boyutu
  const [username, setUsername] = useState(''); // Kullanıcı adı durumu
  const [password, setPassword] = useState(''); // Şifre durumu

  // Basıldığında küçültme ve bırakıldığında geri büyütme animasyonu
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Kullanıcı adı ve şifre doğrulaması
  const handleLogin = () => {
    if (username === 'Akif' && password === '6154') {
      router.push('home'); // Home ekranına yönlendir
    } else {
      Alert.alert('Hatalı giriş', 'Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <Image
        source={require('../assets/images/Welcome_Zoo.png')}
        style={styles.bgImage}
        resizeMode='cover'
      />
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>MyZoo</Text>
          <Text style={styles.punchline}>Hayvanlar alemine giriş yapın</Text>

          {/* Kullanıcı adı ve şifre giriş alanları */}
          <TextInput
            style={[styles.input, { color: theme.colors.white }]}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={theme.colors.white}
          />
          <TextInput
          
            style={[styles.input, { color: theme.colors.white }]}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholderTextColor={theme.colors.white}
          />

          {/* Animated Giriş Butonu */}
          <Animated.View style={[styles.startButtons, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
              onPressIn={handlePressIn} // Butona basınca küçült
              onPressOut={handlePressOut} // Bırakılınca büyüt
              onPress={handleLogin} // Kullanıcı adı ve şifre kontrolü
              style={styles.startButtonE}
            >
              <Text style={styles.startTextE}>Giriş Yap</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  gradient: {
    width: wp(100),
    height: hp(25),
    bottom: 0,
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeight.bold,
  },
  punchline: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: theme.fontWeight.medium,
  },
  input: {
    width: wp(80),
    padding: 10,
    marginVertical: 5,
    backgroundColor:theme.colors.neutral(0.9),
    borderRadius: 12,
    borderColor: theme.colors.neutral(0.6),
    borderWidth: 1,
    fontSize: hp(2),  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
    
  },
  startButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  startButtonE: {
    marginBottom: 20,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  startTextE: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: theme.fontWeight.medium,
  },
});

export default WelcomeScreen;
