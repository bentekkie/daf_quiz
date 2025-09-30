
'use client';

import { usePathname } from 'next/navigation'
import { BookOpenCheck, Flame, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuizTypeHref, QuizTypeName, QuizTypes } from "@/lib/types";

type HeaderProps = {
  dafRef: string;
  quizInProgress?: boolean;
  onReset?: () => void;
  streak?: number;
  quizType: QuizTypeHref | null;
};

export function Header({ dafRef, quizInProgress, onReset, streak = 0, quizType }: HeaderProps) {
  const router = useRouter();

  const sefariaUrl = dafRef
    ? `https://www.sefaria.org/${dafRef.replace(/ /g, "_")}`
    : "#";

  const handleResetConfirm = () => {
    if (onReset) {
      onReset();
    }
  }

  const handleQuizTypeChange = (value: string) => {
    router.push(`/${value}`);
    console.log(`going to ${value}`)
  }

  const pathname = usePathname()

  const isCurrentPath = (key: string) => {
    return pathname === `/${key}`
  }

  const LogoLink = () => (
    <div className="flex items-center gap-3 cursor-pointer">
      <BookOpenCheck className="h-8 w-8 text-primary" />
      <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">
        <span className="flex items-center gap-1 cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center hover:underline'>
              {quizType && QuizTypes[quizType] ? QuizTypes[quizType].name : 'Daf'}
              <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select a Quiz</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={quizType || ''} onValueChange={(value) => handleQuizTypeChange(value)}>
                {Object.entries(QuizTypes).map(([key, { name }]) => (
                  <DropdownMenuRadioItem key={key} value={key}>
                    {name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {' '}Quiz
        </span>
      </h1>
    </div>
  )

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
        {quizInProgress ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div onClick={(e) => e.preventDefault()}><LogoLink /></div>
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
          <LogoLink />
        )}

        <div className="flex items-center gap-4">
          {dafRef && quizType && (
            <div className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 sm:px-3 py-1.5 rounded-md text-center">
              Today's {QuizTypes[quizType].name}:{" "}
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-accent">
                  <Flame className="h-5 w-5" />
                  <span className="font-bold text-sm">{streak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current streak</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
