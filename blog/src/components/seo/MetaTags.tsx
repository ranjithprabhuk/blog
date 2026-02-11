import { useEffect } from "react";
import { config } from "../../config";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
}

export default function MetaTags({
  title,
  description,
  image,
  type = "website",
}: MetaTagsProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${config.blog.title}`
      : config.blog.title;
    const desc = description || config.blog.description;

    document.title = fullTitle;

    // Update or create meta tags
    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", type, "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    if (image) setMeta("twitter:image", image);
  }, [title, description, image, type]);

  return null;
}

function setMeta(
  name: string,
  content: string,
  attr: "name" | "property" = "name",
) {
  let el = document.querySelector(
    `meta[${attr}="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
