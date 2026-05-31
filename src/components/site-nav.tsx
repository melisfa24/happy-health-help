import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { ArrowRight } from "lucide-react";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Seu Atestado" className="w-9 h-9 rounded-xl" width={36} height={36} />
          <span className="text-lg font-display font-bold tracking-tight">
            Seu<span className="text-primary">Atestado</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#processo" className="hover:text-foreground transition">Como funciona</a>
          <a href="/#diferenciais" className="hover:text-foreground transition">Diferenciais</a>
          <a href="/#faq" className="hover:text-foreground transition">Dúvidas</a>
        </div>
        <Link
          to="/solicitar"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition"
        >
          Solicitar <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
