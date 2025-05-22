import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ searchTerm, onSearch }) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Hayvan ara..."
        value={searchTerm}
        onChangeText={onSearch} // Arama terimini geri döndürür
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 10,
  },
  searchInput: {
    height: 30,
    margin: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});
