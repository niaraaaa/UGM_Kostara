import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [harga, setHarga] = useState('');
    const [telepon, setTelepon] = useState('');
    const [kamar, setKamar] = useState('');
    const [jenisKos, setJenisKos] = useState<'putra' | 'putri' | ''>('');
    const [rating, setRating] = useState('0');
    const [fasilitas, setFasilitas] = useState(''); // input fasilitas

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

    // Simpan data ke Firebase
    const handleSave = () => {
        if (!name || !location || !harga || !telepon || !kamar || !jenisKos) {
            Alert.alert("Validasi", "Semua data wajib diisi!");
            return;
        }

        const locationsRef = ref(db, 'points/');

        push(locationsRef, {
            name,
            coordinates: location,
            harga,
            telepon,
            kamar,
            jenis: jenisKos,
            rating: Number(rating),
            fasilitas: fasilitas.split(',').map(f => f.trim()) // simpan sebagai array
        }).then(() => {
            Alert.alert("Sukses", "Data kos berhasil disimpan!");
            // reset semua field
            setName('');
            setLocation('');
            setHarga('');
            setTelepon('');
            setKamar('');
            setJenisKos('');
            setRating('0');
            setFasilitas('');
        }).catch((e) => {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Gagal menyimpan data");
        });
    };

    return (
        <SafeAreaProvider style={{ backgroundColor: 'white', flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ title: 'Tambah Kos' }} />

                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <Text style={styles.inputTitle}>Nama Kos</Text>
                    <TextInput style={styles.input} placeholder='Contoh: Kos Melati' value={name} onChangeText={setName} />

                    <Text style={styles.inputTitle}>Koordinat</Text>
                    <TextInput style={styles.input} placeholder="-7.7749,110.3745" value={location} onChangeText={setLocation} />
                    <View style={styles.button}><Button title="Ambil Koordinat GPS" onPress={getCoordinates} color="#4E7C5A" /></View>

                    <Text style={styles.inputTitle}>Harga per Bulan (Rp)</Text>
                    <TextInput style={styles.input} placeholder="Contoh: 1200000" keyboardType="numeric" value={harga} onChangeText={setHarga} />

                    <Text style={styles.inputTitle}>Fasilitas</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Contoh: AC, Wifi, Lemari, Dapur Bersama"
                        value={fasilitas}
                        onChangeText={setFasilitas}
                        multiline
                    />

                    <Text style={styles.inputTitle}>Nomor Telepon Pengelola</Text>
                    <TextInput style={styles.input} placeholder="Contoh: 08123456789" keyboardType="phone-pad" value={telepon} onChangeText={setTelepon} />

                    <Text style={styles.inputTitle}>Jumlah Kamar Tersedia</Text>
                    <TextInput style={styles.input} placeholder="Contoh: 5" keyboardType="numeric" value={kamar} onChangeText={setKamar} />

                    <Text style={styles.inputTitle}>Jenis Kos</Text>
                    <View style={styles.jenisContainer}>
                        <TouchableOpacity style={[styles.jenisBtn, jenisKos === 'putra' && styles.jenisBtnActive]} onPress={() => setJenisKos('putra')}>
                            <Text style={jenisKos === 'putra' ? styles.jenisTextActive : styles.jenisText}>Putra</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.jenisBtn, jenisKos === 'putri' && styles.jenisBtnActive]} onPress={() => setJenisKos('putri')}>
                            <Text style={jenisKos === 'putri' ? styles.jenisTextActive : styles.jenisText}>Putri</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.inputTitle}>Rating (0-5, desimal diperbolehkan)</Text>
                    <TextInput style={styles.input} placeholder="Contoh: 4.5" keyboardType="decimal-pad" value={rating} onChangeText={setRating} />

                    <View style={styles.button}>
                        <Button title="Simpan Data Kos" color="#4E7C5A" onPress={handleSave} />
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
