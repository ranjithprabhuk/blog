import { useEffect, useRef } from "react";

interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Attach copy-to-clipboard handlers
    const copyButtons = contentRef.current.querySelectorAll(".copy-btn");
    const handlers: Array<{ el: Element; handler: () => void }> = [];

    copyButtons.forEach((btn) => {
      const handler = () => {
        const code = decodeURIComponent(
          btn.getAttribute("data-code") || "",
        );
        navigator.clipboard.writeText(code).then(() => {
          const original = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = original;
          }, 2000);
        });
      };
      btn.addEventListener("click", handler);
      handlers.push({ el: btn, handler });
    });

    return () => {
      handlers.forEach(({ el, handler }) =>
        el.removeEventListener("click", handler),
      );
    };
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-pre:!m-0 prose-pre:!bg-transparent
        prose-code:before:content-none prose-code:after:content-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
