-- Apply this migration to the Supabase project used by the backend.
-- PostgREST needs the RPC signature and argument names to match supabase.rpc().
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE OR REPLACE FUNCTION public.verify_payment_transaction(
    p_payment_id BIGINT,
    p_status VARCHAR,
    p_verified_by BIGINT,
    p_rejection_reason TEXT DEFAULT NULL,
    p_qr_code TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id BIGINT;
    v_order_status VARCHAR;
    v_expires_at TIMESTAMPTZ;
    v_item RECORD;
BEGIN
    SELECT o.id, o.status, o.expires_at
    INTO v_order_id, v_order_status, v_expires_at
    FROM public.payments p
    JOIN public.orders o ON o.id = p.order_id
    WHERE p.id = p_payment_id AND p.status = 'pending'
    FOR UPDATE OF p, o;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pembayaran sudah diverifikasi atau tidak ditemukan';
    END IF;
    IF v_order_status <> 'pending'
       OR (v_expires_at IS NOT NULL AND v_expires_at <= NOW()) THEN
        RAISE EXCEPTION 'Order sudah tidak dapat diverifikasi';
    END IF;
    IF p_status NOT IN ('approved', 'rejected') THEN
        RAISE EXCEPTION 'Status pembayaran tidak valid';
    END IF;

    FOR v_item IN
        SELECT oi.ticket_category_id, oi.qty
        FROM public.order_items oi
        WHERE oi.order_id = v_order_id
    LOOP
        PERFORM 1
        FROM public.ticket_categories
        WHERE id = v_item.ticket_category_id
        FOR UPDATE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Kategori tiket tidak ditemukan';
        END IF;

        IF p_status = 'approved' THEN
            UPDATE public.ticket_categories
            SET remaining = remaining - v_item.qty,
                reserved = reserved - v_item.qty
            WHERE id = v_item.ticket_category_id
              AND reserved >= v_item.qty;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Reservasi tiket tidak mencukupi';
            END IF;
        ELSE
            PERFORM public.release_ticket_stock(
                v_item.ticket_category_id,
                v_item.qty
            );
        END IF;
    END LOOP;

    UPDATE public.payments
    SET status = p_status,
        verified_at = NOW(),
        verified_by = p_verified_by,
        rejection_reason = CASE
            WHEN p_status = 'rejected' THEN p_rejection_reason
            ELSE NULL
        END
    WHERE id = p_payment_id;

    UPDATE public.orders
    SET status = CASE WHEN p_status = 'approved' THEN 'paid' ELSE 'rejected' END,
        qr_code = CASE WHEN p_status = 'approved' THEN p_qr_code ELSE qr_code END
    WHERE id = v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_payment_transaction(
    BIGINT, VARCHAR, BIGINT, TEXT, TEXT
) TO service_role;

NOTIFY pgrst, 'reload schema';