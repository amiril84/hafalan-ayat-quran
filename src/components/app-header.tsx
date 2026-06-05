import type { ReactNode } from "react";

type AppHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AppHeader({ title, description, action }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Tahfidzh MJ
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
