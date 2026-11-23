'use client';

import { BookOpenCheck, Flame, ChevronDown, Printer, Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuizTypeHref, QuizTypes } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";

type HeaderProps = {
  dafRef: string;
  sefariaRef?: string;
  quizInProgress?: boolean;
  onReset?: () => void;
  streak?: number;
  quizType: QuizTypeHref | null;
};

type LogoLinkProps = {
  quizType: QuizTypeHref | null;
  onQuizTypeChange: (value: string) => void;
};

function LogoLink({ quizType, onQuizTypeChange }: LogoLinkProps) {
  const { isRtl } = useLanguage();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("Header");
  const tQuizTypes = useTranslations("QuizTypes");

  const currentQuizLabel =
    quizType && QuizTypes[quizType]
      ? tQuizTypes(quizType)
      : tHeader("fallbackTitle");

  const selector = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center hover:underline">
          {currentQuizLabel}
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "end" : "start"}>
        <DropdownMenuLabel>{tHeader("selectQuiz")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={quizType || ""} onValueChange={onQuizTypeChange}>
          {(Object.keys(QuizTypes) as QuizTypeHref[]).map((key) => (
            <DropdownMenuRadioItem key={key} value={key}>
              {tQuizTypes(key)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <BookOpenCheck className="h-8 w-8 text-primary" />
      <h1 className="text-xl md:text-2xl font-headline font-bold text-primary">
        <span className="flex items-center gap-1.5 cursor-pointer">
          {isRtl ? (
            <>
              {tCommon("quizSuffix")} {selector}
            </>
          ) : (
            <>
              {selector} {tCommon("quizSuffix")}
            </>
          )}
        </span>
      </h1>
    </div>
  );
}

export function Header({
  dafRef,
  sefariaRef,
  quizInProgress,
  onReset,
  streak = 0,
  quizType,
}: HeaderProps) {
  const router = useRouter();
  const { toggleLanguage } = useLanguage();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("Header");
  const tQuizTypes = useTranslations("QuizTypes");

  const refForUrl = sefariaRef || dafRef;
  const sefariaUrl = refForUrl
    ? `https://www.sefaria.org/${refForUrl.replace(/ /g, "_")}`
    : "#";

  const handleResetConfirm = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleQuizTypeChange = (value: string) => {
    router.push(`/${value}` as `/${QuizTypeHref}`);
  };

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-3">
        {quizInProgress ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div onClick={(e) => e.preventDefault()}>
                <LogoLink quizType={quizType} onQuizTypeChange={handleQuizTypeChange} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tHeader("resetDialogTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tHeader("resetDialogDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetConfirm}>
                  {tHeader("restartQuiz")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <LogoLink quizType={quizType} onQuizTypeChange={handleQuizTypeChange} />
        )}

        <div className="flex items-center gap-2.5 sm:gap-3">
          {dafRef && quizType && (
            <div className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 sm:px-3 py-1.5 rounded-md text-center">
              {tHeader("todayLabel", { quizName: tQuizTypes(quizType) })}{" "}
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

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={tCommon("switchLanguageAria")}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{tCommon("languageToggleLabel")}</span>
          </button>

          {dafRef && quizType && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/${quizType}/print`}
                    aria-label={tHeader("printTooltip")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <Printer className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tHeader("printTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                <p>{tHeader("streakTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
