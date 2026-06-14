'use client';

import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '@/utils/cn';
import { isSafeHref } from '@/shared/utils/safeHref';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span ?? []), ['className']],
    div: [...(defaultSchema.attributes?.div ?? []), ['className']],
    code: [...(defaultSchema.attributes?.code ?? []), ['className']],
  },
};

type LessonMarkdownBodyProps = {
  content: string;
};

export function LessonMarkdownBody({ content }: LessonMarkdownBodyProps) {
  const linkClass = cn(
    'focus-visible:ring-app-accent rounded-sm text-blue-400 underline decoration-blue-400/30',
    'hover:text-blue-300 hover:decoration-blue-300 focus-visible:ring-2',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via focus-visible:outline-none'
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[
        [rehypeKatex, { throwOnError: false, strict: 'ignore' }],
        [rehypeSanitize, sanitizeSchema],
      ]}
      components={{
        h1: ({ ...props }) => (
          <h1 className="mt-0 mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2
            className={cn(
              'border-surface-border/60 text-on-surface mt-4 mb-2 border-b pb-2 text-lg font-bold',
              'sm:mt-6 sm:text-xl md:text-2xl'
            )}
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-on-surface mt-3 mb-2 text-base font-bold sm:mt-4 sm:text-lg" {...props} />
        ),
        p: ({ ...props }) => (
          <p
            className="text-on-surface-muted mb-3 text-sm leading-relaxed sm:mb-4 sm:text-base md:text-lg"
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul
            className="text-on-surface-muted mb-3 list-inside list-disc space-y-1.5 sm:mb-4 sm:space-y-2"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className="text-on-surface-muted mb-3 list-inside list-decimal space-y-1.5 sm:mb-4 sm:space-y-2"
            {...props}
          />
        ),
        li: ({ ...props }) => <li className="ml-3 sm:ml-4" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            className={cn(
              'bg-surface-overlay/50 my-3 rounded-r-lg border-l-4 border-blue-500/80 py-2 pr-3 pl-3',
              'text-on-surface-muted italic sm:my-4 sm:pr-4 sm:pl-4'
            )}
            {...props}
          />
        ),
        table: ({ ...props }) => (
          <div className="lesson-table-wrap my-4 overflow-x-auto sm:my-5">
            <table className="lesson-table w-full min-w-[280px] text-left text-sm" {...props} />
          </div>
        ),
        thead: ({ ...props }) => <thead {...props} />,
        tbody: ({ ...props }) => <tbody {...props} />,
        tr: ({ ...props }) => <tr {...props} />,
        th: ({ ...props }) => <th {...props} />,
        td: ({ ...props }) => <td {...props} />,
        code: ({ className, children, ...props }) => {
          const isInline = !className?.includes('language-');
          const codeContent = Array.isArray(children) ? children.join('') : (children ?? '');
          return isInline ? (
            <code
              className="bg-surface-overlay rounded px-1.5 py-0.5 font-mono text-xs text-pink-400 sm:text-sm"
              {...props}
            >
              {codeContent}
            </code>
          ) : (
            <div
              className={cn(
                'border-surface-border bg-surface-overlay/80 my-3 overflow-x-auto rounded-lg border p-3',
                'sm:my-4 sm:p-4'
              )}
            >
              <code className={cn('text-on-surface font-mono text-xs sm:text-sm', className)} {...props}>
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
            <span className="text-on-surface-muted">{children}</span>
          ),
        img: ({ alt, ...rest }) => (
          // eslint-disable-next-line @next/next/no-img-element -- markdown lesson assets have unknown dimensions
          <img
            alt={typeof alt === 'string' && alt.trim() ? alt : 'Ilustración de la lección'}
            className="border-surface-border my-3 h-auto max-w-full rounded-xl border shadow-lg sm:my-4"
            {...rest}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
