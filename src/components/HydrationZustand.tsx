'use client';

import { useEffect, useState } from 'react';

export default function HydrationZustand({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null; // or a loading spinner

  return <>{children}</>;
}
