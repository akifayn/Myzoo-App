import React, { useEffect, useState,useRef  } from 'react';
import { View, Text, StyleSheet, ScrollView, Image,Linking, TouchableOpacity  } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { Ionicons } from '@expo/vector-icons';
import ZooHeader from '../../components/ZooHeader';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView import edildi
import { collection, getDocs, query } from 'firebase/firestore'; // Firestore fonksiyonlarını ekliyoruz
import { db } from '../../config/firebase'; // Firestore bağlantısını getiriyoruz
import { Fonts } from '../../assets/fonts/fontsjs';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';


export default function HomeScreen() {

  const scrollRef = useRef();

  const animalsRef = useRef(null);
  const eventsRef = useRef(null);
  const feedingRef = useRef(null);
  const contactRef = useRef(null);
  
  const [animals, setAnimals] = useState([]); // Firestore'dan veri çekmek için state
  const [announcements, setAnnouncements] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [contact,setContact] = useState([])
  const [fontsLoaded, setFontsLoaded] = useState(false);


  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        [Fonts.RobotoBlack]: require('../../assets/fonts/Roboto-Black.ttf'),
        [Fonts.RobotoBlackItalic]: require('../../assets/fonts/Roboto-BlackItalic.ttf'),
        [Fonts.RobotoBold]: require('../../assets/fonts/Roboto-Bold.ttf'),
        [Fonts.RobotoBoldItalic]: require('../../assets/fonts/Roboto-BoldItalic.ttf'),
        [Fonts.RobotoItalic]: require('../../assets/fonts/Roboto-Italic.ttf'),
        [Fonts.RobotoLight]: require('../../assets/fonts/Roboto-Light.ttf'),
        [Fonts.RobotoLightItalic]: require('../../assets/fonts/Roboto-LightItalic.ttf'),
        [Fonts.RobotoMedium]: require('../../assets/fonts/Roboto-Medium.ttf'),
        [Fonts.RobotoMediumItalic]: require('../../assets/fonts/Roboto-MediumItalic.ttf'),
        [Fonts.RobotoRegular]: require('../../assets/fonts/Roboto-Regular.ttf'),
        [Fonts.RobotoThin]: require('../../assets/fonts/Roboto-Thin.ttf'),
        [Fonts.RobotoThinItalic]: require('../../assets/fonts/Roboto-ThinItalic.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
  

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'));
        const snapshot = await getDocs(q);
        const announcementList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementList);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    const fetchCompetitions = async () => {
      try {
        const q = query(collection(db, 'competitions'));
        const snapshot = await getDocs(q);
        const competitionList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompetitions(competitionList);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchAnnouncements();
    fetchCompetitions();
  }, []);

  // Firestore'dan verileri çekmek için useEffect kullanıyoruz
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const q = query(collection(db, 'animals')); // Firestore bağlantısını kullanıyoruz
        const animalSnapshot = await getDocs(q); // Verileri çek
        const animalList = animalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnimals(animalList); // Veriyi state'e set ediyoruz
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };
    fetchAnimals(); // Verileri çek
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.homeHeaderContainer}>
          <ZooHeader style={styles.homeHeaderImage} scrollRef={scrollRef} animalsRef={animalsRef} eventsRef={eventsRef} feedingRef={feedingRef} contactRef={contactRef} />
        </View>

        {/* Diğer içerikler kaydırılabilir */}
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollViewContent} vertical showsVerticalScrollIndicator={false}>
          {/* Bugün Görebileceğiniz Hayvanlar Başlık Kısmı */}
          <View ref={animalsRef}style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Bugün Görebileceğiniz Hayvanlar</Text>
            <View style={styles.line} />
          </View>

          {/* Hayvanlar Arka Plan Rengi */}
          <View style={styles.animalsSectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {animals.length > 0 ? (
                animals.map((animal) => (
                  <Animated.View key={animal.id} entering={FadeInLeft.delay(600).duration(700)} style={styles.animalContainer}>
                    <Image source={{ uri: animal.imageUrl }} style={styles.animalImage} />
                    <Text style={styles.animalName}>{animal.name}</Text>
                  </Animated.View>
                ))
              ) : (
                <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
              )}
            </ScrollView>
          </View>

          {/* Güncel Etkinlikler Bölümü */}
          <View ref={eventsRef} style={styles.infoContainer}>
            {/* <Image source={require('../../assets/images/announcement.png')} style={styles.iconLeft} /> */}
            <Text style={styles.sectionTitle}>Güncel Etkinlikler</Text>
            <View style={styles.line1} />

            {/* Duyurular Alt Başlığı */}

            <View style={styles.subSectionTitleContainer}>
              <Image source={require('../../assets/images/announcement.png')} style={styles.iconLeft} />
              <Text style={styles.subSectionTitle}>Duyurular</Text>
            </View>
            
            <View style={styles.announcementContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {announcements.map((announcement) => (
                  <View key={announcement.id} style={styles.eventItem}>
                    <Image source={{ uri: announcement.iconUrl }} style={styles.iconImage}/>
                    <Ionicons name={announcement.icon} size={hp(3)} color={theme.colors.primary} />
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>{announcement.title}</Text>
                      <Text style={styles.eventDescription}>{announcement.description}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Yarışmalar Alt Başlığı */}
            <View style={styles.subcompetitionContainer}>
              <Image source={require('../../assets/images/competition.png')} style={styles.iconLeft} />
              <Text style={styles.subSectionTitle}>Yarışmalar</Text>
            </View>
            
            <View style={styles.competitionContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {competitions.map((competition) => (
                  <View key={competition.id} style={styles.eventItem}>
                    <Image source={{ uri: competition.iconUrl }} style={styles.iconImage}/>
                    <Ionicons name={competition.icon} size={hp(3)} color={theme.colors.primary} />
                    <View style={styles.eventTextContainer}>
                      <Text style={styles.eventTitle}>{competition.title}</Text>
                      <Text style={styles.eventDescription}>{competition.description}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>      
            {/* Beslenme Saatleri Metni */}
            <View ref={feedingRef} style={styles.feedingTimesContainer}>
              <Text style={styles.sectionTitle}>Beslenme Saatleri</Text>
              {animals.map(animal => (
                <View key={animal.id} style={styles.feedingTime}>
                  <Text  style={styles.feedingTimeText}> {animal.name}  </Text>
                  <Text>: {animal.feedingTime?.start} - {animal.feedingTime?.end}</Text>
                </View>
              ))}
            </View>
            <View ref={contactRef} style={styles.contactContainer}>
              {/* <Text style={styles.sectionTitle}>İletişim</Text> */}
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity onPress={() => handlePress('https://www.linkedin.com/in/muhammet-akif-ayan')}>
                  <FontAwesome name="linkedin-square" size={50} color="#0077B5" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('projedepom61@gmail.com')}>
                  <Ionicons name="mail" size={50} color="#D44638" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('https://github.com/akifayn')}>
                  <FontAwesome name="github-square" size={50} color="black" style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('https://www.instagram.com/akif_.ayn/')}>
                  <Ionicons name="logo-instagram" size={50} color="#C13584" style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D2B48C',
  },
  container: {
    flex: 1,
  },
  homeHeaderContainer: {
    alignItems: 'center',
    backgroundColor: '#E7FBE6',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  homeHeaderImage: {
    width: wp(100),
    height: hp(20),
  },
  sectionTitleContainer: {
    padding: 10,
  },
  sectionTitle: {
    marginBottom:15,
    fontSize: hp(3),
    fontWeight: theme.fontWeight.medium,
    fontFamily: Fonts.RobotoBoldItalic,
  },
  line: {
    height: 2,                    
    backgroundColor: '#000',        
    marginHorizontal: 8,           
    shadowColor: '#000',            
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,             
    shadowRadius: 4,               
    elevation: 3,                   
    marginBottom: 10,               
  },
  line1:{
    height: 2,                    
    backgroundColor: '#000',        
   // marginRight: 100,                      
    shadowColor: '#000',            
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,             
    shadowRadius: 4,               
    elevation: 3,                   
    marginBottom: 10,       
  },
  subSectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    alignItems:'center',
    justifyContent:'center',
  },
  animalsSectionContainer: {
    backgroundColor: '#FFF8D1',
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 7,
  },
  animalContainer: {
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
  },
  animalImage: {
    width: wp(32),
    height: hp(16),
    //borderRadius: 10,
    resizeMode:'stretch'
  },
  animalName: {
    marginTop: 5,
    fontSize: hp(2),
    fontWeight: theme.fontWeight.medium,
  },
  loadingText: {
    fontSize: hp(2.5),
    color: theme.colors.primary,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  iconLeft:{
    width: wp(15),
    height: hp(8),
  },
  subcompetitionContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  //  alignItems:'center',
    //justifyContent:'start',
  },
  subSectionTitle: {
    fontSize: hp(2.5),
    fontFamily: Fonts.RobotoBoldItalic,
    //marginBottom: 10,
    color: theme.colors.primary,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 10,
    
  },
  iconImage:{
    width: wp(24),
    height: hp(11),
    borderRadius: 10,
    resizeMode:'stretch'
    
  },
  eventTextContainer: {
    marginLeft: 10,

  },
  eventTitle: {
    fontSize: hp(2.5),
    fontFamily: Fonts.RobotoBoldItalic,

  },
  eventDescription: {
    fontSize: hp(2),
    color: theme.colors.grey,
    fontFamily: Fonts.RobotoItalic,
  },
  announcementContainer: {
    backgroundColor: '#FFF8D1',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  competitionContainer: {
    backgroundColor: '#FFF8D1',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#272727',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feedingTimesContainer: {

    backgroundColor: '#FFF8D1', // Hardal sarısı arka plan
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom:20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,  
    },
  },
  contactContainer: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,             
    backgroundColor: '#FFF8D1',
    borderRadius: 10,          
    margin: 6,                  
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.3,         
      shadowRadius: 5,            
      elevation: 5,              
  },
  socialIconsContainer:{
    flexDirection:'row',

  },
  socialIcon:{
    marginRight:5
  },
  scrollViewContent: {
    paddingBottom: 30, 
  },
  feedingTime: {
   
  
    flexDirection:'row',
    justifyContent:"space-between",
   
  
  },
  feedingTimeText: {
    fontSize: hp(2),
    color: theme.colors.darkGrey,
    marginBottom: 5,
    
    
  
  },
});
