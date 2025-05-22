import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { hp, wp } from '../helpers/common';


const AnimalGroupAccordion = ({ groupName, animals }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View>
      <TouchableOpacity style={styles.groupHeader} onPress={toggleAccordion}>
        <Text style={styles.groupName}>{groupName}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.groupContent}>
          {animals.map((animal) => (
            <View key={animal.id} style={styles.animalItem}>
              <Image source={{ uri: animal.imageUrl }} style={styles.imageUrl}/>
              <View style={styles.animalSec}>

              <Text style={styles.animalName}>{animal.name}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8D1',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 7,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupContent: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 7,
  },
  animalItem: {
    backgroundColor: '#F5F5F5',
    paddingVertical:3,
    paddingHorizontal:4,
   // padding: 10,
    //marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 7,
    flexDirection:'row',
    justifyContent:'space-between'

  },
  animalSec:{
    marginHorizontal:4,
    width:240,
borderWidth:3,
flexDirection:'row',
borderRadius:10
   // justifyContent:'space-between'
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
    alignItems:'center',
    textAlign:'center'
  },
  imageUrl:{
    alignItems:'flex-end',
    width: wp(24),
    height: hp(10),
    borderRadius: 10,
  },
});

export default AnimalGroupAccordion;
