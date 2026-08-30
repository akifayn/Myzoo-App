import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Ellipse, Line, Polyline, Text as SvgText, G } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { theme } from '../../constants/theme';
import { Fonts } from '../../assets/fonts/fontsjs';
import {
  MAP_W, MAP_H, ZONES, NODES, EDGES, ENCLOSURES, FALLBACK_SPOTS,
  FACILITIES, LAKE, TREES, normalizeName, buildRoute,
} from '../../constants/zooMap';

const SCREEN_W = Dimensions.get('window').width;
const SVG_W = SCREEN_W;
const SVG_H = SCREEN_W * (MAP_H / MAP_W);
const PX_TO_MAP = MAP_W / SVG_W; // ekran pikselini viewBox birimine çevirir

const ENTRANCE = { x: 500, y: 1240 };

export default function Map() {
  const insets = useSafeAreaInsets();
  const [animals, setAnimals] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [userPos, setUserPos] = useState(ENTRANCE);
  const [route, setRoute] = useState(null);
  const [locationMode, setLocationMode] = useState(false);
  const [search, setSearch] = useState('');
  const [viewport, setViewport] = useState({ w: SCREEN_W, h: SVG_H });

  // ── Veri: iki koleksiyonu ada göre birleştir ─────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catalogSnap, animalsSnap] = await Promise.all([
          getDocs(collection(db, 'animalCatalog')),
          getDocs(collection(db, 'animals')),
        ]);

        const merged = {};
        catalogSnap.docs.forEach((doc) => {
          const data = doc.data();
          const key = normalizeName(data.name);
          if (!merged[key]) merged[key] = { key, ...data };
        });
        animalsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const key = normalizeName(data.name);
          merged[key] = { ...(merged[key] || { key }), ...data, key };
        });

        // Harita konumu ata (haritada tanımı olmayanlara yedek nokta)
        let fallbackIndex = 0;
        const list = Object.values(merged).map((animal) => {
          const spot = ENCLOSURES[animal.key];
          if (spot) return { ...animal, ...spot };
          const fb = FALLBACK_SPOTS[fallbackIndex % FALLBACK_SPOTS.length];
          fallbackIndex += 1;
          return { ...animal, ...fb };
        });
        setAnimals(list);
      } catch (error) {
        console.error('Error fetching map animals:', error);
      }
    };
    fetchAll();
  }, []);

  const selected = useMemo(
    () => animals.find((a) => a.key === selectedKey) || null,
    [animals, selectedKey]
  );

  const suggestions = useMemo(() => {
    const term = normalizeName(search);
    if (!term) return [];
    return animals.filter((a) => a.key.includes(term)).slice(0, 5);
  }, [search, animals]);

  // ── Etkileşimler ─────────────────────────────────────────────────────────
  const handleSelectAnimal = (animal) => {
    setSelectedKey(animal.key);
    setSearch('');
    setRoute(null);
  };

  // ── Yakınlaştırma / kaydırma ─────────────────────────────────────────────
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(next, 1), 3.5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .maxPointers(2)
    .onUpdate((e) => {
      const limitX = (SVG_W * (scale.value - 1)) / 2 + 60;
      const limitY = (SVG_H * (scale.value - 1)) / 2 + 120;
      tx.value = Math.min(Math.max(savedTx.value + e.translationX, -limitX), limitX);
      ty.value = Math.min(Math.max(savedTy.value + e.translationY, -limitY), limitY);
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  // Viewport dokunuşunu harita (viewBox) koordinatına çevirir:
  // harita görünümü viewport'ta ortalanır, transform = translate + merkez odaklı scale
  // NOT: Bu fonksiyon tap gesture'ından ÖNCE tanımlanmalı; worklet closure'ı
  // tanım anında yakalanır, sonradan tanımlanan fonksiyon undefined kalır.
  const handleMapTap = (px, py) => {
    const s = scale.value;
    const cx = viewport.w / 2 + tx.value;
    const cy = viewport.h / 2 + ty.value;
    const qx = (px - cx) / s + SVG_W / 2;
    const qy = (py - cy) / s + SVG_H / 2;
    const mapX = qx * PX_TO_MAP;
    const mapY = qy * PX_TO_MAP;

    // Önce hayvan işaretçisine isabet var mı bak (yarıçap: harita birimi)
    let hit = null;
    let hitDist = 45;
    animals.forEach((animal) => {
      const d = Math.hypot(animal.x - mapX, animal.y - mapY);
      if (d < hitDist) {
        hit = animal;
        hitDist = d;
      }
    });

    if (hit) {
      handleSelectAnimal(hit);
      return;
    }

    // İşaretçi yoksa ve konum modundaysak: kullanıcı konumunu taşı
    if (locationMode && mapX >= 0 && mapX <= MAP_W && mapY >= 0 && mapY <= MAP_H) {
      setUserPos({ x: mapX, y: mapY });
      setLocationMode(false);
      setRoute(null);
    }
  };

  const tap = Gesture.Tap()
    .maxDistance(15)
    .onEnd((e) => {
      runOnJS(handleMapTap)(e.x, e.y);
    });

  const composed = Gesture.Race(tap, Gesture.Simultaneous(pinch, pan));

  const mapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  const handleDrawRoute = () => {
    if (!selected) return;
    const result = buildRoute(userPos, selected);
    if (result) setRoute(result);
  };

  const routePointsStr = useMemo(() => {
    if (!route) return '';
    return route.points.map((p) => `${p.x},${p.y}`).join(' ');
  }, [route]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Harita */}
      <GestureDetector gesture={composed}>
        <View
          style={styles.mapViewport}
          collapsable={false}
          onLayout={(e) => setViewport({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })}
        >
          <Animated.View style={[styles.mapContainer, mapStyle]}>
            <Svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
              {/* Zemin */}
              <Rect
                x="0" y="0" width={MAP_W} height={MAP_H}
                fill="#F0EADB"
              />

              {/* Bölgeler */}
              {ZONES.map((zone) => (
                <G key={zone.id}>
                  <Rect
                    x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                    rx={28}
                    fill={zone.fill}
                    stroke={zone.stroke}
                    strokeWidth={2.5}
                    strokeDasharray="10 6"
                  />
                  <SvgText
                    x={zone.x + 18}
                    y={zone.y + 32}
                    fontSize="20"
                    fontWeight="bold"
                    fill={zone.stroke}
                  >
                    {zone.name.toUpperCase()}
                  </SvgText>
                </G>
              ))}

              {/* Yürüyüş yolları (çift katman: kenar + iç dolgu) */}
              {EDGES.map(([a, b]) => (
                <Line
                  key={`c-${a}-${b}`}
                  x1={NODES[a].x} y1={NODES[a].y}
                  x2={NODES[b].x} y2={NODES[b].y}
                  stroke="#CBBFA6" strokeWidth={26} strokeLinecap="round"
                />
              ))}
              {EDGES.map(([a, b]) => (
                <Line
                  key={`p-${a}-${b}`}
                  x1={NODES[a].x} y1={NODES[a].y}
                  x2={NODES[b].x} y2={NODES[b].y}
                  stroke="#EFE7D2" strokeWidth={18} strokeLinecap="round"
                />
              ))}

              {/* Göl */}
              <Ellipse
                cx={LAKE.cx} cy={LAKE.cy} rx={LAKE.rx} ry={LAKE.ry}
                fill={theme.colors.water} stroke="#5E9DC4" strokeWidth={3}
              />
              <SvgText x={LAKE.cx} y={LAKE.cy + 6} fontSize="18" textAnchor="middle" fill="#2C5A78">
                Göl
              </SvgText>

              {/* Ağaçlar */}
              {TREES.map((tree, i) => (
                <SvgText key={i} x={tree.x} y={tree.y} fontSize="24" textAnchor="middle">
                  🌳
                </SvgText>
              ))}

              {/* Rota */}
              {route && (
                <>
                  <Polyline
                    points={routePointsStr}
                    fill="none"
                    stroke={theme.colors.accent}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="16 12"
                  />
                  <SvgText
                    x={route.points[route.points.length - 1].x}
                    y={route.points[route.points.length - 1].y - 34}
                    fontSize="26"
                    textAnchor="middle"
                  >
                    🚩
                  </SvgText>
                </>
              )}

              {/* Tesisler */}
              {FACILITIES.map((f) => (
                <G key={f.name}>
                  <Circle cx={f.x} cy={f.y} r={18} fill="#FFFFFF" stroke="#C9BCA4" strokeWidth={2} />
                  <SvgText x={f.x} y={f.y + 7} fontSize="18" textAnchor="middle">{f.icon}</SvgText>
                  <SvgText x={f.x} y={f.y + 38} fontSize="13" textAnchor="middle" fill="#8A7F68">
                    {f.name}
                  </SvgText>
                </G>
              ))}

              {/* Hayvanlar */}
              {animals.map((animal) => {
                const isSelected = animal.key === selectedKey;
                return (
                  <G key={animal.key}>
                    {isSelected && (
                      <Circle
                        cx={animal.x} cy={animal.y} r={30}
                        fill="rgba(233,163,25,0.25)"
                        stroke={theme.colors.accent}
                        strokeWidth={3}
                      />
                    )}
                    <Circle
                      cx={animal.x} cy={animal.y} r={22}
                      fill="#FFFFFF"
                      stroke={isSelected ? theme.colors.accent : theme.colors.primary}
                      strokeWidth={isSelected ? 3.5 : 2.5}
                    />
                    <SvgText x={animal.x} y={animal.y + 9} fontSize="24" textAnchor="middle">
                      {animal.emoji}
                    </SvgText>
                    <SvgText
                      x={animal.x} y={animal.y + 42}
                      fontSize="14" fontWeight="bold"
                      textAnchor="middle" fill={theme.colors.ink}
                    >
                      {animal.name}
                    </SvgText>
                  </G>
                );
              })}

              {/* Kullanıcı konumu */}
              <G>
                <Circle cx={userPos.x} cy={userPos.y} r={20} fill="rgba(35,120,220,0.2)" />
                <Circle
                  cx={userPos.x} cy={userPos.y} r={10}
                  fill="#2378DC" stroke="#FFFFFF" strokeWidth={3.5}
                />
                <SvgText
                  x={userPos.x} y={userPos.y - 26}
                  fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2378DC"
                >
                  Buradasınız
                </SvgText>
              </G>
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Arama çubuğu */}
      <View style={styles.searchOverlay}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.inkFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Hayvan ara ve rotanı çiz..."
            placeholderTextColor={theme.colors.inkFaint}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Ionicons
              name="close-circle" size={18} color={theme.colors.inkFaint}
              onPress={() => setSearch('')}
            />
          ) : null}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.key}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelectAnimal(item)}
                >
                  <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                  <View>
                    <Text style={styles.suggestionName}>{item.name}</Text>
                    <Text style={styles.suggestionZone}>{item.zone}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Konum modu butonu */}
      <TouchableOpacity
        style={[styles.locateButton, locationMode && styles.locateButtonActive]}
        onPress={() => setLocationMode(!locationMode)}
      >
        <Ionicons
          name="locate"
          size={22}
          color={locationMode ? theme.colors.white : theme.colors.primary}
        />
      </TouchableOpacity>

      {locationMode && (
        <View style={styles.hintBanner}>
          <Ionicons name="hand-left-outline" size={16} color={theme.colors.white} />
          <Text style={styles.hintText}>Haritada bulunduğunuz noktaya dokunun</Text>
        </View>
      )}

      {/* Seçili hayvan kartı */}
      {selected && (
        <View style={[styles.infoCard, { bottom: 70 + insets.bottom }]}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoEmoji}>{selected.emoji}</Text>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoName}>{selected.name}</Text>
              <Text style={styles.infoZone}>
                <Ionicons name="location" size={12} color={theme.colors.accent} /> {selected.zone}
                {selected.feedingTime?.start
                  ? `  ·  🍽 ${selected.feedingTime.start} – ${selected.feedingTime.end}`
                  : ''}
              </Text>
              {route && (
                <Text style={styles.infoRoute}>
                  ≈ {route.meters} m · yürüyerek {route.minutes} dk
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => { setSelectedKey(null); setRoute(null); }}
              hitSlop={10}
            >
              <Ionicons name="close" size={22} color={theme.colors.inkSoft} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoActions}>
            {route ? (
              <TouchableOpacity
                style={[styles.routeButton, styles.routeButtonGhost]}
                onPress={() => setRoute(null)}
              >
                <Ionicons name="trash-outline" size={16} color={theme.colors.ink} />
                <Text style={styles.routeButtonGhostText}>Rotayı Temizle</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.routeButton} onPress={handleDrawRoute}>
                <Ionicons name="navigate" size={16} color={theme.colors.primary} />
                <Text style={styles.routeButtonText}>Rota Çiz</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0EADB',
  },
  mapViewport: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    width: SVG_W,
    height: SVG_H,
  },
  searchOverlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    ...theme.shadow,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 15,
    color: theme.colors.ink,
  },
  suggestionsBox: {
    marginTop: 6,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    ...theme.shadow,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  suggestionEmoji: {
    fontSize: 22,
  },
  suggestionName: {
    fontSize: 15,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  suggestionZone: {
    fontSize: 12,
    color: theme.colors.inkSoft,
  },
  locateButton: {
    position: 'absolute',
    right: 16,
    top: 110,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow,
  },
  locateButtonActive: {
    backgroundColor: '#2378DC',
  },
  hintBanner: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2378DC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    ...theme.shadow,
  },
  hintText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
  },
  infoCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 78,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 14,
    ...theme.shadow,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoEmoji: {
    fontSize: 34,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoName: {
    fontSize: 17,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  infoZone: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginTop: 1,
  },
  infoRoute: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
    marginTop: 3,
  },
  infoActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  routeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.accent,
    paddingVertical: 11,
    borderRadius: theme.radius.md,
  },
  routeButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  routeButtonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(27,67,50,0.25)',
  },
  routeButtonGhostText: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: theme.fontWeight.medium,
  },
});
