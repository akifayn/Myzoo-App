import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  const [location, setLocation] = useState(null); // Kullanıcı konumu

  useEffect(() => {
    (async () => {
      // Konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Verilmedi', 'Konum erişimi iznine ihtiyacımız var.');
        return;
      }

      // Kullanıcı konumunu al
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location} // Kullanıcının konumunu başlangıç noktası olarak ayarla
          showsUserLocation={true} // Kullanıcı konumunu göster
        >
          {/* Kullanıcının konumu üzerine bir Marker ekleyin */}
          <Marker
            coordinate={location}
            title="Şu Anki Konumunuz"
            description="Buradasınız"
          />
        </MapView>
      ) : (
        <Text>Konum Alınıyor...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
