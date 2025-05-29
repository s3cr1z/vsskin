'use client';

import React, { Suspense, ErrorBoundary } from 'react';
import AppLayout from '@/components/AppLayout';
import ThemeBrowser from '@/components/ThemeBrowser';
import { fetchAllBrands } from '@/lib/brandApi';
import type { Metadata } from 'next';

// Metadata for better SEO
export const metadata: Metadata = {
  title: 'VSSkin - Visual Studio Code Themes',
  description: 'Browse and apply branded themes for Visual Studio Code',
};

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 text-red-500">
    <h2>Something went wrong:</h2>
    <p>{error.message}</p>
  </div>
);

// Loading component
const Loading = () => <div className="p-4">Loading themes...</div>;

export default function Home() {
  return (
    <AppLayout>
      <ErrorBoundary fallback={<ErrorFallback error={new Error('Failed to load themes')} />}>
        <Suspense fallback={<Loading />}>
          <ThemeBrowser />
        </Suspense>
      </ErrorBoundary>
    </AppLayout>
  );
}
