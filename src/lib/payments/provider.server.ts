import { randomBytes } from "node:crypto";
import process from "node:process";

import type { PixPaymentResult, PixPaymentStatus } from "./types";

type CreateChargeInput = {
  amount: number;
  customerName: string;
  customerPhone: string;
  customerDocument: string;
  customerEmail: string;
};

type ProviderPixResponse = {
  success?: boolean;
  data?: {
    id?: string;
    referenceCode?: string;
    status?: string;
    amount?: number;
    pix?: {
      qrCode?: {
        emv?: string;
        image?: string;
      };
      expirationDate?: number | string;
    };
    paidAt?: string;
  };
};

function getApiKey(): string {
  const key = process.env.PAYMENTS_API_KEY;
  if (!key) throw new Error("PAYMENTS_CONFIG_MISSING");
  return key;
}

function getApiBaseUrl(): string {
  return process.env.PAYMENTS_API_BASE_URL ?? "https://api.escalecyber.com/v1";
}

function smallHash(): string {
  return randomBytes(3).toString("hex");
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizeQrImage(image: string | undefined): string {
  if (!image) return "";
  if (image.startsWith("data:")) return image;
  return `data:image/png;base64,${image}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

export function sanitizePaymentError(status?: number): string {
  if (status === 400) {
    return "Não foi possível validar os dados informados. Revise e tente novamente.";
  }
  if (status === 401 || status === 403) {
    return "Não foi possível iniciar o pagamento agora. Tente novamente em instantes.";
  }
  return "Não foi possível gerar o Pix no momento. Tente novamente em instantes.";
}

export async function createPixCharge(input: CreateChargeInput): Promise<PixPaymentResult> {
  const description = `Pagamento teste #${smallHash()}`;

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/payments/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": getApiKey(),
      },
      body: JSON.stringify({
        amount: input.amount,
        customerName: input.customerName,
        customerPhone: normalizePhone(input.customerPhone),
        customerDocument: input.customerDocument,
        customerEmail: input.customerEmail,
        customerDocumentType: "cpf",
        description,
      }),
    });
  } catch {
    console.error("[payments] create network error");
    throw new Error(sanitizePaymentError());
  }

  const body = (await response.json().catch(() => null)) as ProviderPixResponse | null;

  if (!response.ok || !body?.data?.id) {
    console.error("[payments] create failed", response.status);
    throw new Error(sanitizePaymentError(response.status));
  }

  const { data } = body;
  const emv = data.pix?.qrCode?.emv ?? "";
  const qrImage = normalizeQrImage(data.pix?.qrCode?.image);

  return {
    transactionId: data.id!,
    referenceCode: data.referenceCode ?? data.id!,
    amount: data.amount ?? input.amount,
    amountFormatted: formatBRL(data.amount ?? input.amount),
    status: data.status ?? "PENDING",
    qrCodeImage: qrImage,
    copyPasteCode: emv,
    expirationDate:
      data.pix?.expirationDate != null ? String(data.pix.expirationDate) : undefined,
  };
}

export async function fetchPixChargeStatus(transactionId: string): Promise<PixPaymentStatus> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/payments/transactions/${transactionId}`, {
      headers: {
        "X-API-Key": getApiKey(),
      },
    });
  } catch {
    console.error("[payments] status network error");
    throw new Error(sanitizePaymentError());
  }

  const body = (await response.json().catch(() => null)) as ProviderPixResponse | null;

  if (!response.ok || !body?.data?.id) {
    console.error("[payments] status failed", response.status, transactionId);
    throw new Error(sanitizePaymentError(response.status));
  }

  return {
    transactionId: body.data.id,
    status: body.data.status ?? "PENDING",
    paidAt: body.data.paidAt,
  };
}
