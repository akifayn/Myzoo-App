import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ZooHeader from '../../components/ZooHeader';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Fonts } from '../../assets/fonts/fontsjs';

// Bölüm başlığı: ikon rozeti + başlık
function SectionTitle({ icon, title, innerRef }) {
  return (
    <View ref={innerRef} style={styles.sectionTitleRow}>
      <View style={styles.sectionIconBadge}>
        <Ionicons name={icon} size={16} color={theme.colors.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const scrollRef = useRef();

  const animalsRef = useRef(null);
  const eventsRef = useRef(null);
  const feedingRef = useRef(null);
  const contactRef = useRef(null);

  const [animals, setAnimals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [competitions, setCompetitions] = useState([]);

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
        console.error('Error fetching announcements:', error);
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
        console.error('Error fetching competitions:', error);
      }
    };

    fetchAnnouncements();
    fetchCompetitions();
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const q = query(collection(db, 'animals'));
        const animalSnapshot = await getDocs(q);
        const animalList = animalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnimals(animalList);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };
    fetchAnimals();
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ZooHeader
          scrollRef={scrollRef}
          animalsRef={animalsRef}
          eventsRef={eventsRef}
          feedingRef={feedingRef}
          contactRef={contactRef}
        />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Bugün Görebileceğiniz Hayvanlar */}
          <SectionTitle innerRef={animalsRef} icon="paw" title="Bugün Görebileceğiniz Hayvanlar" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.animalsRow}
          >
            {animals.length > 0 ? (
              animals.map((animal, index) => (
                <Animated.View
                  key={animal.id}
                  entering={FadeInLeft.delay(150 * index).duration(500)}
                  style={styles.animalCard}
                >
                  <Image source={{ uri: animal.imageUrl }} style={styles.animalImage} />
                  <View style={styles.animalNameBar}>
                    <Text style={styles.animalName} numberOfLines={1}>{animal.name}</Text>
                  </View>
                </Animated.View>
              ))
            ) : (
              <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
            )}
          </ScrollView>

          {/* Güncel Etkinlikler */}
          <SectionTitle innerRef={eventsRef} icon="calendar" title="Güncel Etkinlikler" />

          <Text style={styles.subSectionTitle}>Duyurular</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsRow}
          >
            {announcements.map((announcement) => (
              <View key={announcement.id} style={styles.eventCard}>
                <Image source={{ uri: announcement.iconUrl }} style={styles.eventImage} />
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{announcement.title}</Text>
                  <Text style={styles.eventDescription} numberOfLines={3}>{announcement.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.subSectionTitle}>Yarışmalar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsRow}
          >
            {competitions.map((competition) => (
              <View key={competition.id} style={styles.eventCard}>
                <Image source={{ uri: competition.iconUrl }} style={styles.eventImage} />
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{competition.title}</Text>
                  <Text style={styles.eventDescription} numberOfLines={3}>{competition.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Beslenme Saatleri */}
          <SectionTitle innerRef={feedingRef} icon="restaurant" title="Beslenme Saatleri" />
          <View style={styles.feedingCard}>
            {animals.map((animal, index) => (
              <View
                key={animal.id}
                style={[styles.feedingRow, index < animals.length - 1 && styles.feedingRowBorder]}
              >
                <Text style={styles.feedingName}>{animal.name}</Text>
                <View style={styles.feedingTimePill}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
                  <Text style={styles.feedingTimeText}>
                    {animal.feedingTime?.start || '—'} – {animal.feedingTime?.end || '—'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* İletişim */}
          <View ref={contactRef} style={styles.contactCard}>
            <Text style={styles.contactTitle}>Bize Ulaşın</Text>
            <View style={styles.socialIconsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handlePress('https://www.linkedin.com/in/muhammet-akif-ayan')}
              >
                <FontAwesome name="linkedin" size={22} color={theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handlePress('mailto:projedepom61@gmail.com')}
              >
                <Ionicons name="mail" size={22} color={theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handlePress('https://github.com/akifayn')}
              >
                <FontAwesome name="github" size={22} color={theme.colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handlePress('https://www.instagram.com/akif_.ayn/')}
              >
                <Ionicons name="logo-instagram" size={22} color={theme.colors.white} />
              </TouchableOpacity>
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
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 130, // tab bar + sistem tuşlarının altında içerik kalmasın
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: hp(2.4),
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
    flexShrink: 1,
  },
  subSectionTitle: {
    fontSize: hp(1.9),
    color: theme.colors.inkSoft,
    fontFamily: Fonts.RobotoMedium,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  animalsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  animalCard: {
    width: wp(34),
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.shadow,
  },
  animalImage: {
    width: '100%',
    height: hp(14),
    resizeMode: 'cover',
  },
  animalNameBar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surface,
  },
  animalName: {
    fontSize: hp(1.8),
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: hp(2),
    color: theme.colors.inkSoft,
    padding: 16,
  },
  eventsRow: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 10,
  },
  eventCard: {
    flexDirection: 'row',
    width: wp(72),
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 10,
    gap: 10,
    ...theme.shadowSoft,
  },
  eventImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: theme.radius.sm,
    resizeMode: 'cover',
    backgroundColor: theme.colors.surfaceAlt,
  },
  eventTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: hp(1.9),
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
    marginBottom: 3,
  },
  eventDescription: {
    fontSize: hp(1.6),
    lineHeight: hp(2.1),
    color: theme.colors.inkSoft,
    fontFamily: Fonts.RobotoRegular,
  },
  feedingCard: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    ...theme.shadowSoft,
  },
  feedingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  feedingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  feedingName: {
    fontSize: hp(1.9),
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoMedium,
  },
  feedingTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  feedingTimeText: {
    fontSize: hp(1.6),
    color: theme.colors.primary,
    fontFamily: Fonts.RobotoMedium,
  },
  contactCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    padding: 20,
    alignItems: 'center',
    ...theme.shadow,
  },
  contactTitle: {
    fontSize: hp(2.1),
    color: theme.colors.white,
    fontFamily: Fonts.RobotoBold,
    marginBottom: 14,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  socialButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
