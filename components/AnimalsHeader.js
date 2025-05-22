import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';

const AnimalsHeader = ({ searchTerm, onSearch, onFilterChange, selectedFilters }) => {
  return (
    <View style={styles.headerContainer}>
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
    paddingVertical: 10,
    backgroundColor: '#E7FBE6',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
});

export default AnimalsHeader;
