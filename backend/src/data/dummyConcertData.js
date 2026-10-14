/**
 * DUMMY CONCERT CATALOG
 * =====================
 *
 * Data dummy untuk prototyping: artist Indonesia populer, lokasi konser di
 * Indonesia, daftar konser, dan setlist lagu beserta artist asal lagu tersebut.
 *
 * CATATAN:
 * - Semua data di bawah ini bersifat DUMMY (tidak diambil dari database Supabase).
 * - Harga tiket, kuota, kapasitas, dan judul lagu bersifat ilustratif.
 * - Foto memakai URL Unsplash publik.
 * - Tanggal event memakai zona waktu Asia/Jakarta (+07:00).
 */


// =========================================
// LOCATIONS (10 lokasi konser di Indonesia)
// =========================================

export const DUMMY_LOCATIONS = [
  {
    id: 1,
    slug: "gbk-main-stadium",
    name: "Stadion Utama Gelora Bung Karno",
    short_name: "GBK Main Stadium",
    venue_type: "stadium",
    address:
      "Jl. Gelora, Gelora, Tanah Abang, Jakarta Pusat",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    country: "Indonesia",
    latitude: -6.1751,
    longitude: 106.7949,
    capacity: 82700,
    year_built: 1962,
    facilities: [
      "Tribune bawah dan tribune atas",
      "VVIP dan VIP box",
      "8 gerbang masuk (Gate 1-8)",
      "Parkir kapasitas 4.000 mobil",
    ],
    access: [
      "MRT Senayan (5 menit ke gerbang)",
      "Transjakarta 02, 06, 08",
      "Parkir on-site dan area Wisang",
    ],
    description:
      "Stadion ikonik Jakarta dengan kapasitas terbesar di Nusantara dan sudah menjadi lokasi rutin konser berskala raksasa.",
    photo:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "jis-amphitheater",
    name: "JIS Amphitheater",
    short_name: "JIS Amphitheater",
    venue_type: "amphitheater",
    address:
      "Jl. Pintu Satu, Ancol, Penjaringan, Jakarta Utara",
    city: "Jakarta Utara",
    province: "DKI Jakarta",
    country: "Indonesia",
    latitude: -6.1268,
    longitude: 106.8308,
    capacity: 25000,
    year_built: 2022,
    facilities: [
      "Panggung open air dengan sound system line array",
      "VIP lounge lantai 4",
      "Gondola food court",
      "Area backstage dan loading dock",
      "Parkir basement 2.500 mobil",
    ],
    access: [
      "LRT JIS (2 menit ke area konser)",
      "Bus Transjakarta 121",
      "Rute pelni dari Bandar Dracula",
    ],
    description:
      "Amfiteater open air di kawasan Ancol yang diresmikan pada 2022 dengan panggung permanen dan kapasitas 25.000 penonton.",
    photo:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "istora-senayan",
    name: "ISTORA Senayan",
    short_name: "Istora Senayan",
    venue_type: "indoor_arena",
    address:
      "Jl. Pintu Satu Senayan, Gelora, Jakarta Pusat",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    country: "Indonesia",
    latitude: -6.1936,
    longitude: 106.798,
    capacity: 7700,
    year_built: 1962,
    facilities: [
      "Arena utama 7.700 kursi",
      "Ring VIP dan VVIP",
      "Panggung 16 x 24 meter",
      "Akses load in via Jl. Senayan",
      "Parkir basement Senayan",
    ],
    access: [
      "MRT Senayan (5 menit)",
      "Transjakarta 02, 06, 08, 09",
      "Parkir basement Senayan",
    ],
    description:
      "Gelora indoor serbaguna di kawasan Senayan yang sudah menjadi tempat konser multi-genre sejak puluhan tahun.",
    photo:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "sasana-budaya-ganesha",
    name: "Sasana Budaya Ganesha (Sabuga)",
    short_name: "Sabuga Bandung",
    venue_type: "theater_hall",
    address:
      "Jl. Asia Afrika No. 139, Siliwangi, Sumur Bandung, Bandung",
    city: "Bandung",
    province: "Jawa Barat",
    country: "Indonesia",
    latitude: -6.9214,
    longitude: 107.61,
    capacity: 5000,
    year_built: 2002,
    facilities: [
      "Aula utama 5.000 kursi bergradien",
      "Akustik konser terbaik di Bandung",
      "Tiga ruang green room",
      "Parkir 1.200 mobil",
      "Area VIP dan balkon",
    ],
    access: [
      "Kereta Whoosh ke Halte Padalarang",
      "Bus kota dari Alun-alun Bandung",
      "Ojek daring",
    ],
    description:
      "Gedung pertunjukan berbudaya di pusat Bandung dengan desain akustik yang cocok untuk konser jazz, pop, dan orkestra.",
    photo:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "gor-c-tra-arena",
    name: "GOR C-Tra Arena",
    short_name: "C-Tra Arena",
    venue_type: "indoor_arena",
    address:
      "Jl. Cakrawala, Padalarang, Kabupaten Bandung Barat",
    city: "Padalarang",
    province: "Jawa Barat",
    country: "Indonesia",
    latitude: -6.839,
    longitude: 107.466,
    capacity: 15000,
    year_built: 2021,
    facilities: [
      "Arena utama 15.000 kursi",
      "Fan pit dan sound delay tower",
      "Food court di area luar",
      "Parkir 2.500 mobil",
      "Akses langsung dari Tol Padalarang",
    ],
    access: [
      "Exit Padalarang, tol Cipanas",
      "Kereta Whoosh ke Halte Padalarang",
      "Bus Tayo dari Bandung",
    ],
    description:
      "Arena indoor modern di Padalarang yang termasuk venue konser terbesar di wilayah Bandung Raya.",
    photo:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "stadion-mandala-krida",
    name: "Stadion Mandala Krida",
    short_name: "Mandala Krida",
    venue_type: "stadium",
    address:
      "Jl. Raya Janti, Banguntapan, Sleman, Yogyakarta",
    city: "Sleman",
    province: "DI Yogyakarta",
    country: "Indonesia",
    latitude: -7.751,
    longitude: 110.41,
    capacity: 35000,
    year_built: 1987,
    facilities: [
      "Tribune Tribun (Utara dan Selatan)",
      "Tribune Curiga dan Marjana",
      "Tribune Geo 1.500 kursi",
      "Empat titik gerbang masuk",
      "Area food court dan bazar",
    ],
    access: [
      "KRL LDP (Stasiun Brambanan)",
      "Trans Jogja 2A",
      "Parkir terbuka di sekitar stadion",
    ],
    description:
      "Stadion terbesar di Yogyakarta yang rutin dipakai sebagai lokasi konser musik dan festival berskala regional.",
    photo:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    slug: "jogja-expo-center",
    name: "Jogja Expo Center (JEC)",
    short_name: "JEC Yogyakarta",
    venue_type: "exhibition_hall",
    address:
      "Jl. Raya Janti Km 2, Banguntapan, Sleman, Yogyakarta",
    city: "Sleman",
    province: "DI Yogyakarta",
    country: "Indonesia",
    latitude: -7.7508,
    longitude: 110.4265,
    capacity: 40000,
    year_built: 2015,
    facilities: [
      "Hall A indoor 40.000 pengunjung",
      "Panggung utama dan panggung pendukung",
      "Enam titik loading dock",
      "Parkir 3.000 mobil",
      "Area bazar dan food court",
    ],
    access: [
      "KRL LDP (Stasiun Brambanan)",
      "Trans Jogja 2A dan 2B",
      "Tol Jogja-Solo exit Janti",
    ],
    description:
      "Pusat exhibition terbesar di Yogyakarta yang sering menjadi lokasi festival musik dan konser multi-artist.",
    photo:
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    slug: "grand-city-convention-hall",
    name: "Grand City Convention & Exhibition Hall",
    short_name: "Grand City Surabaya",
    venue_type: "convention_hall",
    address:
      "Jl. Mayjen Prof. Dr. Moestopo No. 1, Darmo, Surabaya",
    city: "Surabaya",
    province: "Jawa Timur",
    country: "Indonesia",
    latitude: -7.262,
    longitude: 112.738,
    capacity: 20000,
    year_built: 2016,
    facilities: [
      "Main hall 20.000 kursi",
      "Ballroom VIP dan VVIP",
      "Lobby dan area ekshibisi",
      "Parkir basement 1.200 mobil",
      "Loading dock bagian timur",
    ],
    access: [
      "Tol Surabaya-Gresik exit Gubeng",
      "Stasiun KRL Gubeng",
      "Bus Suroboyo rute 1B",
    ],
    description:
      "Convention hall terbesar di Surabaya yang menjadi venue langganan konser musik, festival, dan acara dagang berskala besar.",
    photo:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    slug: "gwk-cultural-park",
    name: "GWK Cultural Park",
    short_name: "GWK Ubud",
    venue_type: "outdoor_amphitheater",
    address:
      "Jl. Raya Ubud, Payangan, Gianyar, Bali",
    city: "Ubud",
    province: "Bali",
    country: "Indonesia",
    latitude: -8.518,
    longitude: 115.263,
    capacity: 15000,
    year_built: 2014,
    facilities: [
      "Bamboo amphitheater 3.000 kursi",
      "Open field area dansa 12.000 orang",
      "Area backstage dan soundcheck",
      "Kuliner pasar desa dan bar",
      "Parkir bus di area timur",
    ],
    access: [
      "1,5 jam dari Bandara Ngurah Rai",
      "Shuttle bus dari Denpasar",
      "Sewa mobil dan motor",
    ],
    description:
      "Taman budaya di lereng Sungai Petanu dengan amphitheater bambu ikonik yang rutin menjadi panggung festival musik.",
    photo:
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 10,
    slug: "echo-beach-canggu",
    name: "Echo Beach",
    short_name: "Echo Beach Canggu",
    venue_type: "beach_venue",
    address:
      "Jl. Pantai Batu Bolong, Canggu, Badung, Bali",
    city: "Canggu",
    province: "Bali",
    country: "Indonesia",
    latitude: -8.647,
    longitude: 115.131,
    capacity: 5000,
    year_built: 2018,
    facilities: [
      "Beach venue 5.000 peserta",
      "Sunset deck dan panggung pasir",
      "Warung dan bar lokal",
      "Area paid parking",
      "Ruang ganti dan shower",
    ],
    access: [
      "1 jam dari Bandara Ngurah Rai",
      "Ojek daring dan sewa motor",
      "Shuttle beach resort",
    ],
    description:
      "Pantai ikonik di Canggu yang dikenal dengan ombaknya dan rutin dipakai sebagai lokasi konser intim berlatar matahari terbenam.",
    photo:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop",
  },
];


