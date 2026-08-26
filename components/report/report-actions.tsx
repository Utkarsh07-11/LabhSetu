"use client";

import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/shared/share-button";

export function ReportActions({ shareUrl }: { shareUrl: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => window.print()}>Download PDF</Button>
      <ShareButton title="LabhSetu Eligibility Report" url={shareUrl} />
    </div>
  );
}
