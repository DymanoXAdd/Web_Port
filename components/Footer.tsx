import Link from "next/link";

// Site footer: copyright and the privacy policy link (T-036). `note` adds a page-specific line,
// e.g. the Mojang notice on /minecraft.
export default function Footer({ note }: { note?: string }) {
  return (
    <footer className="border-t border-line bg-ink px-6 py-8 font-mono text-sm text-muted">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3">
        {note && <p>{note}</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© Luis A Ruiz</p>
          <Link href="/privacy" className="text-soft underline underline-offset-4 hover:text-fg">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
