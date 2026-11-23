ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS gateway_name TEXT,
    ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_transaction_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_token TEXT,
    ADD COLUMN IF NOT EXISTS gateway_redirect_url TEXT,
    ADD COLUMN IF NOT EXISTS gateway_payload JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_gateway_order_id
    ON public.payments(gateway_order_id)
    WHERE gateway_order_id IS NOT NULL;