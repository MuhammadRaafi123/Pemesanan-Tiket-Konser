import api from "@/lib/axios";
import { Event } from "./types";

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    artist_id: 1,
    title: "Coldplay: Music of the Spheres World Tour",
    description: "Pengalaman konser stadium terbesar tahun ini bersama Coldplay membawakan lagu-lagu legendaris 'Yellow', 'Fix You', 'Viva La Vida', serta album terbaru mereka dalam panggung megah berteknologi ramah lingkungan dan kembang api spektakuler.",
    location: "Jakarta, Indonesia",
    venue: "Gelora Bung Karno (GBK) Stadium",
    event_date: "2026-11-15T19:30:00Z",
    poster: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    status: "open",
    genre: "Pop / Rock",
    featured: true,
    artists: {
      id: 1,
      name: "Coldplay",
      photo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
      description: "Band rock legendaris asal Inggris pemenang berbagai penghargaan Grammy dengan rekor tur stadion global.",
      genre: "Alternative Rock / Pop",
    },
    ticket_categories: [
      {
        id: 101,
        event_id: 1,
        category_name: "VIP Infinity Ultimate",
        price: 3500000,
        quota: 500,
        remaining: 42,
        perks: ["Akses Paling Depan Panggung", "Exclusive Tour Lanyard & Merch", "Dedicated VIP Lounge & Snack", "Priority Fast-track Entrance"],
      },
      {
        id: 102,
        event_id: 1,
        category_name: "Festival Standing",
        price: 1850000,
        quota: 1500,
        remaining: 198,
        perks: ["Area Berdiri Bebas Dekat Soundboard", "Wristband LED Glow", "General Entrance"],
      },
      {
        id: 103,
        event_id: 1,
        category_name: "Tribune Tier 1 Seated",
        price: 1200000,
        quota: 2000,
        remaining: 540,
        perks: ["Numbered Reserved Seat", "Panoramic Stadium View", "Standard Entry Gate"],
      },
      {
        id: 104,
        event_id: 1,
        category_name: "Cat 3 Upper Tribune",
        price: 750000,
        quota: 2500,
        remaining: 1100,
        perks: ["Upper Tier Seat", "Standard Entry Gate"],
      },
    ],
  },
  {
    id: 2,
    artist_id: 2,
    title: "Sheila on 7: Tunggu Aku Di Kotamu Tour 2026",
    description: "Konser nostalgia penuh kehangatan dan kebersamaan bersama Sheila on 7! Nyanyikan bersama 'Dan...', 'Sephia', 'Sahabat Sejati', dan puluhan hits abadi yang telah menemani perjalanan hidup jutaan penggemar lintas generasi.",
    location: "Yogyakarta, Indonesia",
    venue: "Stadion Mandala Krida",
    event_date: "2026-10-24T19:00:00Z",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    status: "open",
    genre: "Indie / Pop Rock",
    featured: true,
    artists: {
      id: 2,
      name: "Sheila on 7",
      photo: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=600&auto=format&fit=crop",
      description: "Grup musik legendaris asal Yogyakarta dengan karya-karya abadi pencetak hits sepanjang masa.",
      genre: "Indonesian Pop / Rock",
    },
    ticket_categories: [
      {
        id: 201,
        event_id: 2,
        category_name: "VIP Sephia Lounge",
        price: 1250000,
        quota: 300,
        remaining: 15,
        perks: ["Tempat Duduk Terdepan Eksklusif", "Official T-Shirt & Totebag", "Free Flow Soft Drinks", "Jalur Masuk Khusus"],
      },
      {
        id: 202,
        event_id: 2,
        category_name: "Festival Sahabat Sejati",
        price: 650000,
        quota: 3000,
        remaining: 420,
        perks: ["Area Festival Depan Panggung", "Koleksi Wristband Edisi Khusus"],
      },
      {
        id: 203,
        event_id: 2,
        category_name: "Tribune Kita",
        price: 450000,
        quota: 2000,
        remaining: 850,
        perks: ["Tribun Duduk Bernomor", "Akses Pintu Barat & Timur"],
      },
    ],
  },
  {
    id: 3,
    artist_id: 3,
    title: "Neon Pulse: Neon Cyber EDM Festival 2026",
    description: "Festival musik elektronik terbesar di Asia Tenggara menampilkan tata panggung laser hologram 3D, pyrotechnics, dan DJ papan atas dunia yang siap mengguncang malam dengan dentuman bass tiada henti.",
    location: "Bali, Indonesia",
    venue: "GWK Cultural Park Bali",
    event_date: "2026-12-31T18:00:00Z",
    poster: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop",
    status: "open",
    genre: "EDM / Electronic",
    featured: true,
    artists: {
      id: 3,
      name: "Martin Garrix & Friends",
      photo: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
      description: "Produser musik dan DJ nomor wahid dunia dengan jutaan pendengar di seluruh penjuru dunia.",
      genre: "Electro House / EDM",
    },
    ticket_categories: [
      {
        id: 301,
        event_id: 3,
        category_name: "VVIP Cyber Deck (2-Day Pass)",
        price: 4500000,
        quota: 200,
        remaining: 18,
        perks: ["Elevated VIP Viewing Platform", "Complimentary Cocktails & Tapas", "Private Bar & Restroom", "VIP Fast Pass"],
      },
      {
        id: 302,
        event_id: 3,
        category_name: "General Admission GA (2-Day Pass)",
        price: 1600000,
        quota: 4000,
        remaining: 680,
        perks: ["Akses 2 Hari Penuh ke Seluruh 3 Panggung Festival", "Laser Show Experience"],
      },
      {
        id: 303,
        event_id: 3,
        category_name: "Single Day Pass - Day 2 Countdown",
        price: 950000,
        quota: 2500,
        remaining: 310,
        perks: ["Akses Hari Ke-2 (New Year Countdown)", "Wristband Glow"],
      },
    ],
  },
  {
    id: 4,
    artist_id: 4,
    title: "Tulus: Konser Manusia Epilog Nusantara",
    description: "Sebuah persembahan megah dan intim dari Tulus membawakan aransemen orkestra megah bersama 40 musisi orkestra simfoni nasional. Nikmati lantunan suara merdu dan puisi liris yang menyentuh sanubari.",
    location: "Bandung, Indonesia",
    venue: "Sasana Budaya Ganesha (Sabuga)",
    event_date: "2026-09-30T19:30:00Z",
    poster: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
    status: "open",
    genre: "Jazz / Pop",
    featured: false,
    artists: {
      id: 4,
      name: "Tulus",
      photo: "https://images.unsplash.com/photo-1520523839898-5071280387e0?q=80&w=600&auto=format&fit=crop",
      description: "Penyanyi & penulis lagu terkemuka Indonesia dengan vokal khas berbalut jazz dan soul hangat.",
      genre: "Pop / Soul / Jazz",
    },
    ticket_categories: [
      {
        id: 401,
        event_id: 4,
        category_name: "Diamond Center Row",
        price: 1750000,
        quota: 150,
        remaining: 8,
        perks: ["Kursi Paling Depan Tengah", "Exclusive Booklet & CD Bertanda Tangan", "Meet & Greet Photo Pass"],
      },
      {
        id: 402,
        event_id: 4,
        category_name: "Gold Orchestra Seated",
        price: 950000,
        quota: 600,
        remaining: 124,
        perks: ["Numbered Theater Seat", "Akustik Sabuga Terbaik"],
      },
      {
        id: 403,
        event_id: 4,
        category_name: "Silver Balcony",
        price: 550000,
        quota: 800,
        remaining: 215,
        perks: ["Balcony View", "Standard Entry"],
      },
    ],
  },
  {
    id: 5,
    artist_id: 5,
    title: "Dewa 19 ft. All Stars: Symphony of Legends",
    description: "Konser perayaan mahakarya Dewa 19 menghadirkan deretan vokalis legendaris: Ari Lasso, Once Mekel, Ello, Virzha, berpadu megahnya iringan Prague Philharmonic Orchestra.",
    location: "Surabaya, Indonesia",
    venue: "Grand City Convention Hall",
    event_date: "2026-10-18T19:30:00Z",
    poster: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    status: "open",
    genre: "Rock / Symphony",
    featured: false,
    artists: {
      id: 5,
      name: "Dewa 19",
      photo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      description: "Band legendaris pelopor musik rock Indonesia karya Ahmad Dhani dan kawan-kawan.",
      genre: "Classic Rock / Pop Rock",
    },
    ticket_categories: [
      {
        id: 501,
        event_id: 5,
        category_name: "Bintang Lima VIP",
        price: 2200000,
        quota: 250,
        remaining: 30,
        perks: ["Front Row Sofa Seat", "Exclusive Collector Box & Vinyl", "VIP Dinner Access"],
      },
      {
        id: 502,
        event_id: 5,
        category_name: "Festival Baladewa",
        price: 750000,
        quota: 1500,
        remaining: 310,
        perks: ["Standing Area", "Merchandise T-Shirt"],
      },
      {
        id: 503,
        event_id: 5,
        category_name: "Tribune Pandawa",
        price: 500000,
        quota: 1200,
        remaining: 420,
        perks: ["Numbered Seat", "Standard Entry"],
      },
    ],
  },
];

export async function fetchEvents(): Promise<Event[]> {
  try {
    const res = await api.get("/events");
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return MOCK_EVENTS;
  } catch {
    return MOCK_EVENTS;
  }
}

export async function fetchEventById(id: number | string): Promise<Event | null> {
  try {
    const res = await api.get(`/events/${id}`);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  const found = MOCK_EVENTS.find((e) => String(e.id) === String(id));
  return found || MOCK_EVENTS[0];
}