// =========================================
// ARTISTS (10 artist Indonesia populer)
// =========================================

export const DUMMY_ARTISTS = [
  {
    id: 1,
    slug: "tulus",
    name: "Tulus",
    genre: "Pop / Soul / Jazz",
    origin_city: "Jakarta Selatan",
    origin_province: "DKI Jakarta",
    country: "Indonesia",
    debut_year: 2008,
    popularity_rank: 1,
    monthly_listeners: 9600000,
    description:
      "Penyanyi, penulis lagu, dan musisi Indonesia dengan warna vokal soul-jazz yang hangat serta lirik puitis yang dekat dengan lintas generasi.",
    photo:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/tulusm",
      youtube: "https://youtube.com/@tulusmusic",
      spotify: "https://open.spotify.com/artist/tulus",
    },
    highlights: [
      "Salah satu penyanyi Indonesia paling banyak diputar di platform musik",
      "Konser orkestra bersamaensemble simfoni nasional",
    ],
  },
  {
    id: 2,
    slug: "dewa-19",
    name: "Dewa 19",
    genre: "Classic Rock / Pop Rock",
    origin_city: "Bandung",
    origin_province: "Jawa Barat",
    country: "Indonesia",
    debut_year: 1984,
    popularity_rank: 2,
    monthly_listeners: 8200000,
    description:
      "Band rock legendaris Indonesia karya Ahmad Dhani yang konsisten menyatukan lintas generasi lewat aransemen orkestra dan energi panggung yang ikonik.",
    photo:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/officialdewa19",
      youtube: "https://youtube.com/@Dewa19Official",
      spotify: "https://open.spotify.com/artist/dewa-19",
    },
    highlights: [
      "Ikon rock Indonesia yang aktif sejak 1984",
      "Pernah tampil bersama Prague Philharmonic Orchestra",
    ],
  },
  {
    id: 3,
    slug: "sheila-on-7",
    name: "Sheila on 7",
    genre: "Pop Rock / Nostalgia",
    origin_city: "Yogyakarta",
    origin_province: "DI Yogyakarta",
    country: "Indonesia",
    debut_year: 2000,
    popularity_rank: 3,
    monthly_listeners: 7400000,
    description:
      "Band pop-rock asal Yogyakarta dengan deretan hits yang dekat dengan kehidupan sehari-hari dan sering menjadi soundtrack bersama lintas generasi.",
    photo:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/sheilaon7",
      youtube: "https://youtube.com/@sheilaon7official",
      spotify: "https://open.spotify.com/artist/sheila-on-7",
    },
    highlights: [
      "Lahir dari kompetisi band dan langsung troubleshootdut bestseller",
      "Lagu seperti Dan... dan Sephia jadi anthem generasinya",
    ],
  },
  {
    id: 4,
    slug: "padi",
    name: "Padi",
    genre: "Pop Rock / Alternative",
    origin_city: "Surabaya",
    origin_province: "Jawa Timur",
    country: "Indonesia",
    debut_year: 1997,
    popularity_rank: 4,
    monthly_listeners: 5100000,
    description:
      "Band pop-rock asal Surabaya yang membawa nuansa nostalgik dan energi muda ke panggung Indonesia, aktif hampir tiga dekade tanpa pernah kehilangan relevansinya.",
    photo:
      "https://images.unsplash.com/photo-1524650359799-842906ca1c06?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/padiofficial",
      youtube: "https://youtube.com/@PadiOfficial",
      spotify: "https://open.spotify.com/artist/padi",
    },
    highlights: [
      "Aktif konsisten sejak 1997",
      "Bintang Kehidupan menjadi anthem generasi 2000-an",
    ],
  },
  {
    id: 5,
    slug: "noah",
    name: "Noah",
    genre: "Alternative Pop",
    origin_city: "Bandung",
    origin_province: "Jawa Barat",
    country: "Indonesia",
    debut_year: 2006,
    popularity_rank: 5,
    monthly_listeners: 9100000,
    description:
      "Band alternatif Bandung dengan lirik puitis, aransemen dinamis, dan pertunjukan yang emosional.",
    photo:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/noahband",
      youtube: "https://youtube.com/@noahbandofficial",
      spotify: "https://open.spotify.com/artist/noah",
    },
    highlights: [
      "Salah satu band paling banyak diputar di Indonesia",
      "Pernah tampil di festival musik internasional",
    ],
  },
  {
    id: 6,
    slug: "rossa",
    name: "Rossa",
    genre: "Soul / R&B / Pop",
    origin_city: "Bandung",
    origin_province: "Jawa Barat",
    country: "Indonesia",
    debut_year: 2000,
    popularity_rank: 6,
    monthly_listeners: 4300000,
    description:
      "Penyanyi soul dan pop Indonesia dengan vokal jernih dan repertoar yang dekat dengan berbagai momen penting.",
    photo:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/rossa988",
      youtube: "https://youtube.com/@RossaOfficial",
      spotify: "https://open.spotify.com/artist/rossa",
    },
    highlights: [
      "Pernah membawakan pertunjukan di beberapa negara",
      "Dikenal sebagai penyanyi soul paling dear di Indonesia",
    ],
  },
  {
    id: 7,
    slug: "peterpan",
    name: "Peterpan",
    genre: "Alternative Rock / Pop",
    origin_city: "Bandung",
    origin_province: "Jawa Barat",
    country: "Indonesia",
    debut_year: 1999,
    popularity_rank: 7,
    monthly_listeners: 6400000,
    description:
      "Band alternatif Bandung yang dikenal karena vokal khas, lirik yang jujur, dan pertunjukan yang emosional.",
    photo:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/therealpeterpan",
      youtube: "https://youtube.com/@PeterpanOfficial",
      spotify: "https://open.spotify.com/artist/peterpan",
    },
    highlights: [
      "Album Bawang Merah sampai Abadi",
      "Tur reunions yang selalu sold out",
    ],
  },
  {
    id: 8,
    slug: "anggun",
    name: "Anggun",
    genre: "Pop / Adult Contemporary",
    origin_city: "Jakarta",
    origin_province: "DKI Jakarta",
    country: "Indonesia",
    debut_year: 1986,
    popularity_rank: 8,
    monthly_listeners: 4800000,
    description:
      "Penyanyi Indonesia yang mendunia lewat karier internasional, dikenal karena vokal servern dan repertoar lintas generasi.",
    photo:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1487954152950-e0584673b7f3?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/anggun",
      youtube: "https://youtube.com/@AnggunOfficial",
      spotify: "https://open.spotify.com/artist/anggun",
    },
    highlights: [
      "Snow on the Sahara Tembus IGN dengan actinya Asia Tenggara",
      "Pernah menerima penghargaan musik di Eropa",
    ],
  },
  {
    id: 9,
    slug: "maliq-dessentials",
    name: "Maliq & D'Essentials",
    genre: "Soul / R&B / Jazz Pop",
    origin_city: "Jakarta Selatan",
    origin_province: "DKI Jakarta",
    country: "Indonesia",
    debut_year: 1998,
    popularity_rank: 9,
    monthly_listeners: 3900000,
    description:
      "Band pop-soul dengan vokal grup yang hangat, aransemen jazz, dan chemistry grup yang kuat di panggung.",
    photo:
      "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/maliqdessentials",
      youtube: "https://youtube.com/@MaliqDessentialsOfficial",
      spotify: "https://open.spotify.com/artist/maliq-dessentials",
    },
    highlights: [
      "Sering tampil di festival jazz danPertunjukan intimate",
      "Pelesir ini Mari Berdance jadi_signature medley mereka",
    ],
  },
  {
    id: 10,
    slug: "judika",
    name: "Judika",
    genre: "Pop / R&B",
    origin_city: "Jakarta",
    origin_province: "DKI Jakarta",
    country: "Indonesia",
    debut_year: 2006,
    popularity_rank: 10,
    monthly_listeners: 4100000,
    description:
      "Penyanyi pop R&B dengan rentang vokal lebar, dikenal lewat OST film dan lagu-lagu yang mudah diterima semua kalangan.",
    photo:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop",
    socials: {
      instagram: "https://instagram.com/judika",
      youtube: "https://youtube.com/@JudikaOfficial",
      spotify: "https://open.spotify.com/artist/judika",
    },
    highlights: [
      "Cinta Gila dan Surat Cinta jadi hits nasional",
      "Sering membawakan remake lagu-lagu lawas",
    ],
  },
];


