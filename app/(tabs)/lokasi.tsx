import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove, set } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    RefreshControl,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

// Firebase Config
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

// Contoh userId tetap
const userId = "mahasiswa123";

export default function LokasiScreen() {
    const [sections, setSections] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [maxHarga, setMaxHarga] = useState(5000000);
    const [jenisKos, setJenisKos] = useState<'putra' | 'putri' | 'all'>('all');
    const [minRating, setMinRating] = useState(0);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();

    // Ambil daftar favorit user
    useEffect(() => {
        const favRef = ref(db, `users/${userId}/favorites`);
        const unsubscribe = onValue(favRef, (snapshot) => {
            const favIds = snapshot.val() ? Object.keys(snapshot.val()) : [];
            setFavorites(favIds);
        });
        return () => unsubscribe();
    }, []);

    const handlePress = (coordinates: string) => {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Hapus Lokasi", "Yakin hapus lokasi ini?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Hapus",
                style: "destructive",
                onPress: () => remove(ref(db, `points/${id}`))
            }
        ]);
    };

    const handleEdit = (item: any) => {
        router.push({
            pathname: "/formeditlocation",
            params: { ...item }
        });
    };

    const toggleFavorite = (id: string) => {
        const userFavRef = ref(db, `users/${userId}/favorites/${id}`);
        if (favorites.includes(id)) {
            remove(userFavRef);
        } else {
            set(userFavRef, true);
        }
    };

    // Ambil semua data kos
    useEffect(() => {
        const pointsRef = ref(db, 'points/');
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const arrayData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setAllData(arrayData);
                applyFilter(arrayData, maxHarga, jenisKos, minRating, searchQuery);
            } else {
                setSections([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fungsi filter termasuk search
    const applyFilter = (data: any[], max: number, jenis: 'putra' | 'putri' | 'all', rating: number, search = '') => {
        const filtered = data.filter(item => {
            const hargaOk = !item.harga || Number(item.harga) <= max;
            const jenisOk = jenis === 'all' || item.jenis?.toLowerCase() === jenis;
            const ratingOk = !item.rating || item.rating >= rating;
            const searchOk = item.name.toLowerCase().includes(search.toLowerCase());
            return hargaOk && jenisOk && ratingOk && searchOk;
        });
        setSections([{ title: "Daftar Kos", data: filtered }]);
    };

    // Apply filter saat nilai filter/search berubah
    useEffect(() => {
        applyFilter(allData, maxHarga, jenisKos, minRating, searchQuery);
    }, [maxHarga, jenisKos, minRating, searchQuery, allData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    if (loading) return <ThemedView style={styles.container}><ActivityIndicator size="large" /></ThemedView>;

    const FilterButton = ({ label, icon, active, onPress }: any) => (
        <TouchableOpacity style={[styles.filterBtn, active && styles.filterBtnActive]} onPress={onPress}>
            {icon && <FontAwesome5 name={icon} size={18} color={active ? 'white' : '#555'} />}
            <Text style={[styles.filterLabel, active && { color: 'white' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Search */}
            {/* Search */}
            <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 10 }}>
                <TextInput
                    placeholder="Cari nama kos..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 25,
                        elevation: 3,
                    }}
                />
            </View>


            {/* Filter */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    <FilterButton label="<700K" icon="money-bill-wave" active={maxHarga === 700000} onPress={() => setMaxHarga(700000)} />
                    <FilterButton label="<1.5JT" icon="money-bill-wave" active={maxHarga === 1500000} onPress={() => setMaxHarga(1500000)} />
                    <FilterButton label="ALL" icon="money-bill-wave" active={maxHarga === 5000000} onPress={() => setMaxHarga(5000000)} />
                    <FilterButton label="Putra" icon="male" active={jenisKos === 'putra'} onPress={() => setJenisKos('putra')} />
                    <FilterButton label="Putri" icon="female" active={jenisKos === 'putri'} onPress={() => setJenisKos('putri')} />
                    <FilterButton label="Semua" icon="users" active={jenisKos === 'all'} onPress={() => setJenisKos('all')} />
                    {[0, 1, 2, 3, 4, 5].map(r => (
                        <FilterButton key={r} label={`${r}+`} icon="star" active={minRating === r} onPress={() => setMinRating(r)} />
                    ))}
                </ScrollView>
            </View>

            {/* SectionList */}
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderSectionHeader={({ section }) => <ThemedText style={styles.header}>{section.title}</ThemedText>}
                    renderItem={({ item }) => (
                        <Animated.View entering={FadeInUp} style={styles.viewItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                                    <MaterialIcons
                                        name={favorites.includes(item.id) ? "favorite" : "favorite-border"}
                                        size={26}
                                        color="red"
                                    />
                                </TouchableOpacity>
                            </View>

                            {item.telepon && (
                                <View style={styles.infoRow}>
                                    <FontAwesome name="phone" size={16} color="#4E7C5A" />
                                    <ThemedText style={styles.infoText}>{item.telepon}</ThemedText>
                                </View>
                            )}

                            <View style={styles.infoRow}>
                                {item.harga && <View style={styles.infoItem}><FontAwesome name="money" size={16} color="#4E7C5A" /><ThemedText style={styles.infoText}>Rp {item.harga}</ThemedText></View>}
                                {item.kamar !== undefined && <View style={styles.infoItem}><FontAwesome5 name="bed" size={16} color="#4E7C5A" /><ThemedText style={styles.infoText}>{item.kamar} Kamar</ThemedText></View>}
                                {item.jenis && <View style={styles.infoItem}><FontAwesome5 name={item.jenis === 'putra' ? "male" : "female"} size={16} color="#4E7C5A" /><ThemedText style={styles.infoText}>{item.jenis}</ThemedText></View>}
                            </View>

                            {item.fasilitas && item.fasilitas.length > 0 && (
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="concierge-bell" size={16} color="#4E7C5A" />
                                    <ThemedText style={[styles.infoText, { flex: 1 }]}>{item.fasilitas.join(', ')}</ThemedText>
                                </View>
                            )}

                            {item.rating !== undefined && (
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starValue = i + 1;
                                        if (item.rating >= starValue) return <FontAwesome key={i} name="star" size={16} color="#FFD700" />;
                                        if (item.rating > i && item.rating < starValue) {
                                            const decimal = item.rating - i;
                                            if (decimal >= 0.75) return <FontAwesome key={i} name="star" size={16} color="#FFD700" />;
                                            if (decimal >= 0.25) return <FontAwesome key={i} name="star-half-o" size={16} color="#FFD700" />;
                                        }
                                        return <FontAwesome key={i} name="star-o" size={16} color="#FFD700" />;
                                    })}
                                </View>
                            )}

                            <View style={styles.actionButtons}>
                                <TouchableOpacity onPress={() => handlePress(item.coordinates)} style={styles.actionBtn}><FontAwesome5 name="map-marker-alt" size={20} color="#4E7C5A" /></TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}><FontAwesome5 name="pencil-alt" size={20} color="orange" /></TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}><FontAwesome5 name="trash" size={20} color="red" /></TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}
                />
            ) : (
                <ThemedView style={styles.container}><ThemedText>Tidak ada data kos.</ThemedText></ThemedView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F7FA", paddingTop: 20, paddingBottom: 20 },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "#4E7C5A",
        color: "white",
        padding: 10,
        textAlign: "center",
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 8
    },
    filterContainer: { paddingVertical: 10, marginHorizontal: 10, marginTop: 2},
    filterBtn: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 6,
        elevation: 3
    },
    filterBtnActive: { backgroundColor: '#4E7C5A' },
    filterLabel: { fontSize: 12, marginTop: 4, color: '#555' },
    itemName: { fontSize: 16, fontWeight: "bold" },
    viewItem: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginVertical: 12,
        elevation: 5,
        minHeight: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, alignItems: 'center' },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 4
    },
    infoText: { marginLeft: 6, fontSize: 14, color: '#333' },
    actionButtons: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 10,
        padding: 6,
        elevation: 4
    },
    actionBtn: { marginHorizontal: 4, padding: 6, backgroundColor: '#f1f1f1', borderRadius: 8 },
});
