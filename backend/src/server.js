import dotenv from "dotenv";
import app from "./app.js";
import { expirePendingOrdersService } from "./services/order.service.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

const EXPIRE_INTERVAL_MS = 60 * 1000;
const MAX_EXPIRE_RETRY_MS = 5 * 60 * 1000;
let nextExpireDelayMs = EXPIRE_INTERVAL_MS;

const scheduleExpireOrders = (delayMs) => {
  setTimeout(expireOrders, delayMs);
};

const expireOrders = async () => {
  try {
    const expiredCount = await expirePendingOrdersService();
    if (expiredCount > 0) {
      console.log(`${expiredCount} order kedaluwarsa.`);
    }
    nextExpireDelayMs = EXPIRE_INTERVAL_MS;
  } catch (error) {
    nextExpireDelayMs = Math.min(nextExpireDelayMs * 2, MAX_EXPIRE_RETRY_MS);
    console.warn(
      `Pengecekan order kedaluwarsa ditunda; coba lagi dalam ${Math.round(nextExpireDelayMs / 1000)} detik.`,
      error?.message || "Koneksi Supabase gagal"
    );
  } finally {
    scheduleExpireOrders(nextExpireDelayMs);
  }
};

void expireOrders();
