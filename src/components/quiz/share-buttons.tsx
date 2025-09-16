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

const FacebookIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

declare global {
    interface Window {
        FB?: any;
    }
}

export function ShareButtons({ scorePercentage, dafRef }: ShareButtonsProps) {
    const { toast } = useToast();
    const shareText = `I scored ${scorePercentage}% on today's Daf Yomi quiz (${dafRef}) on Daf Quizzer! Can you beat my score?`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const encodedText = encodeURIComponent(shareText);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(shareUrl)}&hashtags=DafYomi,Talmud,DafQuizzer`;

    const handleFacebookShare = () => {
        if (window.FB) {
            window.FB.ui({
                method: 'share',
                href: shareUrl,
                quote: shareText,
                hashtag: '#DafYomi'
            }, function(response: any){});
        } else {
             toast({
                variant: "destructive",
                title: "Facebook SDK not loaded",
                description: "Could not connect to Facebook to share.",
            });
        }
    };

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
        <Button variant="outline" size="icon" onClick={handleFacebookShare} aria-label="Share on Facebook">
            <FacebookIcon />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy link">
            <Share2 />
        </Button>
    </div>
  );
}
