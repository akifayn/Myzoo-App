import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

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
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            selectedFilters[filter.name] ? styles.activeFilter : null,
          ]}
          onPress={() => onFilterChange(filter.name, filter.options)}
        >
          <Text>{filter.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginVertical: 10,
   // borderWidth:2
  },
  filterButton: {
    margin:3,
    backgroundColor: '#E7FBE6',
   // padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth:2,
width:100,
height:40,
flexDirection:'row',
justifyContent:'center',
alignItems:'center'
  },
  activeFilter: {
    backgroundColor: '#BFE3B4', // Aktif filtre rengi
  },
});