// =========================================
// SONGS (lagu + artist asal lagu)
// =========================================

export const DUMMY_SONGS = [
  // --- Tulus ---
  {
    id: 21,
    slug: "tukang-bubuk-naik-haji",
    title: "Tukang Bubuk Naik Haji",
    artist_slug: "tulus",
    album: "Versus World",
    release_year: 2008,
    duration_seconds: 252,
    genre: "Pop",
  },
  {
    id: 22,
    slug: "sewindu",
    title: "Sewindu",
    artist_slug: "tulus",
    album: "Manis",
    release_year: 2010,
    duration_seconds: 228,
    genre: "Pop",
  },
  {
    id: 23,
    slug: "pamit",
    title: "Pamit",
    artist_slug: "tulus",
    album: "Pamit",
    release_year: 2015,
    duration_seconds: 260,
    genre: "Pop / Soul",
  },
  {
    id: 24,
    slug: "langit-abu-abu",
    title: "Langit Abu-Abu",
    artist_slug: "tulus",
    album: "Versus World",
    release_year: 2008,
    duration_seconds: 258,
    genre: "Pop",
  },
  {
    id: 25,
    slug: "monokrom",
    title: "Monokrom",
    artist_slug: "tulus",
    album: "S|Long",
    release_year: 2012,
    duration_seconds: 245,
    genre: "Pop",
  },
  {
    id: 26,
    slug: "mutiara",
    title: "Mutiara",
    artist_slug: "tulus",
    album: "Manis",
    release_year: 2010,
    duration_seconds: 236,
    genre: "Pop / Soul",
  },
  {
    id: 27,
    slug: "hati-hati-di-jalan",
    title: "Hati-hati di Jalan",
    artist_slug: "tulus",
    album: "Versus World",
    release_year: 2008,
    duration_seconds: 271,
    genre: "Pop",
  },

  // --- Dewa 19 ---
  {
    id: 28,
    slug: "cinta-mati",
    title: "Cinta Mati",
    artist_slug: "dewa-19",
    album: "Cinta Mati",
    release_year: 2009,
    duration_seconds: 266,
    genre: "Rock",
  },
  {
    id: 29,
    slug: "bumi-air-indonesia",
    title: "Bumi Air Indonesia",
    artist_slug: "dewa-19",
    album: "Laskar Cinta",
    release_year: 2004,
    duration_seconds: 242,
    genre: "Rock",
  },
  {
    id: 30,
    slug: "laskar-cinta",
    title: "Laskar Cinta",
    artist_slug: "dewa-19",
    album: "Laskar Cinta",
    release_year: 2004,
    duration_seconds: 255,
    genre: "Rock",
  },
  {
    id: 31,
    slug: "lantai-empat",
    title: "Lantai Empat",
    artist_slug: "dewa-19",
    album: "Dawai Rindu",
    release_year: 2001,
    duration_seconds: 249,
    genre: "Rock",
  },
  {
    id: 32,
    slug: "mbois",
    title: "Mbois",
    artist_slug: "dewa-19",
    album: "Mbois",
    release_year: 2013,
    duration_seconds: 254,
    genre: "Rock",
  },
  {
    id: 33,
    slug: "secuil-senja",
    title: "Secuil Senja",
    artist_slug: "dewa-19",
    album: "Dawai Rindu",
    release_year: 2001,
    duration_seconds: 302,
    genre: "Rock",
  },

  // --- Sheila on 7 ---
  {
    id: 34,
    slug: "dan",
    title: "Dan...",
    artist_slug: "sheila-on-7",
    album: "Dutahti",
    release_year: 2000,
    duration_seconds: 258,
    genre: "Pop Rock",
  },
  {
    id: 35,
    slug: "sephia",
    title: "Sephia",
    artist_slug: "sheila-on-7",
    album: "Salah",
    release_year: 2003,
    duration_seconds: 276,
    genre: "Pop Rock",
  },
  {
    id: 36,
    slug: "sahabat-sejati",
    title: "Sahabat Sejati",
    artist_slug: "sheila-on-7",
    album: "Nyap",
    release_year: 2006,
    duration_seconds: 301,
    genre: "Pop Rock",
  },
  {
    id: 37,
    slug: "teman-hidup",
    title: "Teman Hidup",
    artist_slug: "sheila-on-7",
    album: "Dutahti",
    release_year: 2000,
    duration_seconds: 284,
    genre: "Pop Rock",
  },
  {
    id: 38,
    slug: "akhir",
    title: "Akhir",
    artist_slug: "sheila-on-7",
    album: "Sebelas",
    release_year: 2013,
    duration_seconds: 292,
    genre: "Pop Rock",
  },

  // --- Padi ---
  {
    id: 39,
    slug: "bintang-kehidupan",
    title: "Bintang Kehidupan",
    artist_slug: "padi",
    album: "Padi",
    release_year: 1997,
    duration_seconds: 263,
    genre: "Pop Rock",
  },
  {
    id: 40,
    slug: "terbakar-cemburu",
    title: "Terbakar Cemburu",
    artist_slug: "padi",
    album: "Padi",
    release_year: 1997,
    duration_seconds: 241,
    genre: "Pop Rock",
  },
  {
    id: 41,
    slug: "ada-namamu",
    title: "Ada Namamu",
    artist_slug: "padi",
    album: "Aku Ingin",
    release_year: 2000,
    duration_seconds: 254,
    genre: "Pop Rock",
  },
  {
    id: 42,
    slug: "di-depan-mata",
    title: "Di Depan Mata",
    artist_slug: "padi",
    album: "Aku Ingin",
    release_year: 2000,
    duration_seconds: 247,
    genre: "Pop Rock",
  },
  {
    id: 43,
    slug: "lukisan",
    title: "Lukisan",
    artist_slug: "padi",
    album: "Wajahmu Memori",
    release_year: 2004,
    duration_seconds: 239,
    genre: "Pop Rock",
  },

  // --- Nella Kharisma ---
  {
    id: 44,
    slug: "khimar",
    title: "Khimar",
    artist_slug: "noah",
    album: "Khimar",
    release_year: 2016,
    duration_seconds: 240,
    genre: "Alternative Pop",
  },
  {
    id: 45,
    slug: "kuda-hitam",
    title: "Kuda Hitam",
    artist_slug: "noah",
    album: "Petuala Hati",
    release_year: 2012,
    duration_seconds: 262,
    genre: "Alternative Pop",
  },
  {
    id: 46,
    slug: "rumah-kaca",
    title: "Rumah Kaca",
    artist_slug: "noah",
    album: "Petuala Hati",
    release_year: 2012,
    duration_seconds: 248,
    genre: "Alternative Pop",
  },
  {
    id: 47,
    slug: "kembar",
    title: "Kembar",
    artist_slug: "noah",
    album: "Second Album",
    release_year: 2008,
    duration_seconds: 254,
    genre: "Pop Rock",
  },
  {
    id: 48,
    slug: "dalam-hati",
    title: "Dalam Hati",
    artist_slug: "noah",
    album: "Second Album",
    release_year: 2008,
    duration_seconds: 238,
    genre: "Pop Rock",
  },

  // --- Rossa ---
  {
    id: 49,
    slug: "none-of-the-above",
    title: "None of the Above",
    artist_slug: "rossa",
    album: "None of the Above",
    release_year: 1998,
    duration_seconds: 265,
    genre: "Soul",
  },
  {
    id: 50,
    slug: "cintamu",
    title: "Cintamu",
    artist_slug: "rossa",
    album: "Rossa",
    release_year: 2000,
    duration_seconds: 252,
    genre: "Pop",
  },
  {
    id: 51,
    slug: "tak-sadar",
    title: "Tak Sadar",
    artist_slug: "rossa",
    album: "Rossa",
    release_year: 2000,
    duration_seconds: 244,
    genre: "Pop",
  },
  {
    id: 52,
    slug: "janji",
    title: "Janji",
    artist_slug: "rossa",
    album: "All New Singles",
    release_year: 2009,
    duration_seconds: 258,
    genre: "Soul",
  },

  // --- Peterpan ---
  {
    id: 53,
    slug: "bawang-merah",
    title: "Bawang Merah",
    artist_slug: "peterpan",
    album: "Peterpan",
    release_year: 1999,
    duration_seconds: 256,
    genre: "Alternative Rock",
  },
  {
    id: 54,
    slug: "lir-ilir",
    title: "Lir-ilir",
    artist_slug: "peterpan",
    album: "Takut",
    release_year: 2005,
    duration_seconds: 238,
    genre: "Alternative Rock",
  },
  {
    id: 55,
    slug: "abadi",
    title: "Abadi",
    artist_slug: "peterpan",
    album: "Alices",
    release_year: 2002,
    duration_seconds: 270,
    genre: "Alternative Rock",
  },

  // --- Anggun ---
  {
    id: 56,
    slug: "tua-tua-keladi",
    title: "Tua Tua Keladi",
    artist_slug: "anggun",
    album: "Tua Tua Keladi",
    release_year: 1986,
    duration_seconds: 228,
    genre: "Pop",
  },
  {
    id: 57,
    slug: "mimpi",
    title: "Mimpi",
    artist_slug: "anggun",
    album: "Mimpi",
    release_year: 1989,
    duration_seconds: 252,
    genre: "Pop",
  },
  {
    id: 58,
    slug: "chrysalis",
    title: "Chrysalis",
    artist_slug: "anggun",
    album: "Chrysalis",
    release_year: 2000,
    duration_seconds: 268,
    genre: "Pop",
  },
  {
    id: 59,
    slug: "snow-on-the-sahara",
    title: "Snow on the Sahara",
    artist_slug: "anggun",
    album: "Snow on the Sahara",
    release_year: 1998,
    duration_seconds: 247,
    genre: "Pop",
  },
  {
    id: 60,
    slug: "cinta-anggun",
    title: "Cinta",
    artist_slug: "anggun",
    album: "Tua Tua Keladi",
    release_year: 1986,
    duration_seconds: 235,
    genre: "Pop",
  },

  // --- Maliq & D'Essentials ---
  {
    id: 61,
    slug: "mari-berdance",
    title: "Mari Berdance",
    artist_slug: "maliq-dessentials",
    album: "Inti",
    release_year: 2001,
    duration_seconds: 288,
    genre: "Soul",
  },
  {
    id: 62,
    slug: "diary-depresiku",
    title: "Diary Depresiku",
    artist_slug: "maliq-dessentials",
    album: "Sputnik",
    release_year: 2005,
    duration_seconds: 270,
    genre: "Soul",
  },
  {
    id: 63,
    slug: "senyap",
    title: "Senyap",
    artist_slug: "maliq-dessentials",
    album: "Wardrobe",
    release_year: 2013,
    duration_seconds: 252,
    genre: "Soul",
  },

  // --- Judika ---
  {
    id: 64,
    slug: "cinta-gila",
    title: "Cinta Gila",
    artist_slug: "judika",
    album: "Cinta Gila",
    release_year: 2009,
    duration_seconds: 238,
    genre: "Pop",
  },
  {
    id: 65,
    slug: "surat-cinta",
    title: "Surat Cinta",
    artist_slug: "judika",
    album: "Cinta Gila",
    release_year: 2009,
    duration_seconds: 261,
    genre: "Pop",
  },
  {
    id: 66,
    slug: "setiap-hari",
    title: "Setiap Hari",
    artist_slug: "judika",
    album: "Terbuka",
    release_year: 2010,
    duration_seconds: 250,
    genre: "R&B",
  },
];
