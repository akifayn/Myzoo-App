import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
      />  
      <Stack.Screen 
        name="(tabs)" 
        options={{
          contentStyle: styles.screenBackground, // Tab ekranı için de aynı arka plan stili
        }} 
      />  
    </Stack>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    backgroundColor: '#D2B48C', // Burada arka plan rengini tanımlıyoruz (Açık kahverengi)
  },
});
