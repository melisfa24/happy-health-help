import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck, Clock, FileCheck, Globe, BadgeDollarSign, CalendarClock,
  ArrowRight, Check, ChevronDown, Stethoscope, FileText, Download, Star, Sparkles
} from "lucide-react";
import logo from "@/assets/logo.png";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SeuAtestado — Atestado Médico Online em 5 minutos | R$ 29" },
      { name: "description", content: "Atestado médico online em 5 minutos por R$ 29. Assinado e carimbado por médicos brasileiros com CRM ativo. 100% online, 24/7. Garantia de aceitação." },
      { property: "og:title", content: "SeuAtestado — Atestado Médico Online 24/7" },
      { property: "og:description", content: "Atestado médico online em 5 minutos por R$ 29. Médicos com CRM ativo." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Differentials />
      <Pricing />
      <Testimonials />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* ---------------- HERO (single-column, conversion focused) ---------------- */
function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* radial glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary-deep px-4 py-2 text-xs font-semibold mb-7 border border-primary/15">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Médicos disponíveis agora · 24/7
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
          Seu atestado médico
          <br />
          em <span className="relative inline-block">
            <span className="relative z-10 text-primary">5 minutos</span>
            <span className="absolute inset-x-0 bottom-1 h-3 bg-primary/15 rounded-sm -z-0" />
          </span>.
        </h1>

        <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Atestado assinado e carimbado por médicos brasileiros com <strong className="text-foreground">CRM ativo</strong>. 100% online, sem consulta presencial.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4">
          <Link
            to="/solicitar"
            className="group relative inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-5 text-base font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            Solicitar agora por R$ 29
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> Pagamento seguro
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" /> Entrega em 5 min
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL PROOF BAR ---------------- */
function SocialProof() {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="font-semibold">4.9/5</span>
          <span className="text-muted-foreground">· 12.847 avaliações</span>
        </div>
        <div className="hidden md:block w-px h-6 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>+ <strong className="text-foreground">50.000</strong> brasileiros atendidos</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { icon: FileText, title: "Preencha o questionário", desc: "Responda em 3 minutos sobre seus sintomas. Simples e intuitivo, sem termos médicos complicados." },
    { icon: Stethoscope, title: "Avaliação médica", desc: "Um médico brasileiro com CRM ativo analisa seu caso e emite o atestado válido." },
    { icon: Download, title: "Receba em PDF", desc: "Atestado entregue por e-mail e WhatsApp em até 5 minutos, pronto para apresentar." },
  ];
  return (
    <section id="processo" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Como funciona</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            3 passos. Sem complicação.
          </h2>
        </div>

        <ol className="relative space-y-4">
          <div className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <li key={i} className="relative flex gap-5 items-start bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="relative flex-none w-14 h-14 rounded-2xl bg-primary-deep text-primary-foreground grid place-items-center shadow-lg shadow-primary-deep/20">
                <s.icon className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold grid place-items-center border-2 border-background">
                  {i + 1}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="font-display text-lg font-bold mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition"
          >
            Começar agora <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- DIFFERENTIALS ---------------- */
function Differentials() {
  const items = [
    { icon: Clock, title: "Em 5 minutos", desc: "Sem filas, sem espera. Receba o PDF no seu celular em minutos." },
    { icon: Globe, title: "100% online", desc: "Sem videochamada. Tudo feito por um questionário simples." },
    { icon: ShieldCheck, title: "Validade legal", desc: "Assinatura digital ICP-Brasil. Aceito por empresas em todo o país." },
    { icon: BadgeDollarSign, title: "R$ 29 fixo", desc: "Sem taxas escondidas. Preço único, transparente." },
    { icon: CalendarClock, title: "24h por dia", desc: "Disponível inclusive em finais de semana e feriados." },
    { icon: FileCheck, title: "Garantia total", desc: "Se não for aceito, devolvemos seu dinheiro. Sem perguntas." },
  ];
  return (
    <section id="diferenciais" className="py-24 md:py-32 bg-primary-deep text-primary-foreground">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Por que SeuAtestado</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Tudo que você precisa.
            <br />
            <span className="text-primary">Nada que você não precisa.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 hover:bg-white/10 transition">
              <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground grid place-items-center mb-4 shadow-lg shadow-primary/30">
                <it.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold mb-2">{it.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function Pricing() {
  const tiers = [
    { days: "1-3", price: 29, label: "Mais escolhido", featured: true },
    { days: "4-7", price: 49 },
    { days: "8-15", price: 89 },
  ];
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Preços</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Transparente. Sem pegadinha.
          </h2>
          <p className="mt-4 text-muted-foreground">Você paga apenas pelos dias que precisa.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-6 text-center transition-all ${
                t.featured
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-105"
                  : "bg-card border border-border hover:border-primary/40"
              }`}
            >
              {t.label && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-deep text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {t.label}
                </span>
              )}
              <p className={`text-sm font-semibold ${t.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {t.days} dias
              </p>
              <p className="font-display text-5xl font-bold mt-3">
                R$ {t.price}
              </p>
              <p className={`text-xs mt-1 ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                pagamento único
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/solicitar"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-bold hover:bg-primary hover:text-primary-foreground transition"
          >
            Solicitar meu atestado <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const items = [
    { name: "Ricardo S.", city: "São Paulo, SP", text: "Precisava urgente para o trabalho e em menos de 5 minutos o PDF estava no meu celular. Profissional demais." },
    { name: "Camila A.", city: "Belo Horizonte, MG", text: "Acordei mal e em vez de perder o dia na UPA resolvi pelo SeuAtestado. Médico atencioso e processo super rápido." },
    { name: "Felipe M.", city: "Curitiba, PR", text: "Meu RH aceitou sem questionar. Vale cada centavo, recomendo." },
  ];
  return (
    <section className="py-24 md:py-32 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Depoimentos</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            +50.000 brasileiros já usaram.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <div key={i} className="rounded-2xl bg-background border border-border p-7 flex flex-col">
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed flex-1">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary-soft text-primary-deep grid place-items-center font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const items = [
    { q: "O atestado é válido por lei?", a: "Sim. Nossos atestados são assinados digitalmente com certificado ICP-Brasil por médicos com CRM ativo, possuindo a mesma validade jurídica de um atestado físico tradicional." },
    { q: "Quanto tempo demora?", a: "O processo completo leva em torno de 5 minutos. Após a avaliação médica, o PDF é enviado para o seu e-mail e WhatsApp." },
    { q: "Quais os métodos de pagamento?", a: "Aceitamos exclusivamente Pix. Pagamento processado de forma segura." },
    { q: "Por quantos dias posso me afastar?", a: "O período do atestado é definido pelo médico após análise do seu caso, podendo variar de 1 a 15 dias." },
    { q: "E se meu empregador não aceitar?", a: "Garantia total: devolvemos seu dinheiro ou emitimos um novo atestado gratuitamente." },
    { q: "Preciso fazer videochamada?", a: "Não. Todo o processo é feito por questionário online, sem necessidade de videochamada." },
    { q: "Meus dados estão seguros?", a: "Sim. Seguimos a LGPD e usamos criptografia de ponta a ponta. Seus dados nunca são compartilhados." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Dúvidas frequentes</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Tudo que você quer saber.
          </h2>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display font-semibold">{it.q}</span>
                <ChevronDown className={`w-5 h-5 text-primary flex-none transition-transform ${open === i ? "rotate-180" : ""}`} />
              </div>
              {open === i && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCta() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary-deep text-primary-foreground p-10 md:p-16 text-center">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 60%, transparent), transparent)",
            }}
          />
          <div className="relative">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Resolva agora em 5 minutos.
            </h2>
            <p className="mt-4 text-white/70">
              Sem sair de casa. Sem fila. Sem complicação.
            </p>
            <Link
              to="/solicitar"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-5 font-bold shadow-2xl shadow-primary/40 hover:-translate-y-0.5 transition"
            >
              Solicitar por R$ 29 <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-xs text-white/50">Pagamento seguro · Garantia de aceitação</p>
          </div>
        </div>
      </div>
    </section>
  );
}
