'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const tCommon = useTranslations('Common');
  const tFooter = useTranslations('Footer');

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://github.com/bentekkie/daf_quiz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            {tCommon('appName')}
          </a>
          . {tFooter('allRightsReserved')}
        </p>
        <p className="mt-1">
          {tFooter('poweredBy')}{' '}
          <a
            href="https://sefaria.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            {tCommon('sefaria')}
          </a>{' '}
          {tFooter('andGemini')}
        </p>
      </div>
    </footer>
  );
}
