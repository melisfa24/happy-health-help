import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Thermometer, Activity, Ghost, Zap, Brain, Smile, Droplet, Plus,
  ChevronLeft, ChevronRight, CircleAlert, Check, ShieldCheck, Loader2,
  QrCode, Copy, CheckCircle2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import hospitalSaoCamilo from "@/assets/hospital-sao-camilo-cen-kkeS.png";
import hospitalUbs from "@/assets/hospital-ubs-DGAgXlva.png";
import hospitalHapvida from "@/assets/hospital-hapvida-DCTKUZ81.png";
import hospitalUnimed from "@/assets/hospital-unimed-DYxFompX.png";
import hospitalSus from "@/assets/hospital-sus-dbJr7ewe.png";
import hospitalUpa from "@/assets/hospital-upa-D_r8cndo.png";
import { createPixPayment, getPixPaymentStatus } from "@/lib/api/payment.functions";
import {
  formatCpf,
  formatPhone,
  isFinalizacaoValid,
  type FinalizacaoErrors,
  type FinalizacaoField,
  validateFinalizacao,
} from "@/lib/form-validation";
import type { PixPaymentResult } from "@/lib/payments/types";

export const Route = createFileRoute("/solicitar")({
  head: () => ({
    meta: [
      { title: "Solicitar Atestado — SeuAtestado" },
      { name: "description", content: "Solicite seu atestado médico online em 5 minutos." },
    ],
  }),
  component: Solicitar,
});

const PROBLEMAS = [
  { icon: Thermometer, label: "Resfriado / gripe" },
  { icon: Activity, label: "Gastroenterite" },
  { icon: Ghost, label: "Sintoma de coronavírus" },
  { icon: Zap, label: "Estresse" },
  { icon: Brain, label: "Enxaqueca" },
  { icon: Activity, label: "Dor nas costas" },
  { icon: Smile, label: "Cólica menstrual" },
  { icon: Droplet, label: "Cistite" },
  { icon: Plus, label: "Outros" },
];

const SINTOMAS = [
  "Febre", "Náusea", "Diarreia", "Tosse sem catarro", "Tosse com catarro",
  "Mal-estar", "Fadiga", "Pressão arterial elevada", "Dificuldade de movimento",
  "Evento estressante", "Distúrbio do sono", "Dor de cabeça", "Calafrios",
  "Outro",
];

const PERIODOS = [
  { dias: 1, preco: "R$ 29,00", valor: 29 },
  { dias: 2, preco: "R$ 42,90", valor: 42.9 },
  { dias: 3, preco: "R$ 49,90", valor: 49.9 },
  { dias: 5, preco: "R$ 59,90", valor: 59.9 },
  { dias: 7, preco: "R$ 69,90", valor: 69.9 },
  { dias: 10, preco: "R$ 79,90", valor: 79.9 },
  { dias: 15, preco: "R$ 89,90", valor: 89.9 },
];

const ORIGENS_ATESTADO = [
  { label: "Hospital São Camilo", image: hospitalSaoCamilo },
  { label: "UBS — Unidade Básica de Saúde", image: hospitalUbs },
  { label: "Hapvida", image: hospitalHapvida },
  { label: "Unimed", image: hospitalUnimed },
  { label: "SUS", image: hospitalSus },
  { label: "UPA", image: hospitalUpa },
];

const STEPS = ["Problema", "Sintomas", "Dados", "Resumo", "Finalização", "Pagamento"];

const PAID_STATUSES = new Set(["APPROVED", "PAID", "CONFIRMED"]);

type FormState = {
  problema: string;
  sintomas: string[];
  inicio: string;
  detalhes: string;
  periodo: number;
  origemAtestado: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};

