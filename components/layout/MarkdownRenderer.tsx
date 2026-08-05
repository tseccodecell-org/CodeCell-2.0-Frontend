import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function normalizeDisplayMath(source: string) {
  return source.replace(
    /^[ \t]*\$\$[ \t]*([^\n]+?)[ \t]*\$\$[ \t]*$/gm,
    (_match, body: string) => `$$\n${body}\n$$`
  );
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const isInline = !className || !className.startsWith("language-");
      return isInline ? (
        <code
          className="bg-[#0d0f14] border border-[#1a1c24] text-[#D9A404] px-1.5 py-0.5 rounded font-mono text-[11px]"
          {...props}
        >
          {children}
        </code>
      ) : (
        <pre className="bg-[#06070B] border border-[#1a1c24] p-4 rounded-lg my-3 overflow-x-auto text-[11px] font-mono leading-relaxed text-white">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    p({ children }) {
      return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc list-inside mb-3 pl-4 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal list-inside mb-3 pl-4 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="text-[11px] md:text-xs list-item">{children}</li>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-[#D9A404] pl-4 italic my-3 text-[#F4F1EA]/75 bg-[#D9A404]/5 py-2.5 pr-2 rounded-r-md">
          {children}
        </blockquote>
      );
    },
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[#D9A404] hover:underline inline-flex items-center gap-0.5"
        >
          {children}
        </a>
      );
    },
    h1({ children }) {
      return <h1 className="text-xl font-bold font-serif text-white mt-4 mb-2 uppercase tracking-wide">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-lg font-bold font-serif text-white mt-3 mb-2 uppercase tracking-wide">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-base font-bold font-serif text-white mt-2 mb-1 uppercase tracking-wide">{children}</h3>;
    },
  };

  // an explicit base colour, so rendered maths never inherits whatever muted
  // grey happens to wrap the block it was dropped into
  return (
    <div className={`markdown-content text-[#F4F1EA] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {normalizeDisplayMath(content)}
      </ReactMarkdown>
    </div>
  );
}
