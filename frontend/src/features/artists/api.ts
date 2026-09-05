import api from "@/lib/axios";
import { Artist } from "./types";
import { MOCK_EVENTS } from "@/features/events/api";

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 1,
    name: "Coldplay",
    photo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    description: "Band rock legendaris asal Inggris pemenang berbagai Grammy Award dengan rekor tur stadion global dan tata panggung visual paling spektakuler di dunia.",
    genre: "Alternative Rock / Stadium Pop",
    monthlyListeners: "85.4 Juta",
    upcomingEventsCount: 2,
    socials: {
      instagram: "https://instagram.com/coldplay",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
    },
    events: [MOCK_EVENTS[0]],
  },
  {
    id: 2,
    name: "Sheila on 7",
    photo: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=600&auto=format&fit=crop",
    description: "Ikon musik Indonesia asal Yogyakarta dengan karya hits abadi yang menyatukan jutaan hati penggemar di seluruh nusantara.",
    genre: "Indonesian Pop / Rock",
    monthlyListeners: "14.2 Juta",
    upcomingEventsCount: 1,
    socials: {
      instagram: "https://instagram.com/sheilaon7",
      spotify: "https://spotify.com",
    },
    events: [MOCK_EVENTS[1]],
  },
  {
    id: 3,
    name: "Martin Garrix",
    photo: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
    description: "DJ dan produser musik elektronik nomor satu dunia asal Belanda, pencetak lagu hits global 'Animals', 'Scared to Be Lonely', dan headliner festival internasional.",
    genre: "EDM / Electro House",
    monthlyListeners: "36.8 Juta",
    upcomingEventsCount: 1,
    socials: {
      instagram: "https://instagram.com/martingarrix",
      spotify: "https://spotify.com",
    },
    events: [MOCK_EVENTS[2]],
  },
  {
    id: 4,
    name: "Tulus",
    photo: "https://images.unsplash.com/photo-1520523839898-5071280387e0?q=80&w=600&auto=format&fit=crop",
    description: "Penyanyi & penulis lagu terkemuka Indonesia dengan vokal merdu berbalut nuansa jazz dan lirik puitis mendalam.",
    genre: "Pop / Soul / Jazz",
    monthlyListeners: "9.7 Juta",
    upcomingEventsCount: 1,
    socials: {
      instagram: "https://instagram.com/tulusm",
      spotify: "https://spotify.com",
    },
    events: [MOCK_EVENTS[3]],
  },
  {
    id: 5,
    name: "Dewa 19",
    photo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
    description: "Grup rock legendaris pelopor musik Indonesia karya Ahmad Dhani dengan deretan hits lintas generasi yang abadi.",
    genre: "Classic Rock / Pop Rock",
    monthlyListeners: "11.5 Juta",
    upcomingEventsCount: 1,
    socials: {
      instagram: "https://instagram.com/officialdewa19",
      spotify: "https://spotify.com",
    },
    events: [MOCK_EVENTS[4]],
  },
];

export async function fetchArtists(): Promise<Artist[]> {
  try {
    const res = await api.get("/artists");
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return MOCK_ARTISTS;
  } catch {
    return MOCK_ARTISTS;
  }
}

export async function fetchArtistById(id: number | string): Promise<Artist | null> {
  try {
    const res = await api.get(`/artists/${id}`);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  const found = MOCK_ARTISTS.find((a) => String(a.id) === String(id));
  return found || MOCK_ARTISTS[0];
}
