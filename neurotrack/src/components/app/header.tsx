import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background shadow-md bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <BrainCircuit className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          SafePath Memory Aid
        </h1>
      </div>
    </header>
  );
}
