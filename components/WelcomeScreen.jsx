import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Pressable, TextInput, Animated, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';

const WelcomeScreen = () => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // Kullanıcı adı ve şifre doğrulaması
  const handleLogin = () => {
    if (username === 'Akif' && password === '6154') {
      router.push('home');
    } else {
      Alert.alert('Hatalı giriş', 'Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require('../assets/images/Welcome_Zoo.png')}
        style={styles.bgImage}
        resizeMode="cover"
      />
      {/* Görselin üstünü karartan degrade — metin okunurluğu için */}
      <LinearGradient
        colors={['rgba(27,67,50,0.15)', 'rgba(27,67,50,0.55)', 'rgba(20,40,30,0.92)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.flexGrow}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.contentContainer}>
        <View style={styles.brandRow}>
          <Text style={styles.title}>MyZoo</Text>
          <View style={styles.titleDot} />
        </View>
        <Text style={styles.punchline}>Hayvanlar alemine giriş yapın</Text>

        {/* Kullanıcı adı */}
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={20} color={theme.colors.accent} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="rgba(255,255,255,0.55)"
            autoCapitalize="none"
          />
        </View>

        {/* Şifre */}
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.accent} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="rgba(255,255,255,0.55)"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </Pressable>
        </View>

        {/* Giriş butonu */}
        <Animated.View style={[styles.buttonWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
            style={styles.startButton}
          >
            <Text style={styles.startText}>Giriş Yap</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
          </Pressable>
        </Animated.View>

        <Text style={styles.footerNote}>Hitit Üniversitesi · Mobil Programlama Projesi</Text>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp(6),
    paddingHorizontal: wp(8),
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: hp(6.5),
    color: theme.colors.white,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1,
  },
  titleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
    marginBottom: hp(1.4),
    marginLeft: 4,
  },
  punchline: {
    fontSize: hp(1.9),
    letterSpacing: 2,
    marginBottom: hp(2),
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: hp(2),
    color: theme.colors.white,
  },
  buttonWrap: {
    width: '100%',
    marginTop: hp(1.5),
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    borderRadius: theme.radius.xl,
  },
  startText: {
    color: theme.colors.primary,
    fontSize: hp(2.3),
    fontWeight: theme.fontWeight.bold,
  },
  footerNote: {
    marginTop: hp(1.5),
    fontSize: hp(1.5),
    color: 'rgba(255,255,255,0.5)',
  },
});

export default WelcomeScreen;
