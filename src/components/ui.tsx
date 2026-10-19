"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useApp } from "./providers";
import s from "./ui.module.css";
export function Button({
  href,
  children,
  secondary = false,
  onClick,
  disabled = false,
  external = false,
  type = "button",
  className = "",
}: {
  href?: string;
  children: ReactNode;
  secondary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const cls = `${s.button} ${secondary ? s.secondary : ""} ${className}`;
  if (href)
    return (
      <Link
        className={cls}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
export function Photo({
  src,
  alt,
  ratio = "1",
  priority = false,
  contain = false,
  className = "",
  detail = false,
}: {
  src: string;
  alt: string;
  ratio?: string;
  priority?: boolean;
  contain?: boolean;
  className?: string;
  detail?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`${s.photo} ${contain ? s.contain : ""} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {failed ? (
        <span className={s.imageFallback}>
          {alt}
          <br />
          图片暂时无法加载
        </span>
      ) : (
        <span className={s.imageBox}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 45vw"
            preload={priority}
            style={{ objectFit: contain ? "contain" : "cover" }}
            onError={() => setFailed(true)}
            data-detail-image={detail || undefined}
            data-story-visual
          />
        </span>
      )}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reduced } = useApp();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.6, 1], y: [12, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: Math.min(delay, 0.18),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function Intro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={s.intro}>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className={s.description}>{description}</p>}
    </div>
  );
}
export function Breadcrumb({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="面包屑" className={s.breadcrumb}>
      <Link href="/">首页</Link>
      <span aria-hidden="true"> / </span>
      {children}
    </nav>
  );
}
export function StoryLink({
  id,
  children,
  className = "",
  variant = "card",
}: {
  id: string;
  variant?: "card" | "featured" | "action";
  children: ReactNode;
  className?: string;
}) {
  const { openStory } = useApp();

  return (
    <Link
      data-story-link
      href={`/stories/${id}`}
      id={`story-${id}-${variant}`}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const img =
          e.currentTarget.querySelector("img") ||
          e.currentTarget.closest("article, section")?.querySelector("img") ||
          null;
        openStory(`/stories/${id}`, img, e.currentTarget.id);
      }}
    >
      {children}
    </Link>
  );
}
export function Steps({ current = 1 }: { current?: number }) {
  return (
    <ol className={s.steps}>
      {["确认清单", "前往官方商城", "在商城完成购买"].map((name, i) => (
        <li key={name} aria-current={current === i + 1 ? "step" : undefined}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          {name}
        </li>
      ))}
    </ol>
  );
}
export { s };
