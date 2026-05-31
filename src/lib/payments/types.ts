export type PixPaymentResult = {
  transactionId: string;
  referenceCode: string;
  amount: number;
  amountFormatted: string;
  status: string;
  qrCodeImage: string;
  copyPasteCode: string;
  expirationDate?: string;
};

export type PixPaymentStatus = {
  transactionId: string;
  status: string;
  paidAt?: string;
};
