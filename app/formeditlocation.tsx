import * as Location from 'expo-location';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  const router = useRouter();
  const params = useLocalSearchParams();

  // Ambil semua parameter
  const {
    id,
    name: initialName,
    coordinates: initialCoordinates,
    harga: initialHarga,
    telepon: initialTelepon,
    kamar: initialKamar,
    jenis: initialJenis,
    rating: initialRating,
    fasilitas: initialFasilitas
  } = params;

  const [name, setName] = useState(String(initialName || ''));
  const [location, setLocation] = useState(String(initialCoordinates || ''));
  const [harga, setHarga] = useState(String(initialHarga || ''));
  const [telepon, setTelepon] = useState(String(initialTelepon || ''));
  const [kamar, setKamar] = useState(String(initialKamar || ''));
  const [jenisKos, setJenisKos] = useState<'putra' | 'putri' | ''>(String(initialJenis || '') as any);
  const [rating, setRating] = useState(String(initialRating || '0'));
  const [fasilitas, setFasilitas] = useState(
    Array.isArray(initialFasilitas) ? initialFasilitas.join(', ') : ''
  );

  // Ambil koordinat GPS
  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let position = await Location.getCurrentPositionAsync({});
    const coords = position.coords.latitude + ',' + position.coords.longitude;
    setLocation(coords);
  };

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAh8uII9zrgrEwzMYbByUfhljRAkShnufI",
    authDomain: "reactnative-2025-d2e8d.firebaseapp.com",
    databaseURL: "https://reactnative-2025-d2e8d-default-rtdb.firebaseio.com",
    projectId: "reactnative-2025-d2e8d",
    storageBucket: "reactnative-2025-d2e8d.firebasestorage.app",
    messagingSenderId: "951608499275",
    appId: "1:951608499275:web:2eb6c78b758b748a8901ce"
  };

  let app;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  const db = getDatabase(app);

  const createOneButtonAlert = (callback: any) =>
    Alert.alert('Success', 'Berhasil memperbarui data kos', [
      { text: 'OK', onPress: callback },
    ]);

  // UPDATE DATA
  const handleUpdate = () => {
    if (!id) {
      Alert.alert("Error", "ID kos tidak ditemukan.");
      return;
    }

    if (!name || !location || !harga || !telepon || !kamar || !jenisKos || rating === '') {
      Alert.alert("Validasi", "Semua field wajib diisi.");
      return;
    }

    const ratingNumber = Number(rating);
    if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
      Alert.alert("Validasi", "Rating harus berupa angka antara 0 sampai 5 (boleh desimal).");
      return;
    }

    const pointRef = ref(db, `points/${id}`);

    update(pointRef, {
      name,
      coordinates: location,
      harga,
      telepon,
      kamar,
      jenis: jenisKos,
      rating: ratingNumber,
      fasilitas: fasilitas.split(',').map(f => f.trim())
    }).then(() => {
      createOneButtonAlert(() => router.back());
    }).catch((e) => {
      console.error("Error updating document: ", e);
      Alert.alert("Error", "Gagal memperbarui data");
    });
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: 'white', flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ title: 'Edit Data Kos' }} />

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.inputTitle}>Nama Kos</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.inputTitle}>Koordinat</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />
          <View style={styles.button}><Button title="Ambil Koordinat GPS" onPress={getCoordinates} color="#4E7C5A" /></View>

          <Text style={styles.inputTitle}>Harga per Bulan (Rp)</Text>
          <TextInput style={styles.input} value={harga} onChangeText={setHarga} keyboardType="numeric" />

          <Text style={styles.inputTitle}>Fasilitas</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={fasilitas}
            onChangeText={setFasilitas}
            placeholder="Contoh: AC, Wifi, Lemari, Dapur Bersama"
            multiline
          />

          <Text style={styles.inputTitle}>Nomor Telepon Pengelola</Text>
          <TextInput style={styles.input} value={telepon} onChangeText={setTelepon} keyboardType="phone-pad" />

          <Text style={styles.inputTitle}>Jumlah Kamar Tersedia</Text>
          <TextInput style={styles.input} value={kamar} onChangeText={setKamar} keyboardType="numeric" />

          <Text style={styles.inputTitle}>Jenis Kos</Text>
          <View style={styles.jenisContainer}>
            <TouchableOpacity
              style={[styles.jenisBtn, jenisKos === 'putra' && styles.jenisBtnActive]}
              onPress={() => setJenisKos('putra')}
            >
              <Text style={jenisKos === 'putra' ? styles.jenisTextActive : styles.jenisText}>Putra</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.jenisBtn, jenisKos === 'putri' && styles.jenisBtnActive]}
              onPress={() => setJenisKos('putri')}
            >
              <Text style={jenisKos === 'putri' ? styles.jenisTextActive : styles.jenisText}>Putri</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputTitle}>Rating (0–5, boleh desimal)</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={setRating}
            keyboardType="decimal-pad"
            placeholder="Contoh: 4.5"
          />

          <View style={styles.button}>
            <Button title="Simpan Perubahan" onPress={handleUpdate} color="#4E7C5A" />
          </View>
        </ScrollView>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputTitle: {
    marginLeft: 12,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    margin: 12,
  },
  jenisContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 8,
  },
  jenisBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  jenisBtnActive: {
    backgroundColor: '#4E7C5A',
    borderColor: '#4E7C5A',
  },
  jenisText: {
    color: '#333',
    fontWeight: '500',
  },
  jenisTextActive: {
    color: 'white',
    fontWeight: '600',
  }
});
