'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  scorePercentage: number;
  dafRef: string;
}

const TwitterIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);

export function ShareButtons({ scorePercentage, dafRef }: ShareButtonsProps) {
    const { toast } = useToast();
    const shareText = `I scored ${scorePercentage}% on today's Daf Yomi quiz (${dafRef}) on Daf Quizzer! Can you beat my score?`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const encodedText = encodeURIComponent(shareText);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(shareUrl)}&hashtags=DafYomi,Talmud,DafQuizzer`;

    const handleCopyToClipboard = () => {
        if (!navigator.clipboard) {
            toast({
                variant: "destructive",
                title: "Feature not available",
                description: "Copy to clipboard is not supported in your browser.",
            });
            return;
        }
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
            .then(() => {
                console.log('Results copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast({
                    variant: "destructive",
                    title: "Copy failed",
                    description: "Could not copy results to clipboard.",
                });
            });
    };

  return (
    <div className="flex items-center gap-2">
        <span className="text-sm font-semibold mr-2">Share:</span>
        <Button variant="outline" size="icon" asChild>
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X"><TwitterIcon /></a>
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy link">
            <Share2 />
        </Button>
    </div>
  );
}
