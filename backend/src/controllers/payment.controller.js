import os from "node:os";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import {
  generateQRCode,
} from "../utils/generateQRCode.js";

const LOCAL_PAYMENT_METHODS = new Set([
  "BCA", "BRI", "BNI", "MANDIRI", "CIMB", "PERMATA",
  "BCA_VA", "BRI_VA", "BNI_VA", "MANDIRI_VA", "PERMATA_VA",
  "GOPAY", "DANA", "OVO", "SHOPEEPAY", "LINKAJA", "QRIS",
]);

const getLanAddress = () => {
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces).flatMap((items) => (items || [])
    .filter((item) => item.family === "IPv4" && !item.internal && !item.address.startsWith("169.254."))
    .map((item) => item.address));
  return addresses.find((address) => address.startsWith("192.168.")) ||
    addresses.find((address) => address.startsWith("10.")) || addresses[0] || null;
};

const readLocalPaymentToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload?.purpose !== "local_demo_payment" || !LOCAL_PAYMENT_METHODS.has(payload.payment_method)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const getLocalPaymentQr = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return errorResponse(res, "QR simulasi hanya tersedia di lingkungan lokal", 404);
    }
    const paymentMethod = String(req.query.payment_method || "");
    if (!LOCAL_PAYMENT_METHODS.has(paymentMethod)) return errorResponse(res, "Metode pembayaran tidak valid", 400);

    const { data: order, error } = await supabase.from("orders")
      .select("id,user_id,order_code,total,status,expires_at")
      .eq("id", req.params.orderId).maybeSingle();
    if (error) throw error;
    if (!order) return errorResponse(res, "Order tidak ditemukan", 404);
    if (String(order.user_id) !== String(req.user.id)) return errorResponse(res, "Anda tidak memiliki akses", 403);
    if (order.status !== "pending" || (order.expires_at && new Date(order.expires_at) <= new Date())) {
      return errorResponse(res, "Pesanan sudah tidak dapat dibayar", 400);
    }

    // Referer preserves the actual frontend port (Next may use 3001 when 3000 is busy).
    const frontendOrigin = req.get("referer") || req.get("origin") || process.env.FRONTEND_URL || "http://localhost:3000";
    const scanUrl = new URL("/scan-payment", frontendOrigin);
    if (["localhost", "127.0.0.1"].includes(scanUrl.hostname)) {
      const lanHost = process.env.QR_PUBLIC_HOST || getLanAddress();
      if (lanHost) scanUrl.hostname = lanHost;
    }
    const remainingSeconds = order.expires_at
      ? Math.max(1, Math.ceil((new Date(order.expires_at).getTime() - Date.now()) / 1000))
      : 900;
    const token = jwt.sign({
      purpose: "local_demo_payment",
      order_id: order.id,
      user_id: order.user_id,
      payment_method: paymentMethod,
    }, process.env.JWT_SECRET, { expiresIn: Math.min(900, remainingSeconds) });
    scanUrl.searchParams.set("token", token);
    const qrCode = await generateQRCode(scanUrl.toString());
    return successResponse(res, "QR simulasi dibuat", {
      qr_code: qrCode,
      scan_url: scanUrl.toString(),
      order_code: order.order_code,
      amount: Number(order.total),
      expires_at: order.expires_at,
    });
  } catch (error) {
    next(error);
  }
};

