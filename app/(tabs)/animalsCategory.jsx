import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AnimalsHeader from '../../components/AnimalsHeader';
import AnimalGroupAccordion from '../../components/AnimalGroupAccordion';

export default function AnimalsCategory() {
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi
  const [animals, setAnimals] = useState([]); // Tüm hayvanlar
  const [filteredAnimals, setFilteredAnimals] = useState([]); // Filtrelenmiş hayvanlar
  const [selectedFilters, setSelectedFilters] = useState({}); // Seçilen filtreler
  const [groupedAnimals, setGroupedAnimals] = useState({}); // Gruplandırılmış hayvanlar

  // Firebase'den hayvanları çekme
  useEffect(() => {
    const fetchAnimals = async () => {
      const querySnapshot = await getDocs(collection(db, 'animalCatalog'));
      const animalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAnimals(animalsList);
      setFilteredAnimals(animalsList); // Başlangıçta tüm hayvanlar gösteriliyor
      groupAnimals(animalsList); // Gruplama işlemi
    };

    fetchAnimals();
  }, []);

  // Hayvanları isme göre gruplama
  const groupAnimals = (animalList) => {
    const grouped = animalList.reduce((acc, animal) => {
      const groupName = animal.name; // Hayvanın adı ile grupluyoruz
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(animal);
      return acc;
    }, {});

    setGroupedAnimals(grouped);
  };

  // Arama ve filtreleme işlemini yapma
  const filterAnimals = (search, filters) => {
    let updatedAnimals = animals;

    // Seçilen filtreleri uygulama
    Object.keys(filters).forEach((filterKey) => {
      const filterValue = filters[filterKey];
      updatedAnimals = updatedAnimals.filter((animal) =>
        Object.keys(filterValue).every((key) => animal[key] === filterValue[key])
      );
    });

    // Arama çubuğuna göre filtreleme
    if (search) {
      updatedAnimals = updatedAnimals.filter((animal) =>
        animal.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredAnimals(updatedAnimals); // Filtrelenmiş hayvanları ayarla
    groupAnimals(updatedAnimals); // Gruplama işlemi
  };

  // Arama terimi değiştiğinde çalışır
  const handleSearchChange = (text) => {
    setSearchTerm(text);
    filterAnimals(text, selectedFilters); // Arama ve filtreleme işlemi
  };

  // Filtre değiştirildiğinde çalışır
  const handleFilterChange = (filterName, filterOptions) => {
    const newFilters = { ...selectedFilters };

    // Filtre aktifse kaldır, değilse ekle
    if (selectedFilters[filterName]) {
      delete newFilters[filterName];
    } else {
      newFilters[filterName] = filterOptions;
    }

    setSelectedFilters(newFilters);
    filterAnimals(searchTerm, newFilters); // Filtreleri uygula
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Dinamik filtreleme ve arama çubuğu */}
      
      <AnimalsHeader
        searchTerm={searchTerm}
        onSearch={handleSearchChange}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
      />

      {/* Filtrelenmiş hayvanları gruplu listeleme */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {Object.keys(groupedAnimals).map((groupName) => (
          <AnimalGroupAccordion
            key={groupName}
            groupName={groupName}
            animals={groupedAnimals[groupName]}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D2B48C', // HomeScreen'deki arka plan rengiyle aynı
  },
  scrollContainer: {
    flex:1,
    padding: 16,
  },
  contentContainer: {
    flexGrow: 1,  // İçeriğin büyümesi ve kaydırılabilir olması
    paddingBottom: 50,  // Alt kısımda ekstra boşluk bırakmak için
  },
});
