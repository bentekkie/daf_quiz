export function Footer() {
    return (
        <footer className="bg-card border-t mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} <a href="https://github.com/bentekkie/daf_quiz" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Daf Quiz</a>. All rights reserved.</p>
                <p className="mt-1">
                    Powered by <a href="https://sefaria.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Sefaria</a> and Google Gemini.
                </p>
            </div>
        </footer>
    );
}
