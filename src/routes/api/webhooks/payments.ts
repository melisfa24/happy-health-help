import { createFileRoute } from "@tanstack/react-router";

type WebhookPayload = {
  id?: string;
  type?: string;
  created_at?: string;
  data?: {
    transactionId?: string;
    referenceCode?: string;
    status?: string;
    amount?: number;
    customerEmail?: string;
    paymentAt?: string;
  };
};

export const Route = createFileRoute("/api/webhooks/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as WebhookPayload;

          if (payload.type === "pix.in.confirmation" && payload.data?.transactionId) {
            console.info("[payment-webhook] confirmed", {
              transactionId: payload.data.transactionId,
              referenceCode: payload.data.referenceCode,
              status: payload.data.status,
            });
          }

          return Response.json({ received: true });
        } catch (error) {
          console.error("[payment-webhook] invalid payload", error);
          return Response.json({ received: true });
        }
      },
    },
  },
});
