import supabase from "../config/supabase.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import {
  generateQRCode,
} from "../utils/generateQRCode.js";


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


// =====================================================
// GET PAYMENT BY ORDER ID
// =====================================================

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
    } = req.validated.body;


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