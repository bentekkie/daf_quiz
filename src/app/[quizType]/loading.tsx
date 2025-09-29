
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header quizInProgress={false} quizType={null}/>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="items-center text-center">
            <CardTitle>
                <Skeleton className="h-8 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-5 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-11 w-32 mx-auto" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
