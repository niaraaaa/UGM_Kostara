import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const router = useRouter();

  const scale = useRef(new Animated.Value(0.8)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(float, { toValue: -5, duration: 900, useNativeDriver: true }),
          Animated.timing(float, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      )
    ]).start();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Judul + Ikon */}
        <View style={styles.header}>
          <Animated.View style={{ opacity: fade, transform: [{ scale }, { translateY: float }] }}>
            <MaterialIcons name="house" size={50} color="#2C6E49" />
          </Animated.View>
          <ThemedText type="title" style={styles.title}>UGM Kostara</ThemedText>
          {/* Teks keterangan makna judul */}
          <ThemedText style={styles.titleDescription}>UGM Kost Area</ThemedText>
          <ThemedText style={styles.subtitle}>Solusi cepat menemukan kos terbaik di sekitar UGM</ThemedText>
        </View>

        {/* Tombol Cari Kos */}
        <TouchableOpacity style={styles.searchBtn} onPress={() => router.push('/lokasi')}>
          <LinearGradient
            colors={['#5DB075', '#3A8B5B']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.searchBtnGradient}
          >
            <MaterialIcons name="ads-click" size={22} color="#FAF3E0" />
            <ThemedText style={styles.searchText}>Pilih Kos Sekarang</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cards Informasi */}
        <View style={styles.cardsContainer}>

          {/* Card 1: Jumlah Kos + Tersedia */}
          <LinearGradient colors={['#FAF3E0', '#E8F5E9']} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <MaterialIcons name="location-on" size={28} color="#3E6B58" />
                <ThemedText style={styles.infoLabel}>Jumlah Kos</ThemedText>
                <ThemedText style={styles.infoValue}>75</ThemedText>
              </View>
              <View style={styles.infoBlock}>
                <MaterialIcons name="check-circle" size={28} color="#3A8B5B" />
                <ThemedText style={styles.infoLabel}>Tersedia</ThemedText>
                <ThemedText style={styles.infoValue}>68</ThemedText>
              </View>
            </View>
          </LinearGradient>

          {/* Card 2: Rating + Harga Rata-rata */}
          <LinearGradient colors={['#FFF5E1', '#FFE6B3']} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <MaterialIcons name="star" size={28} color="#F5C441" />
                <ThemedText style={styles.infoLabel}>Rating</ThemedText>
                <ThemedText style={styles.infoValue}>4.8</ThemedText>
              </View>
              <View style={styles.infoBlock}>
                <FontAwesome5 name="coins" size={28} color="#C18B4A" />
                <ThemedText style={styles.infoLabel}>Harga Rata-rata</ThemedText>
                <ThemedText style={styles.infoValue}>Rp 820.000/bln</ThemedText>
              </View>
            </View>
          </LinearGradient>

          {/* Card 3: Wilayah Layanan + Fitur Unggulan */}
          <LinearGradient colors={['#D0ECD7', '#B7E4C7']} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <MaterialIcons name="map" size={28} color="#2E6B4E" />
                <ThemedText style={styles.infoLabel}>Wilayah Layanan</ThemedText>
                <ThemedText style={styles.infoValue}>Sekitar UGM</ThemedText>
              </View>
              <View style={styles.infoBlock}>
                <MaterialIcons name="star-border" size={28} color="#3A8B5B" />
                <ThemedText style={styles.infoLabel}>Fitur Unggulan</ThemedText>
                <ThemedText style={styles.infoValue}>Filter, Rute, Favorit</ThemedText>
              </View>
            </View>
          </LinearGradient>

          {/* Card 4: Jenis Penghuni + Tips Singkat */}
          <LinearGradient colors={['#E8F5E9', '#CFF2D0']} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <MaterialIcons name="people" size={28} color="#2E6B4E" />
                <ThemedText style={styles.infoLabel}>Penghuni</ThemedText>
                <ThemedText style={styles.infoValue}>Putra • Putri</ThemedText>
              </View>
              <View style={styles.infoBlock}>
                <MaterialIcons name="tips-and-updates" size={28} color="#3A8B5B" />
                <ThemedText style={styles.infoLabel}>Tips</ThemedText>
                <ThemedText style={styles.infoValue}>Cek fasilitas & rating</ThemedText>
              </View>
            </View>
          </LinearGradient>

        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF2EF', paddingTop: 20 },

  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2C6E49', marginTop: 8 },
  titleDescription: { fontSize: 16, color: '#5C8D73', marginTop: 4, fontStyle: 'italic', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#4B6F5D', textAlign: 'center', marginTop: 4 },

  searchBtn: { marginHorizontal: 16, marginBottom: 20 },
  searchBtnGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  searchText: { color: '#FAF3E0', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },

  cardsContainer: { marginHorizontal: 16, marginBottom: 30 },

  infoCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBlock: { alignItems: 'center', width: '48%' },
  infoLabel: { fontSize: 14, fontWeight: 'bold', color: '#2E6B4E', marginTop: 6 },
  infoValue: { fontSize: 13, color: '#1F4B3A', marginTop: 4 },
});
