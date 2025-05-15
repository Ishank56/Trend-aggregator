import { TrendsSearch } from '@/components/TrendsSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Trend Aggregator</h1>
        <TrendsSearch />
        </div>
      </main>
  );
}