export const getLocalPaymentPreview = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") return errorResponse(res, "Simulasi lokal tidak tersedia", 404);
    const token = readLocalPaymentToken(String(req.query.token || ""));
    if (!token) return errorResponse(res, "QR tidak valid atau sudah kedaluwarsa", 400);

    const { data: order, error } = await supabase.from("orders")
      .select(`id,user_id,order_code,total,status,qr_code,created_at,expires_at,order_items(id,qty,subtotal,ticket_categories(category_name,events(id,title,event_date,location,status))),payments(status,payment_method)`)
      .eq("id", token.order_id).maybeSingle();
    if (error) throw error;
    if (!order || String(order.user_id) !== String(token.user_id)) return errorResponse(res, "Tagihan tidak ditemukan", 404);

    const firstEvent = order.order_items?.[0]?.ticket_categories?.events || null;
    const firstPayment = Array.isArray(order.payments) ? order.payments[0] : order.payments;
    return successResponse(res, "Detail tagihan simulasi", {
      id: order.id,
      user_id: order.user_id,
      order_code: order.order_code,
      total: Number(order.total),
      status: order.status,
      is_expired: Boolean(order.expires_at && new Date(order.expires_at) <= new Date()),
      qr_code: order.qr_code,
      created_at: order.created_at,
      expires_at: order.expires_at,
      events: firstEvent,
      payment_method: firstPayment?.payment_method?.replace(/^SIMULASI_/, "") || token.payment_method,
      payment: firstPayment || undefined,
      order_items: (order.order_items || []).map((item) => ({
        id: item.id,
        qty: item.qty,
        subtotal: Number(item.subtotal),
        ticket_categories: item.ticket_categories ? { category_name: item.ticket_categories.category_name } : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const simulateLocalPayment = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return errorResponse(res, "Simulasi pembayaran hanya tersedia di lingkungan lokal", 404);
    }

    const token = readLocalPaymentToken(req.validated.body.token);
    if (!token) return errorResponse(res, "QR tidak valid atau sudah kedaluwarsa", 400);
    const paymentMethod = req.validated.body.payment_method;
    if (!LOCAL_PAYMENT_METHODS.has(paymentMethod)) return errorResponse(res, "Metode pembayaran tidak valid", 400);
    const { data: order, error: orderError } = await supabase.from("orders")
      .select("id,user_id,order_code,total,status,expires_at")
      .eq("id", token.order_id).maybeSingle();
    if (orderError) throw orderError;
    if (!order) return errorResponse(res, "Order tidak ditemukan", 404);
    if (String(order.user_id) !== String(token.user_id)) return errorResponse(res, "Anda tidak memiliki akses", 403);
    if (order.status !== "pending" || (order.expires_at && new Date(order.expires_at) <= new Date())) {
      return errorResponse(res, "Pesanan sudah tidak dapat dibayar", 400);
    }

    const { data: existing, error: existingError } = await supabase.from("payments")
      .select("id,status").eq("order_id", order.id).maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      if (existing.status === "approved") return successResponse(res, "Simulasi pembayaran sudah selesai");
      return errorResponse(res, "Pembayaran pesanan ini sudah dibuat", 409);
    }

    const { data: payment, error: paymentError } = await supabase.from("payments")
      .insert({ order_id: order.id, payment_method: `SIMULASI_${paymentMethod}`, status: "pending" })
      .select("id").single();
    if (paymentError) throw paymentError;

    try {
      const qrCode = await generateQRCode({ order_id: order.id, order_code: order.order_code, user_id: order.user_id });
      const { error: verifyError } = await supabase.rpc("verify_payment_transaction", {
        p_payment_id: payment.id,
        p_status: "approved",
        p_verified_by: null,
        p_rejection_reason: null,
        p_qr_code: qrCode,
      });
      if (verifyError) throw verifyError;
    } catch (verificationError) {
      await supabase.from("payments").delete().eq("id", payment.id).eq("status", "pending");
      throw verificationError;
    }

    return successResponse(res, "Simulasi pembayaran berhasil", { payment_id: payment.id, status: "approved" }, 201);
  } catch (error) {
    next(error);
  }
};


// =====================================================
// CREATE PAYMENT
// Customer upload bukti pembayaran
// =====================================================

export const createPayment = async (
  req,
  res,
  next
) => {
  try {
    const {
      order_id,
      payment_method,
      payer_name,
      transaction_reference,
      paid_amount,
    } = req.validated.body;


    // =========================================
    // CEK ORDER
    // =========================================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .maybeSingle();


    if (orderError) {
      throw orderError;
    }


    if (!order) {
      return errorResponse(
        res,
        "Order tidak ditemukan",
        404
      );
    }


    // =========================================
    // CEK KEPEMILIKAN ORDER
    // =========================================

    if (
      order.user_id !==
      req.user.id
    ) {
      return errorResponse(
        res,
        "Anda tidak memiliki akses ke order ini",
        403
      );
    }


    // =========================================
    // ORDER HARUS PENDING
    // =========================================

    if (
      order.status !==
      "pending"
    ) {
      return errorResponse(
        res,
        "Order ini tidak dapat dibayar",
        400
      );
    }

    if (
      order.expires_at &&
      new Date(order.expires_at) <= new Date()
    ) {
      return errorResponse(
        res,
        "Order sudah melewati batas waktu pembayaran",
        400
      );
    }


    // =========================================
    // CEK PEMBAYARAN SUDAH ADA
    // =========================================

    const {
      data: existingPayment,
      error: paymentCheckError,
    } = await supabase
      .from("payments")
      .select("id")
      .eq(
        "order_id",
        order_id
      )
      .maybeSingle();


    if (paymentCheckError) {
      throw paymentCheckError;
    }


    if (existingPayment) {
      return errorResponse(
        res,
        "Pembayaran untuk order ini sudah dibuat",
        409
      );
    }


    // =========================================
    // CEK BUKTI PEMBAYARAN
    // =========================================

    if (!req.file) {
      return errorResponse(
        res,
        "Bukti pembayaran wajib diupload",
        400
      );
    }


    const proofImage =
      `/uploads/payments/${req.file.filename}`;


    // =========================================
    // CREATE PAYMENT
    // =========================================

    const {
      data,
      error,
    } = await supabase
      .from("payments")
      .insert({
        order_id,

        payment_method,

        payer_name,

        transaction_reference,

        paid_amount,

        proof_image:
          proofImage,

        status:
          "pending",
      })
      .select()
      .single();


    if (error) {
      throw error;
    }


    return successResponse(
      res,
      "Bukti pembayaran berhasil dikirim",
      data,
      201
    );

  } catch (error) {
    next(error);
  }
};

export const getPaymentByOrderId = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
    } = req.params;


    // =========================================
    // CEK ORDER
    // =========================================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        user_id
      `)
      .eq(
        "id",
        orderId
      )
      .maybeSingle();


    if (orderError) {
      throw orderError;
    }


    if (!order) {
      return errorResponse(
        res,
        "Order tidak ditemukan",
        404
      );
    }


    // =========================================
    // CEK AKSES
    // =========================================

    if (
      req.user.role !== "admin" &&
      order.user_id !== req.user.id
    ) {
      return errorResponse(
        res,
        "Anda tidak memiliki akses",
        403
      );
    }


    // =========================================
    // AMBIL PAYMENT
    // =========================================

    const {
      data,
      error,
    } = await supabase
      .from("payments")
      .select("*")
      .eq(
        "order_id",
        orderId
      )
      .maybeSingle();


    if (error) {
      throw error;
    }


    if (!data) {
      return errorResponse(
        res,
        "Data pembayaran belum ada",
        404
      );
    }


    return successResponse(
      res,
      "Data pembayaran berhasil diambil",
      data
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// VERIFY PAYMENT
// Admin approve / reject
// =====================================================

export const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      status,
      rejection_reason,
    } = req.validated.body;


    // QR dibuat sebelum RPC; seluruh perubahan data penting di bawah ini
    // tetap terjadi atomik di PostgreSQL melalui verify_payment_transaction.
    let qrCode = null;

    if (status === "approved") {
      const { data: paymentForQr, error: paymentForQrError } = await supabase
        .from("payments")
        .select(`
          order_id,
          orders (id, order_code, user_id)
        `)
        .eq("id", id)
        .maybeSingle();

      if (paymentForQrError) throw paymentForQrError;
      if (!paymentForQr?.orders) {
        return errorResponse(res, "Pembayaran tidak ditemukan", 404);
      }

      qrCode = await generateQRCode({
        order_id: paymentForQr.orders.id,
        order_code: paymentForQr.orders.order_code,
        user_id: paymentForQr.orders.user_id,
      });
    }

    const { error: verifyError } = await supabase.rpc(
      "verify_payment_transaction",
      {
        p_payment_id: Number(id),
        p_status: status,
        p_verified_by: req.user.id,
        p_rejection_reason: rejection_reason || null,
        p_qr_code: qrCode,
      }
    );

    if (verifyError) {
      const error = new Error(verifyError.message);
      error.statusCode = 400;
      throw error;
    }

    const { data: verifiedPayment, error: verifiedPaymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();

    if (verifiedPaymentError) throw verifiedPaymentError;

    const { data: verifiedOrder, error: verifiedOrderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", verifiedPayment.order_id)
      .single();

    if (verifiedOrderError) throw verifiedOrderError;

    return successResponse(
      res,
      status === "approved" ? "Pembayaran berhasil disetujui" : "Pembayaran ditolak",
      { payment: verifiedPayment, order: verifiedOrder }
    );


    // =========================================
    // AMBIL PAYMENT + ORDER + ITEMS + TICKET
    // =========================================

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payments")
      .select(`
        *,
        orders (
          id,
          order_code,
          user_id,
          total,
          status,
          order_items (
            id,
            ticket_category_id,
            qty,
            subtotal,
            ticket_categories (
              id,
              category_name,
              quota,
              remaining,
              reserved
            )
          )
        )
      `)
      .eq(
        "id",
        id
      )
      .maybeSingle();


    if (paymentError) {
      throw paymentError;
    }


    if (!payment) {
      return errorResponse(
        res,
        "Pembayaran tidak ditemukan",
        404
      );
    }


    // =========================================
    // JANGAN VERIFIKASI ULANG
    // =========================================

    if (
      payment.status !==
      "pending"
    ) {
      return errorResponse(
        res,
        "Pembayaran sudah diverifikasi sebelumnya",
        400
      );
    }


    const order =
      payment.orders;


    if (!order) {
      return errorResponse(
        res,
        "Order terkait tidak ditemukan",
        404
      );
    }


    if (
      order.status !==
      "pending"
    ) {
      return errorResponse(
        res,
        "Order sudah tidak dalam status pending",
        400
      );
    }


    const orderItems =
      order.order_items || [];


    // =================================================
    // APPROVED
    // =================================================

    if (
      status ===
      "approved"
    ) {

      // =======================================
      // CEK RESERVATION
      // =======================================

      for (
        const item
        of orderItems
      ) {

        const ticket =
          item.ticket_categories;


        if (!ticket) {
          return errorResponse(
            res,
            "Kategori tiket tidak ditemukan",
            404
          );
        }


        if (
          ticket.reserved <
          item.qty
        ) {
          return errorResponse(
            res,
            `Reservation tiket ${ticket.category_name} tidak mencukupi`,
            400
          );
        }
      }


      // =======================================
      // TANDATANGANI PAYMENT APPROVED
      // =======================================

      const {
        data: updatedPayment,
        error:
          updatePaymentError,
      } = await supabase
        .from("payments")
        .update({
          status:
            "approved",

          verified_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          payment.id
        )
        .select()
        .single();


      if (
        updatePaymentError
      ) {
        throw updatePaymentError;
      }


      // =======================================
      // UBAH RESERVED → SOLD
      // =======================================

      for (
        const item
        of orderItems
      ) {

        const ticket =
          item.ticket_categories;


        const newRemaining =
          ticket.remaining -
          item.qty;


        const newReserved =
          ticket.reserved -
          item.qty;


        if (
          newRemaining <
          0
        ) {
          const error =
            new Error(
              `Sisa tiket ${ticket.category_name} tidak mencukupi`
            );

          error.statusCode =
            400;

          throw error;
        }


        const {
          error:
            updateTicketError,
        } = await supabase
          .from(
            "ticket_categories"
          )
          .update({
            remaining:
              newRemaining,

            reserved:
              newReserved,
          })
          .eq(
            "id",
            ticket.id
          );


        if (
          updateTicketError
        ) {
          throw updateTicketError;
        }
      }


      // =======================================
      // GENERATE QR
      // =======================================

      const qrCode =
        await generateQRCode({
          order_id:
            order.id,

          order_code:
            order.order_code,

          user_id:
            order.user_id,
        });


      // =======================================
      // ORDER → PAID
      // =======================================

      const {
        data: updatedOrder,
        error:
          orderUpdateError,
      } = await supabase
        .from("orders")
        .update({
          status:
            "paid",

          qr_code:
            qrCode,
        })
        .eq(
          "id",
          order.id
        )
        .select()
        .single();


      if (
        orderUpdateError
      ) {
        throw orderUpdateError;
      }


      return successResponse(
        res,
        "Pembayaran berhasil disetujui",
        {
          payment:
            updatedPayment,

          order:
            updatedOrder,
        }
      );
    }


    // =================================================
    // REJECTED
    // =================================================

    if (
      status ===
      "rejected"
    ) {

      // =======================================
      // UPDATE PAYMENT
      // =======================================

      const {
        data: updatedPayment,
        error:
          updatePaymentError,
      } = await supabase
        .from("payments")
        .update({
          status:
            "rejected",

          verified_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          payment.id
        )
        .select()
        .single();


      if (
        updatePaymentError
      ) {
        throw updatePaymentError;
      }


      // =======================================
      // RELEASE RESERVATION
      // =======================================

      for (
        const item
        of orderItems
      ) {

        const {
          error:
            releaseError,
        } = await supabase.rpc(
          "release_ticket_stock",
          {
            p_ticket_category_id:
              item.ticket_category_id,

            p_qty:
              item.qty,
          }
        );


        if (
          releaseError
        ) {
          throw releaseError;
        }
      }


      // =======================================
      // ORDER → REJECTED
      // =======================================

      const {
        data: updatedOrder,
        error:
          orderUpdateError,
      } = await supabase
        .from("orders")
        .update({
          status:
            "rejected",
        })
        .eq(
          "id",
          order.id
        )
        .select()
        .single();


      if (
        orderUpdateError
      ) {
        throw orderUpdateError;
      }


      return successResponse(
        res,
        "Pembayaran ditolak",
        {
          payment:
            updatedPayment,

          order:
            updatedOrder,
        }
      );
    }


    // =========================================
    // STATUS TIDAK VALID
    // =========================================

    return errorResponse(
      res,
      "Status pembayaran tidak valid",
      400
    );

  } catch (error) {
    next(error);
  }
};
