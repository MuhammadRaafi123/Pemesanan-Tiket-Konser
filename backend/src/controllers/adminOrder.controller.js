import supabase from "../config/supabase.js";
import { successResponse } from "../utils/apiResponse.js";
import { generateOrderCode } from "../utils/generateOrderCode.js";
import { generateQRCode } from "../utils/generateQRCode.js";

export const createOfflineOrder = async (req, res, next) => {
  try {
    const { user_id, payment_method, items } = req.validated.body;
    let orderCode = generateOrderCode();

    // Hindari konflik kode sebelum transaksi database dibuat.
    while (true) {
      const { data, error } = await supabase.from("orders").select("id")
        .eq("order_code", orderCode).maybeSingle();
      if (error) throw error;
      if (!data) break;
      orderCode = generateOrderCode();
    }

    const { data: orderId, error } = await supabase.rpc(
      "create_offline_order_transaction",
      {
        p_user_id: user_id,
        p_created_by: req.user.id,
        p_order_code: orderCode,
        p_payment_method: payment_method,
        p_items: items,
      }
    );
    if (error) {
      const rpcError = new Error(error.message);
      rpcError.statusCode = 400;
      throw rpcError;
    }

    const qrCode = await generateQRCode({ order_id: orderId, order_code: orderCode, user_id });
    const { data: order, error: orderError } = await supabase.from("orders")
      .update({ qr_code: qrCode }).eq("id", orderId).select("*").single();
    if (orderError) throw orderError;

    return successResponse(res, "Order offline berhasil dibuat dan dibayar", order, 201);
  } catch (error) {
    next(error);
  }
};
