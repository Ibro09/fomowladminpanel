"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
      async function checkAuth() {
        try {
          const res = await fetch("/api/me");
          if (res.ok) {
            setIsAuthed(true);
          } else {
            router.replace("/login");
          }
        } catch {
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      }

      checkAuth();
    }, [router]);

    if (loading) return <p>Loading...</p>;
    if (!isAuthed) return null;

    return <Component {...props} />;
  };
}
