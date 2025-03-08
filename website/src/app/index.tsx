// File: pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import CyberSecurityNewsSlider from './CyberSecurityNewsSlider';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <Head>
        <title>Latest Cybersecurity News</title>
        <meta name="description" content="Stay updated with the latest cybersecurity news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Latest Cybersecurity News
        </h1>
        
        <CyberSecurityNewsSlider />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          News sourced from The Hacker News
        </div>
      </main>
    </div>
  );
};

export default Home;