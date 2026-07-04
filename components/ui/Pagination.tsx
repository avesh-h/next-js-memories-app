import Link from "next/link";

/**
 * Generic prev/next pager driven by a URL query param. Shared UI — any list
 * (posts, users, …) can use it by passing its base path.
 */
export function Pagination({
  page,
  numberOfPages,
  basePath = "/posts",
}: {
  page: number;
  numberOfPages: number;
  basePath?: string;
}) {
  const hasPrev = page > 1;
  const hasNext = page < numberOfPages;

  return (
    <div className="flex items-center justify-center gap-4">
      <PageLink href={`${basePath}?page=${page - 1}`} disabled={!hasPrev}>
        ← Prev
      </PageLink>
      <span className="text-sm text-slate-500">
        Page {page} of {numberOfPages}
      </span>
      <PageLink href={`${basePath}?page=${page + 1}`} disabled={!hasNext}>
        Next →
      </PageLink>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-300">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      {children}
    </Link>
  );
}
