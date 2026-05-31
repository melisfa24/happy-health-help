import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createPixCharge,
  fetchPixChargeStatus,
  sanitizePaymentError,
} from "../payments/provider.server";

const customerSchema = z.object({
  amount: z.number().min(0.01, "Valor inválido."),
  customerName: z.string().trim().min(1, "Informe seu nome."),
  customerPhone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().min(10, "WhatsApp inválido.")),
  customerDocument: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF inválido.")),
  customerEmail: z.string().trim().email("E-mail inválido."),
});

export const createPixPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const result = customerSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.errors[0]?.message ?? "Verifique os dados informados.");
    }
    return result.data;
  })
  .handler(async ({ data }) => {
    try {
      const payment = await createPixCharge(data);
      return { ok: true as const, payment };
    } catch (error) {
      console.error("[payments] create error", error);
      const message =
        error instanceof Error &&
        !error.message.includes("PAYMENTS_") &&
        !error.message.includes("api.")
          ? error.message
          : sanitizePaymentError();
      return { ok: false as const, message };
    }
  });

export const getPixPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator(z.object({ transactionId: z.string().min(1) }))
  .handler(async ({ data }) => {
    try {
      const status = await fetchPixChargeStatus(data.transactionId);
      return { ok: true as const, status };
    } catch {
      return { ok: false as const, message: "Não foi possível verificar o pagamento." };
    }
  });
