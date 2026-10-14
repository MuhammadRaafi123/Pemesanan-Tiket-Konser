-- Seeds the demo concert catalog into the transactional tables used by checkout.
-- Safe to rerun: existing matching rows and live inventory are never overwritten.
-- Run this once in the Supabase SQL editor after applying schema.sql.

BEGIN;

CREATE TEMP TABLE seed_artists (
  name TEXT NOT NULL,
  photo TEXT,
  description TEXT
) ON COMMIT DROP;
INSERT INTO seed_artists (name, photo, description) VALUES
  ('Tulus', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop', 'Penyanyi, penulis lagu, dan musisi Indonesia dengan warna vokal soul-jazz yang hangat serta lirik puitis yang dekat dengan lintas generasi.'),
  ('Dewa 19', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop', 'Band rock legendaris Indonesia karya Ahmad Dhani yang konsisten menyatukan lintas generasi lewat aransemen orkestra dan energi panggung yang ikonik.'),
  ('Sheila on 7', 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=600&auto=format&fit=crop', 'Band pop-rock asal Yogyakarta dengan deretan hits yang dekat dengan kehidupan sehari-hari dan sering menjadi soundtrack bersama lintas generasi.'),
  ('Padi', 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?q=80&w=600&auto=format&fit=crop', 'Band pop-rock asal Surabaya yang membawa nuansa nostalgik dan energi muda ke panggung Indonesia, aktif hampir tiga dekade tanpa pernah kehilangan relevansinya.'),
  ('Noah', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop', 'Band alternatif Bandung dengan lirik puitis, aransemen dinamis, dan pertunjukan yang emosional.'),
  ('Rossa', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop', 'Penyanyi soul dan pop Indonesia dengan vokal jernih dan repertoar yang dekat dengan berbagai momen penting.'),
  ('Peterpan', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=600&auto=format&fit=crop', 'Band alternatif Bandung yang dikenal karena vokal khas, lirik yang jujur, dan pertunjukan yang emosional.'),
  ('Anggun', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop', 'Penyanyi Indonesia yang mendunia lewat karier internasional, dikenal karena vokal servern dan repertoar lintas generasi.'),
  ('Judika', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop', 'Penyanyi pop R&B dengan rentang vokal lebar, dikenal lewat OST film dan lagu-lagu yang mudah diterima semua kalangan.');

CREATE TEMP TABLE seed_events (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  poster TEXT,
  status VARCHAR(20) NOT NULL
) ON COMMIT DROP;
INSERT INTO seed_events (id, title, artist_name, event_date, location, description, poster, status) VALUES
  (900001, 'Tulus: Konser Manusia Epilog Nusantara', 'Tulus', '2026-10-11T16:00:00+07:00', 'Stadion Utama Gelora Bung Karno, Jakarta Pusat, DKI Jakarta', 'Persembahan Tulus di Stadion Utama GBK dengan orkestra besar dan panggung media raksasa.', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900002, 'Tulus: Monokrom Live in Yogyakarta', 'Tulus', '2026-11-22T11:00:00+07:00', 'Stadion Mandala Krida, Sleman, DI Yogyakarta', 'Tur Monokrom Live Tulus di Mandala Krida dengan panggung luas dan pertunjukan tiga jam.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900003, 'Dewa 19: Symphony of Legends', 'Dewa 19', '2026-11-08T06:00:00+07:00', 'Grand City Convention & Exhibition Hall, Surabaya, Jawa Timur', 'Konser perayaan mahakarya Dewa 19 dengan orkestra simfoni dan guest dari lintas generasi.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900004, 'Pesta Nusantara Rock Festival 2026', 'Dewa 19', '2026-12-12T05:00:00+07:00', 'Stadion Utama Gelora Bung Karno, Jakarta Pusat, DKI Jakarta', 'Festival musik terbesar tahun ini dengan Dewa 19, Padi, Peterpan, dan Maliq & D''Essentials.', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900005, 'Sheila on 7: Tunggu Aku Di Kotamu Tour 2026', 'Sheila on 7', '2026-10-18T09:00:00+07:00', 'Stadion Mandala Krida, Sleman, DI Yogyakarta', 'Konser nostalgia bersama Sheila on 7 yang membawakan Dan..., Sephia, Sahabat Sejati, dan hits abadi lainnya.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900006, 'Sheila on 7: Legend Tour Bandung (Selesai)', 'Sheila on 7', '2026-08-16T04:00:00+07:00', 'GOR C-Tra Arena, Padalarang, Jawa Barat', 'Legend Tour Bandung yang sudah selesai dan sold out. Dipakai untuk uji status event closed.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop', 'closed'),
  (900007, 'Padi: 25th Anniversary Concert', 'Padi', '2026-12-05T07:00:00+07:00', 'ISTORA Senayan, Jakarta Pusat, DKI Jakarta', 'Konser merayakan 25 tahun karier Padi dengan setlist terbaik dari seluruh album dan video dokumenter.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900008, 'Padi: Sunset Session Bali', 'Padi', '2027-01-24T07:00:00+07:00', 'Echo Beach, Canggu, Bali', 'Pertunjukan sunset di pantai Canggu featuring Padi dan Maliq & D''Essentials di panggung pasir.', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900009, 'Noah: Live in GWK Ubud', 'Noah', '2026-11-07T07:00:00+07:00', 'GWK Cultural Park, Ubud, Bali', 'Konser Noah di amphitheater bambu GWK Ubud dengan energi panggung tinggi dan interaksi kuat dengan penonton.', 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900010, 'Pesta Kota: Noah & Rossa Year-End Edition', 'Noah', '2026-12-31T09:00:00+07:00', 'Grand City Convention & Exhibition Hall, Surabaya, Jawa Timur', 'Pesta year-end featuring Noah dan Rossa dengan durasi panjang dan kembang api penutup tahun.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900011, 'Rossa: Soul Night Jakarta', 'Rossa', '2026-10-25T06:00:00+07:00', 'JIS Amphitheater, Jakarta Utara, DKI Jakarta', 'Konser soul Rossa dengan aransemen band besar di panggung open air JIS Amphitheater.', 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900012, 'Peterpan: Tour of Love Bandung', 'Peterpan', '2026-11-14T08:00:00+07:00', 'Sasana Budaya Ganesha (Sabuga), Bandung, Jawa Barat', 'Konser intim Peterpan di Sabuga Bandung dengan pertunjukan acoustic dan kapasitas terbatas 5.000 penonton.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900013, 'Anggun: Chrysalis Tour Jakarta', 'Anggun', '2026-12-19T08:00:00+07:00', 'JIS Amphitheater, Jakarta Utara, DKI Jakarta', 'Konser Anggun di Amphitheater JIS dengan repertoire lintas generasi dari Tua Tua Keladi hingga hit internasional.', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900014, 'Judika: Cinta Gila Tour', 'Judika', '2027-01-09T06:00:00+07:00', 'ISTORA Senayan, Jakarta Pusat, DKI Jakarta', 'Konser Judika di Istora Senayan dengan setlist lengkap dan band instrumen yang energik.', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop', 'open'),
  (900015, 'Jazz Nusantara Festival 2027', 'Anggun', '2027-01-16T05:00:00+07:00', 'Jogja Expo Center (JEC), Sleman, DI Yogyakarta', 'Festival jazz dan pop soul terbesar di Yogyakarta featuring Anggun, Maliq & D''Essentials, dan Tulus.', 'https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=1200&auto=format&fit=crop', 'open');

CREATE TEMP TABLE seed_ticket_categories (
  id BIGINT PRIMARY KEY,
  event_id BIGINT NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  price DECIMAL(14, 2) NOT NULL,
  quota INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  reserved INTEGER NOT NULL
) ON COMMIT DROP;
INSERT INTO seed_ticket_categories (id, event_id, category_name, price, quota, remaining, reserved) VALUES
  (1001001, 900001, 'VVIP Tribune', 3500000, 200, 12, 4),
  (1001002, 900001, 'Festival Ground', 1500000, 15000, 3240, 620),
  (1001003, 900001, 'Tribune Atas', 850000, 12000, 5180, 310),
  (1002001, 900002, 'Tribune Tribun', 900000, 8000, 1420, 210),
  (1002002, 900002, 'Tribune Curiga', 550000, 6000, 2130, 150),
  (1002003, 900002, 'Festival Ground', 400000, 12000, 4870, 420),
  (1003001, 900003, 'Bintang Lima VIP', 2500000, 500, 38, 22),
  (1003002, 900003, 'Festival Floor', 950000, 8000, 2640, 480),
  (1003003, 900003, 'Tribune Pandawa', 650000, 6000, 2890, 190),
  (1004001, 900004, 'VVIP Festival Pass', 4500000, 500, 74, 31),
  (1004002, 900004, 'Festival Pass 1 Hari', 1200000, 45000, 12800, 2100),
  (1004003, 900004, 'Tribune Atas Festival', 700000, 20000, 9450, 700),
  (1004004, 900004, 'Tribune Bawah Festival', 950000, 18000, 6200, 860),
  (1005001, 900005, 'VIP Sephia Lounge', 1200000, 800, 46, 38),
  (1005002, 900005, 'Festival Sahabat Sejati', 600000, 14000, 3150, 540),
  (1005003, 900005, 'Tribune Kita', 400000, 10000, 4230, 260),
  (1006001, 900006, 'VIP Legend', 1000000, 600, 0, 0),
  (1006002, 900006, 'Tribune', 450000, 12000, 0, 0),
  (1007001, 900007, 'Diamond Seat', 1500000, 300, 21, 12),
  (1007002, 900007, 'Gold Seat', 900000, 2400, 520, 96),
  (1007003, 900007, 'Silver Seat', 550000, 5000, 1830, 140),
  (1008001, 900008, 'Sunset Deck VIP', 1800000, 400, 62, 18),
  (1008002, 900008, 'Beach Standing', 750000, 3500, 1180, 130),
  (1008003, 900008, 'General Admission', 550000, 1000, 410, 44),
  (1009001, 900009, 'Bamboo Amphitheater', 850000, 3000, 620, 180),
  (1009002, 900009, 'Open Field', 450000, 12000, 4180, 640),
  (1010001, 900010, 'VIP Lounge', 2000000, 800, 140, 66),
  (1010002, 900010, 'Festival Floor', 750000, 15000, 5240, 920),
  (1010003, 900010, 'Tribune', 450000, 5000, 2180, 180),
  (1011001, 900011, 'VIP Kat 4', 1400000, 1000, 88, 34),
  (1011002, 900011, 'Festival Amphitheater', 600000, 12000, 3320, 510),
  (1011003, 900011, 'Tribune Samping', 400000, 6000, 2410, 120),
  (1012001, 900012, 'VIP Sabuga', 1300000, 400, 28, 14),
  (1012002, 900012, 'Gold Seat', 850000, 1600, 340, 72),
  (1012003, 900012, 'Silver Seat', 600000, 3000, 1120, 96),
  (1013001, 900013, 'VIP Chrysalis', 2200000, 700, 96, 42),
  (1013002, 900013, 'Premium Seating', 1250000, 4000, 1360, 240),
  (1013003, 900013, 'General Admission', 750000, 12000, 4710, 520),
  (1014001, 900014, 'VIP Galeri', 1500000, 500, 54, 20),
  (1014002, 900014, 'Tribune A', 850000, 3000, 890, 118),
  (1014003, 900014, 'Tribune B', 600000, 4200, 1740, 88),
  (1015001, 900015, 'Festival Pass Early Bird', 950000, 5000, 620, 0),
  (1015002, 900015, 'Festival Pass Reguler', 1250000, 15000, 6400, 880),
  (1015003, 900015, 'VIP Lounge Pass', 2500000, 1200, 210, 78);

DO $seed_validation$
BEGIN
  IF EXISTS (
    SELECT 1 FROM events e JOIN seed_events s ON s.id = e.id
    WHERE e.title <> s.title
  ) THEN
    RAISE EXCEPTION 'Seed dibatalkan: ID event demo sudah dipakai event lain';
  END IF;

  IF EXISTS (
    SELECT 1 FROM ticket_categories tc
    JOIN seed_ticket_categories s ON s.id = tc.id
    WHERE tc.event_id <> s.event_id
       OR tc.category_name <> s.category_name
       OR tc.price <> s.price
       OR tc.quota <> s.quota
  ) THEN
    RAISE EXCEPTION 'Seed dibatalkan: ID kategori tiket demo sudah dipakai kategori lain';
  END IF;

  IF EXISTS (
    SELECT 1 FROM seed_events s
    WHERE NOT EXISTS (
      SELECT 1 FROM seed_artists a
      WHERE lower(a.name) = lower(s.artist_name)
    )
  ) THEN
    RAISE EXCEPTION 'Seed dibatalkan: artis untuk event demo tidak lengkap';
  END IF;
END;
$seed_validation$;

INSERT INTO artists (name, photo, description)
SELECT DISTINCT ON (lower(s.name)) s.name, s.photo, s.description
FROM seed_artists s
WHERE NOT EXISTS (
  SELECT 1 FROM artists a WHERE lower(a.name) = lower(s.name)
)
ORDER BY lower(s.name), s.name;

INSERT INTO events (id, artist_id, title, description, location, event_date, poster, status)
SELECT s.id, a.id, s.title, s.description, s.location, s.event_date, s.poster, s.status
FROM seed_events s
JOIN LATERAL (
  SELECT artist.id FROM artists artist
  WHERE lower(artist.name) = lower(s.artist_name)
  ORDER BY artist.id
  LIMIT 1
) a ON TRUE
ON CONFLICT (id) DO NOTHING;

INSERT INTO ticket_categories (id, event_id, category_name, price, quota, remaining, reserved)
SELECT id, event_id, category_name, price, quota, remaining, reserved
FROM seed_ticket_categories
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('events', 'id')::regclass, GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM events;
SELECT setval(pg_get_serial_sequence('ticket_categories', 'id')::regclass, GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0)
FROM ticket_categories;

COMMIT;

SELECT e.id, e.title, COUNT(tc.id) AS ticket_categories
FROM events e
JOIN ticket_categories tc ON tc.event_id = e.id
WHERE e.id BETWEEN 900001 AND 900015
GROUP BY e.id, e.title
ORDER BY e.id;
