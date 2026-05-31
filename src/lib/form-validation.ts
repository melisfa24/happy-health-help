export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(digits[10]);
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const digits = onlyDigits(phone);
  return digits.length >= 10 && digits.length <= 11;
}

export type FinalizacaoField = "nome" | "cpf" | "email" | "telefone";
export type FinalizacaoErrors = Partial<Record<FinalizacaoField, string>>;

export function validateFinalizacao(form: {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}): FinalizacaoErrors {
  const errors: FinalizacaoErrors = {};

  if (!form.nome.trim()) {
    errors.nome = "Informe seu nome completo.";
  } else if (form.nome.trim().split(/\s+/).length < 2) {
    errors.nome = "Informe nome e sobrenome.";
  }

  if (!onlyDigits(form.cpf)) {
    errors.cpf = "Informe seu CPF.";
  } else if (!isValidCpf(form.cpf)) {
    errors.cpf = "CPF inválido. Verifique os números digitados.";
  }

  if (!form.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!isValidEmail(form.email)) {
    errors.email = "E-mail inválido. Exemplo: seu@email.com";
  }

  if (!onlyDigits(form.telefone)) {
    errors.telefone = "Informe seu WhatsApp.";
  } else if (!isValidPhone(form.telefone)) {
    errors.telefone = "WhatsApp inválido. Use DDD + número.";
  }

  return errors;
}

export function isFinalizacaoValid(form: {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}): boolean {
  return Object.keys(validateFinalizacao(form)).length === 0;
}
