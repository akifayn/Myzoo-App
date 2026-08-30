import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import { theme } from '../constants/theme';
import { Fonts } from '../assets/fonts/fontsjs';

const AnimalsHeader = ({ searchTerm, onSearch, onFilterChange, selectedFilters }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Hayvanlar</Text>
      <Text style={styles.subtitle}>Bahçemizdeki tüm dostlarımızı keşfedin</Text>

      {/* Arama Çubuğu */}
      <SearchBar searchTerm={searchTerm} onSearch={onSearch} />

      {/* Filtre Butonları */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <FilterButton onFilterChange={onFilterChange} selectedFilters={selectedFilters} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: theme.colors.bg,
  },
  title: {
    fontSize: 26,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    fontFamily: Fonts.RobotoRegular,
    paddingHorizontal: 16,
    marginTop: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
});

export default AnimalsHeader;
