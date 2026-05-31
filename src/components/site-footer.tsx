export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 text-center text-sm text-muted-foreground">
        <p className="font-display font-bold text-foreground text-base mb-2">
          Seu<span className="text-primary">Atestado</span>
        </p>
        <p>© {new Date().getFullYear()} SeuAtestado. Atestados médicos online emitidos por médicos com CRM ativo.</p>
        <p className="mt-2 text-xs">Este serviço não substitui consulta médica presencial em casos de emergência.</p>
      </div>
    </footer>
  );
}
