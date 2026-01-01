export function PageFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-8 pb-3">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs text-muted-foreground/60 font-mono">
          crapdash {version}
        </p>
      </div>
    </footer>
  );
}

