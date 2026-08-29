import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

import {
  expirePendingOrdersService,
} from "./services/order.service.js";


const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server berjalan di http://localhost:${PORT}`
    );

  }
);


// =========================================
// AUTO EXPIRE ORDER
// =========================================

const expireOrders = async () => {

  try {

    const expiredCount =
      await expirePendingOrdersService();

    if (expiredCount > 0) {

      console.log(
        `⏰ ${expiredCount} order expired`
      );

    }

  } catch (error) {

    console.error(
      "Gagal expire order:",
      error.message
    );

  }

};


// Jalankan setiap 1 menit
setInterval(
  expireOrders,
  60 * 1000
);


// Jalankan sekali saat server hidup
expireOrders();