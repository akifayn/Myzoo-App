import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { ProgressBar } from 'react-native-paper'; // İsteğe bağlı: react-native-paper veya başka bir progress bar kütüphanesi kullanabilirsiniz

export default function FeedingTime({ startTime, endTime }) {
  const [currentTime, setCurrentTime] = useState(0); // Saatin simüle edilmesi
  const [progress, setProgress] = useState(0);

  // 1 saniyede 1 saat ilerleyen bir saat fonksiyonu
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prevTime => (prevTime + 1) % 24); // 24 saat döngüsü
    }, 1000); // 1 saniye = 1 saat

    return () => clearInterval(interval);
  }, []);

  // Barın durumunu hesapla
  useEffect(() => {
    if (currentTime >= startTime && currentTime < endTime) {
      setProgress(1);
    } else if (currentTime < startTime) {
      setProgress(currentTime / startTime);
    } else {
      setProgress(0);
    }
  }, [currentTime, startTime, endTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beslenme Saati: {startTime}:00 - {endTime}:00</Text>
      <ProgressBar
        progress={progress}
        color={currentTime >= startTime && currentTime < endTime ? theme.colors.red : theme.colors.green}
        style={styles.progressBar}
      />
      <Text style={styles.timeDisplay}>Şu anki zaman: {currentTime}:00</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.lightGrey,
  },
  timeDisplay: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.grey,
  }
});
