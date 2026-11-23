-- Release reserved tickets for unpaid orders after the payment deadline.
-- Orders with a submitted proof stay reserved while waiting for admin review.
CREATE OR REPLACE FUNCTION public.release_ticket_stock(
    p_ticket_category_id BIGINT,
    p_qty INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.ticket_categories
    SET reserved = GREATEST(reserved - p_qty, 0)
    WHERE id = p_ticket_category_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.expire_pending_orders()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_count INTEGER := 0;
BEGIN
    FOR v_order IN
        SELECT o.id
        FROM public.orders o
        WHERE o.status = 'pending'
          AND o.expires_at IS NOT NULL
          AND o.expires_at <= NOW()
          AND NOT EXISTS (
              SELECT 1 FROM public.payments p
              WHERE p.order_id = o.id
                AND p.proof_image IS NOT NULL
          )
        FOR UPDATE
    LOOP
        FOR v_item IN
            SELECT oi.ticket_category_id, oi.qty
            FROM public.order_items oi
            WHERE oi.order_id = v_order.id
        LOOP
            PERFORM public.release_ticket_stock(v_item.ticket_category_id, v_item.qty);
        END LOOP;

        UPDATE public.orders SET status = 'cancelled' WHERE id = v_order.id;
        v_count := v_count + 1;
    END LOOP;

    RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.release_ticket_stock(BIGINT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.expire_pending_orders() TO service_role;

NOTIFY pgrst, 'reload schema';
