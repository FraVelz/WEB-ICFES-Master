import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/utils/cn';
import { isSafeHref } from '@/shared/utils/safeHref';

type LessonMarkdownBodyProps = {
  content: string;
};

export function LessonMarkdownBody({ content }: LessonMarkdownBodyProps) {
  const linkClass = cn(
    'focus-visible:ring-app-accent rounded-sm text-blue-400 underline decoration-blue-400/30',
    'hover:text-blue-300 hover:decoration-blue-300 focus-visible:ring-2',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none'
  );

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ ...props }) => (
          <h1 className="mt-0 mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2
            className={cn(
              'mt-4 mb-2 border-b border-slate-700/60 pb-2 text-lg font-bold text-slate-100',
              'sm:mt-6 sm:text-xl md:text-2xl'
            )}
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3 className="mt-3 mb-2 text-base font-bold text-slate-200 sm:mt-4 sm:text-lg" {...props} />
        ),
        p: ({ ...props }) => (
          <p className="mb-3 text-sm leading-relaxed text-slate-300 sm:mb-4 sm:text-base md:text-lg" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul className="mb-3 list-inside list-disc space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="mb-3 list-inside list-decimal space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2" {...props} />
        ),
        li: ({ ...props }) => <li className="ml-3 sm:ml-4" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            className={cn(
              'my-3 rounded-r-lg border-l-4 border-blue-500/80 bg-slate-800/50 py-2 pr-3 pl-3',
              'text-slate-400 italic sm:my-4 sm:pr-4 sm:pl-4'
            )}
            {...props}
          />
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className?.includes('language-');
          const codeContent = Array.isArray(children) ? children.join('') : (children ?? '');
          return isInline ? (
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-pink-400 sm:text-sm" {...props}>
              {codeContent}
            </code>
          ) : (
            <div
              className={cn(
                'my-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/80 p-3',
                'sm:my-4 sm:p-4'
              )}
            >
              <code className={cn('font-mono text-xs text-slate-200 sm:text-sm', className)} {...props}>
                {codeContent}
              </code>
            </div>
          );
        },
        a: ({ href, children, ...props }) =>
          isSafeHref(href) ? (
            <a
              href={href}
              className={linkClass}
              rel="noopener noreferrer"
              target={href?.startsWith('http') ? '_blank' : undefined}
              {...props}
            >
              {children}
            </a>
          ) : (
            <span className="text-slate-400">{children}</span>
          ),
        img: ({ alt, ...rest }) => (
          // eslint-disable-next-line @next/next/no-img-element -- markdown lesson assets have unknown dimensions
          <img
            alt={typeof alt === 'string' ? alt : ''}
            className="my-3 h-auto max-w-full rounded-xl border border-slate-700 shadow-lg sm:my-4"
            {...rest}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
