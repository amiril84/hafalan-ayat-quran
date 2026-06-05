import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({
  label = "Data ayat sedang dimuat.",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-lg border border-border bg-white px-5 py-4 text-sm font-medium text-muted-foreground"
    >
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
