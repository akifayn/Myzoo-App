import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { theme } from '../constants/theme';

export default function FilterButton({ onFilterChange, selectedFilters }) {
  const [filters, setFilters] = useState([]);

  // Firebase'den filtreleri çekiyoruz
  useEffect(() => {
    const fetchFilters = async () => {
      const querySnapshot = await getDocs(collection(db, 'filters'));
      const filtersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        options: doc.data().options,
      }));
      setFilters(filtersList);
    };

    fetchFilters();
  }, []);

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => {
        const active = !!selectedFilters[filter.name];
        return (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterButton, active && styles.activeFilter]}
            onPress={() => onFilterChange(filter.name, filter.options)}
          >
            {active && <Ionicons name="checkmark" size={14} color={theme.colors.white} />}
            <Text style={[styles.filterText, active && styles.activeFilterText]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(27,67,50,0.15)',
  },
  activeFilter: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: theme.colors.ink,
    fontWeight: theme.fontWeight.medium,
  },
  activeFilterText: {
    color: theme.colors.white,
  },
});
