import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getDatabase, ref, onValue } from 'firebase/database';

const userId = "mahasiswa123"; // sama dengan LokasiScreen

export default function MahasiswaFavoritesScreen() {
    const [favoritesData, setFavoritesData] = useState<any[]>([]);

    useEffect(() => {
        const db = getDatabase();
        const favRef = ref(db, `users/${userId}/favorites`);
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(favRef, (favSnap) => {
            const favIds = favSnap.val() ? Object.keys(favSnap.val()) : [];
            onValue(pointsRef, (pointsSnap) => {
                const points = pointsSnap.val();
                const favPoints = favIds.map(id => ({ id, ...points[id] })).filter(p => p);
                setFavoritesData(favPoints);
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top']}>
                <SectionList
                    sections={[{ title: 'Favorit Kos', data: favoritesData }]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="house" size={26} color="#4E7C5A" />
                                <Text style={styles.name}>{item.name}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                {item.harga && (
                                    <View style={styles.infoItem}>
                                        <FontAwesome name="money" size={16} color="#4E7C5A" />
                                        <Text style={styles.infoText}>Rp {item.harga}</Text>
                                    </View>
                                )}
                                {item.kamar !== undefined && (
                                    <View style={styles.infoItem}>
                                        <FontAwesome5 name="bed" size={16} color="#4E7C5A" />
                                        <Text style={styles.infoText}>{item.kamar} Kamar</Text>
                                    </View>
                                )}
                                {item.jenis && (
                                    <View style={styles.infoItem}>
                                        <FontAwesome5 name={item.jenis === 'putra' ? "male" : "female"} size={16} color="#4E7C5A" />
                                        <Text style={styles.infoText}>{item.jenis}</Text>
                                    </View>
                                )}
                            </View>

                            {item.fasilitas && Array.isArray(item.fasilitas) && item.fasilitas.length > 0 && (
                                <View style={styles.infoRow}>
                                    <FontAwesome5 name="concierge-bell" size={16} color="#4E7C5A" />
                                    <Text style={[styles.infoText, { flex: 1 }]}>{item.fasilitas.join(', ')}</Text>
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
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F7FA", paddingHorizontal: 12, paddingVertical: 8 },

    header: {
        fontSize: 22,
        fontWeight: "bold",
        backgroundColor: "#4E7C5A",
        color: "white",
        padding: 10,
        borderRadius: 8,
        marginVertical: 8
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#333'
    },

    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
        alignItems: 'center',
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 4,
    },

    infoText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333',
    }
});
