
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
    const quizUrl = typeof window !== 'undefined' ? window.location.href : '';
    const sefariaUrl = `https://www.sefaria.org/${dafRef.replace(/ /g, '_')}`;

    const shareText = `I just took the daily Daf Yomi quiz for ${dafRef}! Test your knowledge. You can study the daf on Sefaria: ${sefariaUrl}`;
    const twitterShareText = `I just took the daily Daf Yomi quiz for ${dafRef}! Test your knowledge here. #DafYomi #Talmud`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterShareText)}&url=${encodeURIComponent(quizUrl)}`;

    const handleShare = async () => {
        const shareData = {
            title: 'Daf Quizzer',
            text: shareText,
            url: quizUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.warn('Error sharing:', err);
            }
        } else {
            if (!navigator.clipboard) {
                toast({
                    variant: "destructive",
                    title: "Feature not available",
                    description: "Sharing and copying to clipboard are not supported in your browser.",
                });
                return;
            }
            navigator.clipboard.writeText(`${shareText} ${quizUrl}`)
                .then(() => {
                    toast({
                        title: "Copied to clipboard!",
                        description: "Share your results with your friends.",
                    });
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    toast({
                        variant: "destructive",
                        title: "Copy failed",
                        description: "Could not copy results to clipboard.",
                    });
                });
        }
    };

  return (
    <div className="flex items-center gap-2">
        <span className="text-sm font-semibold mr-2">Share:</span>
        <Button variant="outline" size="icon" asChild>
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X"><TwitterIcon /></a>
        </Button>
        <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share">
            <Share2 />
        </Button>
    </div>
  );
}
