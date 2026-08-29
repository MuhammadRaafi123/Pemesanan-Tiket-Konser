import supabase from "../config/supabase.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import {
  createOrderService,
} from "../services/order.service.js";

import {
  formatToWIB,
} from "../utils/dateTime.js";


// =====================================================
// FORMAT ORDER DATE
// =====================================================

const formatOrderDates = (order) => {
  if (!order) {
    return order;
  }

  return {
    ...order,

    created_at: formatToWIB(
      order.created_at
    ),

    expires_at: formatToWIB(
      order.expires_at
    ),
  };
};


// =====================================================
// CREATE ORDER
// =====================================================

export const createOrder = async (
  req,
  res,
  next
) => {
  try {
    const {
      items,
    } = req.validated.body;

    const result =
      await createOrderService(
        req.user.id,
        items
      );

    return successResponse(
      res,
      "Order berhasil dibuat",
      {
        ...result,

        order:
          formatOrderDates(
            result.order
          ),
      },
      201
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET MY ORDERS
// =====================================================

export const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const {
      data,
      error,
    } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          qty,
          subtotal,
          ticket_categories (
            id,
            category_name,
            price,
            events (
              id,
              title,
              event_date,
              location,
              poster
            )
          )
        ),
        payments (
          id,
          payment_method,
          proof_image,
          status,
          verified_at
        )
      `)
      .eq(
        "user_id",
        req.user.id
      )
      .order("created_at", {
        ascending: false,
      });


    if (error) {
      throw error;
    }


    const formattedData =
      data.map(
        (order) => ({
          ...formatOrderDates(
            order
          ),

          payments:
            order.payments?.map(
              (payment) => ({
                ...payment,

                verified_at:
                  formatToWIB(
                    payment.verified_at
                  ),
              })
            ) || [],

          order_items:
            order.order_items || [],
        })
      );


    return successResponse(
      res,
      "Data order berhasil diambil",
      formattedData
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET ORDER BY ID
// =====================================================

export const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;


    const {
      data,
      error,
    } = await supabase
      .from("orders")
      .select(`
        *,
        users (
          id,
          name,
          email,
          phone
        ),
        order_items (
          id,
          qty,
          subtotal,
          ticket_categories (
            id,
            category_name,
            price,
            events (
              id,
              title,
              event_date,
              location,
              poster
            )
          )
        ),
        payments (
          id,
          payment_method,
          proof_image,
          status,
          verified_at
        )
      `)
      .eq(
        "id",
        id
      )
      .maybeSingle();


    if (error) {
      throw error;
    }


    if (!data) {
      return errorResponse(
        res,
        "Order tidak ditemukan",
        404
      );
    }


    // Customer hanya boleh
    // melihat order miliknya
    if (
      req.user.role !== "admin" &&
      data.user_id !== req.user.id
    ) {
      return errorResponse(
        res,
        "Anda tidak memiliki akses ke order ini",
        403
      );
    }


    const formattedData = {
      ...formatOrderDates(
        data
      ),

      payments:
        data.payments?.map(
          (payment) => ({
            ...payment,

            verified_at:
              formatToWIB(
                payment.verified_at
              ),
          })
        ) || [],
    };


    return successResponse(
      res,
      "Detail order berhasil diambil",
      formattedData
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

export const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.query;


    let query = supabase
      .from("orders")
      .select(`
        *,
        users (
          id,
          name,
          email,
          phone
        ),
        order_items (
          id,
          qty,
          subtotal,
          ticket_categories (
            id,
            category_name,
            events (
              id,
              title
            )
          )
        ),
        payments (
          id,
          payment_method,
          status,
          verified_at
        )
      `)
      .order("created_at", {
        ascending: false,
      });


    if (status) {
      query = query.eq(
        "status",
        status
      );
    }


    const {
      data,
      error,
    } = await query;


    if (error) {
      throw error;
    }


    const formattedData =
      data.map(
        (order) => ({
          ...formatOrderDates(
            order
          ),

          payments:
            order.payments?.map(
              (payment) => ({
                ...payment,

                verified_at:
                  formatToWIB(
                    payment.verified_at
                  ),
              })
            ) || [],
        })
      );


    return successResponse(
      res,
      "Semua data order berhasil diambil",
      formattedData
    );

  } catch (error) {
    next(error);
  }
};


// =====================================================
// CANCEL ORDER
// =====================================================

export const cancelOrder = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;


    // =========================================
    // AMBIL ORDER
    // =========================================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        status,
        order_items (
          ticket_category_id,
          qty
        )
      `)
      .eq(
        "id",
        id
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
    // CEK PEMILIK
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
    // HANYA PENDING
    // =========================================

    if (
      order.status !==
      "pending"
    ) {
      return errorResponse(
        res,
        "Order tidak dapat dibatalkan",
        400
      );
    }


    // =========================================
    // CEK PAYMENT
    // =========================================

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payments")
      .select(
        "id, status"
      )
      .eq(
        "order_id",
        order.id
      )
      .maybeSingle();


    if (paymentError) {
      throw paymentError;
    }


    if (payment) {
      return errorResponse(
        res,
        "Order yang sudah memiliki pembayaran tidak dapat dibatalkan",
        400
      );
    }


    // =========================================
    // RELEASE RESERVATION
    // =========================================

    for (
      const item
      of order.order_items || []
    ) {

      const {
        error: releaseError,
      } = await supabase.rpc(
        "release_ticket_stock",
        {
          p_ticket_category_id:
            item.ticket_category_id,

          p_qty:
            item.qty,
        }
      );


      if (releaseError) {
        throw releaseError;
      }
    }


    // =========================================
    // UPDATE ORDER
    // =========================================

    const {
      data: updatedOrder,
      error: updateError,
    } = await supabase
      .from("orders")
      .update({
        status:
          "cancelled",
      })
      .eq(
        "id",
        order.id
      )
      .select()
      .single();


    if (updateError) {
      throw updateError;
    }


    return successResponse(
      res,
      "Order berhasil dibatalkan",
      formatOrderDates(
        updatedOrder
      )
    );

  } catch (error) {
    next(error);
  }
};