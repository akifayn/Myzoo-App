import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function SearchBar({ searchTerm, onSearch }) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={18} color={theme.colors.inkFaint} style={styles.icon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Hayvan ara..."
        placeholderTextColor={theme.colors.inkFaint}
        value={searchTerm}
        onChangeText={onSearch}
      />
      {searchTerm ? (
        <Ionicons
          name="close-circle"
          size={18}
          color={theme.colors.inkFaint}
          onPress={() => onSearch('')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    ...theme.shadowSoft,
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: theme.colors.ink,
  },
});
