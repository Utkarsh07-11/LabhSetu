"use client";

import { Button } from "@/components/ui/button";

export function ShareButton({
  title,
  url
}: {
  title: string;
  url: string;
}) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    window.alert("Report link copied to clipboard.");
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      Share
    </Button>
  );
}
