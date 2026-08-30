import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '../helpers/common';
import { theme } from '../constants/theme';
import { Fonts } from '../assets/fonts/fontsjs';

// Öznitelik rozetleri: hayvanın önemli özelliklerini çipler halinde gösterir
function TraitBadges({ animal }) {
  const traits = [];
  if (animal.habitat) traits.push({ icon: 'leaf-outline', label: animal.habitat });
  if (animal.diet) traits.push({ icon: 'restaurant-outline', label: animal.diet });
  if (animal.isPredator) traits.push({ icon: 'flash-outline', label: 'Avcı' });
  if (animal.isNocturnal) traits.push({ icon: 'moon-outline', label: 'Gececi' });
  if (animal.isEndangered) traits.push({ icon: 'warning-outline', label: 'Nesli Tehlikede' });

  if (traits.length === 0) return null;

  return (
    <View style={styles.badgeRow}>
      {traits.slice(0, 3).map((trait) => (
        <View key={trait.label} style={styles.badge}>
          <Ionicons name={trait.icon} size={11} color={theme.colors.primary} />
          <Text style={styles.badgeText} numberOfLines={1}>{trait.label}</Text>
        </View>
      ))}
    </View>
  );
}

const AnimalGroupAccordion = ({ groupName, animals }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.groupHeader} onPress={toggleAccordion} activeOpacity={0.8}>
        <View style={styles.groupTitleRow}>
          <View style={styles.pawBadge}>
            <Ionicons name="paw" size={14} color={theme.colors.accent} />
          </View>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.inkSoft}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.groupContent}>
          {animals.map((animal) => (
            <View key={animal.id} style={styles.animalItem}>
              <Image source={{ uri: animal.imageUrl }} style={styles.animalImage} />
              <View style={styles.animalInfo}>
                <Text style={styles.animalName}>{animal.name}</Text>
                {animal.age ? (
                  <Text style={styles.animalAge}>{animal.age} yaşında</Text>
                ) : null}
                <TraitBadges animal={animal} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.lg,
    ...theme.shadowSoft,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pawBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 16,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  groupContent: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: 10,
    borderRadius: theme.radius.lg,
    marginTop: 6,
    gap: 8,
  },
  animalItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 8,
    gap: 10,
    ...theme.shadowSoft,
  },
  animalImage: {
    width: wp(22),
    height: wp(22),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.bg,
  },
  animalInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  animalName: {
    fontSize: hp(1.9),
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  animalAge: {
    fontSize: hp(1.5),
    color: theme.colors.inkSoft,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});

export default AnimalGroupAccordion;
