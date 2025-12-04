// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { initializeApp, getApps } from 'firebase/app';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { FontAwesome } from '@expo/vector-icons';
// import { router } from 'expo-router';

// // ---- Tambahkan TIPE MARKER ----
// interface MarkerType {
//     id: string;
//     name: string;
//     latitude: number;
//     longitude: number;
// }

// const firebaseConfig = {
//     apiKey: "AIzaSyAh8uII9zrgrEwzMYbByUfhljRAkShnufI",
//     authDomain: "reactnative-2025-d2e8d.firebaseapp.com",
//     databaseURL: "https://reactnative-2025-d2e8d-default-rtdb.firebaseio.com",
//     projectId: "reactnative-2025-d2e8d",
//     storageBucket: "reactnative-2025-d2e8d.firebasestorage.app",
//     messagingSenderId: "951608499275",
//     appId: "1:951608499275:web:2eb6c78b758b748a8901ce"
// };

// // Firebase init aman
// let app;
// if (getApps().length === 0) {
//     app = initializeApp(firebaseConfig);
// } else {
//     app = getApps()[0];
// }
// const db = getDatabase(app);

// export default function MapScreen() {

//     // ---- PERBAIKI STATE ----
//     const [markers, setMarkers] = useState<MarkerType[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const pointsRef = ref(db, 'points/');

//         const unsubscribe = onValue(pointsRef, (snapshot) => {
//             const data = snapshot.val();

//             if (data) {
//                 const parsed = Object.keys(data).map(key => {
//                     const point = data[key];

//                     if (!point.coordinates) return null;

//                     const [lat, lng] = point.coordinates.split(',').map(Number);

//                     if (isNaN(lat) || isNaN(lng)) return null;

//                     return {
//                         id: key,
//                         name: point.name,
//                         latitude: lat,
//                         longitude: lng,
//                     } as MarkerType;
//                 }).filter(Boolean) as MarkerType[];

//                 setMarkers(parsed);
//             } else {
//                 setMarkers([]);
//             }

//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" />
//                 <Text>Loading map data...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={{
//                     latitude: -7.7956,
//                     longitude: 110.3695,
//                     latitudeDelta: 0.02,
//                     longitudeDelta: 0.01,
//                 }}
//             >
//                 {markers.map(marker => (
//                     <Marker
//                         key={marker.id}
//                         coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
//                         title={marker.name}
//                     />
//                 ))}
//             </MapView>

//             <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
//                 <FontAwesome name="plus" size={24} color="white" />
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     map: { width: '100%', height: '100%' },
//     fab: {
//         position: 'absolute',
//         width: 56,
//         height: 56,
//         borderRadius: 28,
//         backgroundColor: '#0275d8',
//         alignItems: 'center',
//         justifyContent: 'center',
//         left: 20,
//         bottom: 20,
//     },
// });
