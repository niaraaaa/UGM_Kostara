<p align="center">
  <b>🏠 UGM Kostara (UGM Kost Area)</b>
</p>

## 📝 Deskripsi Produk
UGM Kostara merupakan aplikasi Mobile yang mempermudah mahasiswa, khususnya di sekitar UGM, untuk menemukan kos sesuai kebutuhan (harga, jenis kelamin, fasilitas, dan rating). Nama “Kostara” merupakan singkatan dari “Kost Area”, yang menekankan lokasi kos di area sekitar kampus UGM. UGM Kostara menyediakan beberapa fitur, diantaranya:

- Menampilkan kos dalam bentuk daftar maupun marker di peta interaktif
- Memfilter kos berdasarkan harga, jenis kelamin, jumlah kamar, dan rating
- Menandai kos favorit pengguna dan menampilkan informasi lengkap kos melalui popup atau detail
- Menghubungkan pengguna dengan rute ke kos menggunakan Google Maps
- Pencarian kos berdasarkan nama kos

Produk ini ditujukan untuk **mempermudah pencarian kos secara cepat dan efisien**, serta membantu mahasiswa membuat keputusan berdasarkan informasi yang lengkap dan real-time.

## 🛠️ Komponen Pembangun Produk

**Frontend / UI**

- React Native (untuk mobile app)
- Expo Router & komponen UI khusus (`ThemedView`, `ThemedText`, `HapticTab`)
- Leaflet JS / WebView untuk versi web
- Animated components (`react-native-reanimated`) untuk efek transisi daftar kos

**Backend / Database**

- Firebase Realtime Database untuk menyimpan data kos, pengguna, dan favorit
- Firebase Authentication (opsional, untuk user login)

**Fitur Khusus**

- Filter kos (harga, jenis, rating)
- Tombol favorit
- Popup marker di peta
- Navigasi ke lokasi kos menggunakan Google Maps
- Pencarian kos berdasarkan nama

## 📊 Sumber Data

- **Data lokasi kos**: Google Maps
- **Informasi lengkap kos**: website mamikos

## 📸 Tangkapan Layar Komponen Penting Produk

<table>
  <tr>
    <td align="center"><b>Beranda</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/Beranda.jpg" width="300"/></td>
    <td align="center"><b>Daftar Kos</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/Daftar%20Kos.jpg" width="300"/></td>
  </tr>
  <tr>
    <td align="center"><b>Peta</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/Peta.jpg" width="300"/></td>
    <td align="center"><b>Daftar Kos Favorit</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/List%20Favorit.jpg" width="300"/></td>
  </tr>
  <tr>
    <td align="center"><b>Form Input</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/Form%20Input%20Location.jpg" width="300"/></td>
    <td align="center"><b>Form Edit</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/Form%20Edit%20Location.jpg" width="300"/></td>
  </tr>
  <tr>
    <td align="center"><b>Rute</b><br><img src="https://github.com/niaraaaa/UGM_Kostara/blob/916beb3817abb55619cc655e74fad4d6777004ef/rute.jpg" width="300"/></td>
    <td></td>
  </tr>
</table>