function Solicitar() {
  const [step, setStep] = useState(0);
  const [pixPayment, setPixPayment] = useState<PixPaymentResult | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FinalizacaoErrors>({});
  const [touchedFields, setTouchedFields] = useState<Partial<Record<FinalizacaoField, boolean>>>({});
  const [form, setForm] = useState<FormState>({
    problema: "",
    sintomas: [],
    inicio: "Hoje",
    detalhes: "",
    periodo: 1,
    origemAtestado: "",
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });

  const canNext = (() => {
    switch (step) {
      case 0: return !!form.problema;
      case 1: return form.sintomas.length > 0;
      case 2: return !!form.periodo;
      case 3: return true;
      case 4: return isFinalizacaoValid(form);
      case 5: return !!pixPayment;
      default: return false;
    }
  })();

  return (
    <main className="min-h-screen pb-32 bg-background">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SeuAtestado" className="w-9 h-9 rounded-lg" width={36} height={36} />
          <span className="text-lg font-bold tracking-tight">
            Atestado<span className="text-primary">Já</span>
          </span>
        </Link>
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">Cancelar</Link>
      </nav>

      <Progress step={step} />

      <section className="px-6 pt-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
          {step === 0 && <StepProblema form={form} setForm={setForm} />}
          {step === 1 && <StepSintomas form={form} setForm={setForm} />}
          {step === 2 && <StepDados form={form} setForm={setForm} />}
          {step === 3 && <StepAvaliacao form={form} />}
          {step === 4 && (
            <StepFinalizacao
              form={form}
              setForm={setForm}
              paymentError={paymentError}
              fieldErrors={fieldErrors}
              touchedFields={touchedFields}
              setFieldErrors={setFieldErrors}
              onFieldBlur={(field) => {
                setTouchedFields((prev) => ({ ...prev, [field]: true }));
                setFieldErrors(validateFinalizacao(form));
              }}
            />
          )}
          {step === 5 && pixPayment && (
            <StepPagamento payment={pixPayment} form={form} />
          )}
        </div>
      </section>

      <Footer
        step={step}
        setStep={setStep}
        canNext={canNext}
        form={form}
        setPixPayment={setPixPayment}
        setPaymentError={setPaymentError}
        setFieldErrors={setFieldErrors}
        setTouchedFields={setTouchedFields}
      />
    </main>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="px-6 pt-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold flex-none transition ${
                  i <= step ? "bg-primary text-primary-foreground border-2 border-primary" : "bg-white text-muted-foreground border border-border"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 mx-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((label, i) => (
            <span
              key={i}
              className={`text-[9px] font-bold uppercase tracking-wider flex-1 text-center first:text-left last:text-right ${
                i === step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepProblema({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-1">Qual é o seu problema?</h2>
      <p className="text-sm text-muted-foreground mb-6">Selecione o motivo principal do seu atestado.</p>
      <div className="flex flex-col gap-3">
        {PROBLEMAS.map((p) => {
          const selected = form.problema === p.label;
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setForm({ ...form, problema: p.label })}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                selected ? "border-primary bg-primary-soft" : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div className="w-9 h-9 rounded-lg grid place-items-center bg-background text-primary flex-none">
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 font-medium text-sm">{p.label}</span>
              <div
                className={`w-5 h-5 rounded-full border-2 grid place-items-center ${
                  selected ? "border-primary bg-primary" : "border-border"
                }`}
              >
                {selected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepSintomas({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  const toggle = (s: string) => {
    const has = form.sintomas.includes(s);
    setForm({ ...form, sintomas: has ? form.sintomas.filter((x) => x !== s) : [...form.sintomas, s] });
  };
  return (
    <>
      <h2 className="text-xl font-bold mb-1 text-center">Seus Sintomas</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">Escolha os sintomas que você está sentindo no momento.</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {SINTOMAS.map((s) => {
          const selected = form.sintomas.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground/80 border-border hover:border-primary/40"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepDados({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-1 text-center">Detalhes Finais</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">Informações sobre o início dos sintomas e período desejado.</p>

      <label className="block text-sm font-semibold mb-2">Outros sintomas ou detalhes que gostaria de mencionar? (Opcional)</label>
      <textarea
        rows={3}
        value={form.detalhes}
        onChange={(e) => setForm({ ...form, detalhes: e.target.value })}
        placeholder="Descreva aqui outros sintomas ou detalhes importantes..."
        className="w-full px-3 py-2 rounded-lg border border-border bg-background mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <label className="block text-sm font-semibold mb-2">Quando começaram os sintomas?</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {["Hoje", "Ontem", "Anteontem", "Há 7 dias"].map((d) => {
          const selected = form.inicio === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setForm({ ...form, inicio: d })}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                selected ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground/80 border-border"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <label className="block text-sm font-semibold mb-3">Por quantos dias você precisa do atestado?</label>
      <div className="flex flex-col gap-2 mb-4">
        {PERIODOS.map((p) => {
          const selected = form.periodo === p.dias;
          return (
            <button
              key={p.dias}
              type="button"
              onClick={() => setForm({ ...form, periodo: p.dias })}
              className={`flex justify-between items-center px-4 py-3.5 rounded-xl border transition-all ${
                selected ? "border-primary bg-primary-soft border-2" : "border-border bg-white"
              }`}
            >
              <span className="font-semibold text-sm">{p.dias} {p.dias === 1 ? "dia" : "dias"}</span>
              <span className="font-bold text-primary">{p.preco}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 p-4 rounded-xl bg-primary-soft text-xs text-foreground/80 mb-6">
        <CircleAlert className="w-4 h-4 flex-none mt-0.5 text-primary" />
        <p>O período final de afastamento será definido pelo médico após a avaliação do seu caso clínico.</p>
      </div>

      <label className="block text-sm font-semibold mb-2">De onde você quer o atestado?</label>
      <p className="text-xs text-muted-foreground mb-3">Selecione o local que deve constar no atestado.</p>
      <div className="grid grid-cols-2 gap-3">
        {ORIGENS_ATESTADO.map((origem) => {
          const selected = form.origemAtestado === origem.label;
          return (
            <button
              key={origem.label}
              type="button"
              onClick={() => setForm({ ...form, origemAtestado: selected ? "" : origem.label })}
              className={`p-3 rounded-xl border text-center transition-all ${
                selected ? "border-primary bg-primary-soft border-2" : "border-border bg-white hover:border-primary/40"
              }`}
            >
              <div className="h-12 flex items-center justify-center mb-2">
                <img
                  src={origem.image}
                  alt={origem.label}
                  loading="lazy"
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <span className="text-xs font-medium leading-tight block text-foreground/80">{origem.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepAvaliacao({ form }: { form: FormState }) {
  const periodo = PERIODOS.find((p) => p.dias === form.periodo);
  return (
    <>
      <h2 className="text-xl font-bold mb-1 text-center">Resumo</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">Confira se está tudo certo antes de continuar.</p>
      <div className="space-y-4 text-sm">
        <Row label="Problema" value={form.problema} />
        <Row label="Sintomas" value={form.sintomas.join(", ") || "—"} />
        <Row
          label="Dias"
          value={periodo ? `${periodo.dias} ${periodo.dias === 1 ? "dia" : "dias"} (${periodo.preco})` : "—"}
        />
      </div>
      <div className="mt-6 flex gap-3 p-4 rounded-xl bg-primary-soft text-xs text-foreground/80">
        <ShieldCheck className="w-4 h-4 flex-none mt-0.5 text-primary" />
        <p>Suas informações são analisadas por médico com CRM ativo. Se a solicitação não puder ser atendida, o valor é totalmente reembolsado.</p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function StepFinalizacao({
  form,
  setForm,
  paymentError,
  fieldErrors,
  touchedFields,
  setFieldErrors,
  onFieldBlur,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  paymentError: string | null;
  fieldErrors: FinalizacaoErrors;
  touchedFields: Partial<Record<FinalizacaoField, boolean>>;
  setFieldErrors: (errors: FinalizacaoErrors) => void;
  onFieldBlur: (field: FinalizacaoField) => void;
}) {
  const periodo = PERIODOS.find((p) => p.dias === form.periodo);

  const showError = (field: FinalizacaoField) =>
    touchedFields[field] ? fieldErrors[field] : undefined;

  const updateForm = (patch: Partial<FormState>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (Object.values(touchedFields).some(Boolean)) {
      setFieldErrors(validateFinalizacao(next));
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-1 text-center">Quase lá!</h2>
      <p className="text-sm text-muted-foreground mb-6 text-center">Preencha seus dados para receber o atestado.</p>

      <div className="space-y-3 mb-6">
        <Field
          label="Nome completo"
          value={form.nome}
          onChange={(v) => updateForm({ nome: v })}
          onBlur={() => onFieldBlur("nome")}
          placeholder="Seu nome completo"
          error={showError("nome")}
        />
        <Field
          label="CPF"
          value={form.cpf}
          onChange={(v) => updateForm({ cpf: formatCpf(v) })}
          onBlur={() => onFieldBlur("cpf")}
          placeholder="000.000.000-00"
          inputMode="numeric"
          error={showError("cpf")}
        />
        <Field
          label="E-mail"
          value={form.email}
          onChange={(v) => updateForm({ email: v.trimStart() })}
          onBlur={() => onFieldBlur("email")}
          placeholder="seu@email.com"
          type="email"
          autoComplete="email"
          error={showError("email")}
        />
        <Field
          label="WhatsApp"
          value={form.telefone}
          onChange={(v) => updateForm({ telefone: formatPhone(v) })}
          onBlur={() => onFieldBlur("telefone")}
          placeholder="(11) 99999-9999"
          inputMode="tel"
          error={showError("telefone")}
        />
      </div>

      {paymentError && (
        <div className="mb-4 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
          <CircleAlert className="w-4 h-4 flex-none mt-0.5" />
          <p>{paymentError}</p>
        </div>
      )}

      <div className="rounded-2xl border-2 border-primary bg-primary-soft p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Atestado {form.periodo} {form.periodo === 1 ? "dia" : "dias"}</span>
          <span className="text-2xl font-bold text-primary">{periodo?.preco}</span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <QrCode className="w-3.5 h-3.5" /> Pagamento exclusivamente via Pix
        </p>
      </div>
    </>
  );
}

function StepPagamento({ payment, form }: { payment: PixPaymentResult; form: FormState }) {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(PAID_STATUSES.has(payment.status.toUpperCase()));

  useEffect(() => {
    if (paid) return;

    const checkStatus = async () => {
      const result = await getPixPaymentStatus({ data: { transactionId: payment.transactionId } });
      if (result.ok && PAID_STATUSES.has(result.status.status.toUpperCase())) {
        setPaid(true);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus();

    return () => clearInterval(interval);
  }, [payment.transactionId, paid]);

  const handleCopy = async () => {
    if (!payment.copyPasteCode) return;
    await navigator.clipboard.writeText(payment.copyPasteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (paid) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Pagamento confirmado!</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Estamos montando tudo para você. Em alguns minutos — no máximo em até 2 horas — seu atestado
          chegará no e-mail <strong>{form.email}</strong> ou no WhatsApp{" "}
          <strong>{form.telefone}</strong>.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Preparando seu atestado...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 mb-1">
        <QrCode className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-center">Pague com Pix</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        Escaneie o QR Code ou copie o código abaixo para concluir seu pedido.
      </p>

      <div className="rounded-xl border border-border bg-background p-4 mb-6 text-sm space-y-2">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Referência</span>
          <span className="font-semibold">{payment.referenceCode}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Cliente</span>
          <span className="font-semibold text-right">{form.nome}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Valor</span>
          <span className="font-semibold text-primary">{payment.amountFormatted}</span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        {payment.qrCodeImage ? (
          <div className="p-4 rounded-2xl border-2 border-primary bg-white shadow-sm">
            <img
              src={payment.qrCodeImage}
              alt="QR Code Pix"
              width={220}
              height={220}
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="p-8 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
            Use o código Pix Copia e Cola abaixo
          </div>
        )}
        <p className="mt-4 text-3xl font-bold text-primary">{payment.amountFormatted}</p>
      </div>

      {payment.copyPasteCode && (
        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-foreground/80">Pix Copia e Cola</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={payment.copyPasteCode}
              className="flex-1 px-3 py-2.5 rounded-lg border border-border text-xs bg-muted/30 truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex-none px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 p-4 rounded-xl bg-primary-soft text-xs text-foreground/80">
        <ShieldCheck className="w-4 h-4 flex-none mt-0.5 text-primary" />
        <p>Após a confirmação do Pix, você receberá o atestado no e-mail e WhatsApp informados.</p>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 text-foreground/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-border focus:ring-primary/30"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Footer({
  step,
  setStep,
  canNext,
  form,
  setPixPayment,
  setPaymentError,
  setFieldErrors,
  setTouchedFields,
}: {
  step: number;
  setStep: (n: number) => void;
  canNext: boolean;
  form: FormState;
  setPixPayment: (p: PixPaymentResult | null) => void;
  setPaymentError: (msg: string | null) => void;
  setFieldErrors: (errors: FinalizacaoErrors) => void;
  setTouchedFields: (fields: Partial<Record<FinalizacaoField, boolean>>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isPaymentStep = step === STEPS.length - 1;
  const isBeforePayment = step === STEPS.length - 2;

  const handleNext = async () => {
    if (isBeforePayment) {
      const errors = validateFinalizacao(form);
      setFieldErrors(errors);
      setTouchedFields({ nome: true, cpf: true, email: true, telefone: true });

      if (Object.keys(errors).length > 0) {
        setPaymentError("Corrija os campos destacados antes de continuar.");
        return;
      }

      setLoading(true);
      setPaymentError(null);

      const periodo = PERIODOS.find((p) => p.dias === form.periodo);
      const result = await createPixPayment({
        data: {
          amount: periodo?.valor ?? 29,
          customerName: form.nome,
          customerPhone: form.telefone,
          customerDocument: form.cpf,
          customerEmail: form.email,
        },
      });

      setLoading(false);

      if (!result.ok) {
        setPaymentError(result.message);
        return;
      }

      setPixPayment(result.payment);
      setStep(step + 1);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (isPaymentStep) {
      setPixPayment(null);
    }
    setPaymentError(null);
    setFieldErrors({});
    setStep(Math.max(0, step - 1));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-border">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-1 text-sm font-semibold text-foreground/70 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" /> Etapa Anterior
        </button>

        {isPaymentStep ? (
          <div className="flex-1 max-w-xs py-3.5 rounded-xl bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Aguardando pagamento Pix
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext || loading}
            className="flex-1 max-w-xs py-3.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {isBeforePayment ? "Gerar Pix" : "Próxima Etapa"} <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
