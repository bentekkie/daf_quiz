'use client';

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type HeaderProps = {
  dafRef?: string;
  quizInProgress?: boolean;
  onReset?: () => void;
};

export function Header({ dafRef, quizInProgress, onReset }: HeaderProps) {
  const router = useRouter();
  const sefariaUrl = dafRef
    ? `https://www.sefaria.org/${dafRef.replace(/ /g, "_")}a`
    : "#";

  const handleResetConfirm = () => {
    if (onReset) {
      onReset();
    }
  }

  const LogoLink = () => (
    <div className="flex items-center gap-3 cursor-pointer">
      <BookOpenCheck className="h-8 w-8 text-primary" />
      <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">
        Daf Quizzer
      </h1>
    </div>
  )

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {quizInProgress ? (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <div><LogoLink /></div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will restart the quiz and you will lose your current progress.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetConfirm}>
                  Restart Quiz
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Link href="/"><LogoLink /></Link>
        )}
       
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
