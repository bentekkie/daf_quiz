import { BookOpenCheck } from "lucide-react";

type HeaderProps = {
  dafRef?: string;
};

export function Header({ dafRef }: HeaderProps) {
  const sefariaUrl = dafRef ? `https://www.sefaria.org/${dafRef.replace(/ /g, '_')}a` : '#';

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">
            Daf Quizzer
          </h1>
        </div>
        {dafRef && (
          <div className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 sm:px-3 py-1.5 rounded-md text-center">
            Today's Daf:{" "}
            <a
              href={sefariaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground underline hover:text-primary"
            >
              {dafRef}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
