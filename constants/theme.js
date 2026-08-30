//TEMA — MyZoo tasarım sistemi
// Palet: koyu orman yeşili + sıcak kum + amber vurgu

export const theme = {
  colors: {
    // Ana palet
    primary: '#1B4332',      // koyu orman yeşili — başlıklar, tab bar
    primaryLight: '#2D6A4F', // açık orman yeşili — ikincil yüzeyler
    accent: '#E9A319',       // amber — vurgu, aktif durumlar, butonlar
    accentSoft: '#FBEDD3',   // amber'in çok açık tonu — rozet arka planı

    // Zemin ve yüzeyler
    bg: '#F4F1E9',           // sıcak kum — ekran arka planı
    surface: '#FFFFFF',      // kartlar
    surfaceAlt: '#EAF2EC',   // yeşilimsi açık yüzey — bölüm blokları

    // Metin
    ink: '#1D2A23',          // ana metin
    inkSoft: '#5C6B62',      // ikincil metin
    inkFaint: '#93A099',     // ipucu / placeholder

    // Durum
    danger: '#C1442E',
    success: '#2D8A4E',
    water: '#7FB6D9',        // harita su alanları

    // Geriye dönük uyumluluk
    white: '#fff',
    black: '#000',
    grayBG: '#e5e5e5',
    neutral: (opacity) => `rgba(10,10,10,${opacity})`,
  },
  fontWeight: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    full: 999,
  },
  // Standart kart gölgesi (iOS + Android)
  shadow: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowSoft: {
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};
