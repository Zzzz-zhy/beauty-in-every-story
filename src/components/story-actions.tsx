"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { type Story, descriptions, products } from "@/lib/content";
import { useApp } from "./providers";
import { Button, Photo, s } from "./ui";
export function BackToGallery() {
  const { returnToGallery } = useApp();
  return (
    <button className={s.backLink} onClick={returnToGallery}>
      ← 返回故事展览
    </button>
  );
}
export function StoryActions({ story }: { story: Story }) {
  const { notify } = useApp();
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [available, setAvailable] = useState(false);
  const [rate, setRate] = useState("1");
  const [share, setShare] = useState(false);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const text = `${story.title}。${story.quote}。${story.inspiration}。${story.makeup}。${descriptions[story.id]}`;
  useEffect(() => {
    setAvailable("speechSynthesis" in window);
    setUrl(location.origin + `/stories/${story.id}`);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [story.id]);
  useEffect(() => {
    if (share) dialog.current?.showModal();
    else dialog.current?.close();
  }, [share]);
  const play = () => {
    if (!available) {
      setError("当前浏览器不支持系统朗读，请阅读下方完整文字。");
      return;
    }
    setError("");
    if (state === "playing") {
      speechSynthesis.pause();
      setState("paused");
      return;
    }
    if (state === "paused") {
      speechSynthesis.resume();
      setState("playing");
      return;
    }
    speechSynthesis.cancel();
    setProgress(0);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = Number(rate);
    u.onboundary = (e) => {
      if (utterance.current === u)
        setProgress(Math.round((e.charIndex / text.length) * 100));
    };
    u.onend = () => {
      if (utterance.current !== u) return;
      utterance.current = null;
      setState("idle");
      setProgress(100);
    };
    u.onerror = (e) => {
      if (utterance.current !== u) return;
      utterance.current = null;
      setState("idle");
      if (e.error !== "canceled" && e.error !== "interrupted")
        setError("朗读暂时不可用，完整文字就在下方。");
    };
    utterance.current = u;
    speechSynthesis.speak(u);
    setState("playing");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      notify("故事链接已复制，可以粘贴分享。");
    } catch {
      notify("复制未成功，请选择下方链接手动复制。");
    }
  };
  return (
    <>
      <div className={s.player}>
        <div className={s.playerActions}>
          <Button onClick={play}>
            {state === "playing"
              ? "Ⅱ 暂停朗读"
              : state === "paused"
                ? "▷ 继续朗读"
                : "▷ 播放故事解说"}
          </Button>
          <Button secondary onClick={() => setShare(true)}>
            分享故事 ↗
          </Button>
        </div>
        <div className={s.playerMeta}>
          <span>
            {state === "playing"
              ? "正在朗读"
              : state === "paused"
                ? "已暂停"
                : "系统语音朗读"}
            {progress > 0 ? ` · ${progress}%` : ""}
          </span>
          <label>
            <span className="sr-only">朗读速度</span>
            <select
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
                if (state !== "idle") {
                  utterance.current = null;
                  speechSynthesis.cancel();
                  setState("idle");
                  setProgress(0);
                  notify("语速已更改，再次播放将从头开始。");
                }
              }}
            >
              <option value="0.8">0.8 ×</option>
              <option value="1">1.0 ×</option>
              <option value="1.2">1.2 ×</option>
            </select>
          </label>
          {state !== "idle" && (
            <button
              className={s.backLink}
              onClick={() => {
                utterance.current = null;
                speechSynthesis.cancel();
                setState("idle");
                setProgress(0);
              }}
            >
              停止朗读
            </button>
          )}
          <a href="#story-transcript" className={s.backLink}>
            文字稿见下方
          </a>
        </div>
        {error && (
          <p role="status" className={s.supportNote}>
            {error}
          </p>
        )}
      </div>
      <dialog
        ref={dialog}
        className={s.modal}
        onClose={() => setShare(false)}
        aria-labelledby="share-title"
      >
        <div className={s.modalHeader}>
          <h2 id="share-title">把打动你的故事，分享出去。</h2>
          <button
            className={s.close}
            aria-label="关闭分享"
            onClick={() => setShare(false)}
          >
            ×
          </button>
        </div>
        <div className={s.shareCard}>
          <Photo
            src={
              story.id === "gentle-strength"
                ? "/images/photo-05.png"
                : story.cover
            }
            alt="故事分享预览，AI视觉示意"
            ratio="2"
            className={s.rounded}
          />
          <h3>{story.title}</h3>
          <p>从一段音乐开始，听见她选择表达的自己。</p>
        </div>
        <p className={s.meta}>
          分享公开故事链接，不包含你的妆容清单或阅读设置。
        </p>
        <label className="sr-only" htmlFor="share-url">
          故事链接
        </label>
        <input
          id="share-url"
          className={s.shareUrl}
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
        />
        <div className={s.stack}>
          <Button onClick={copy}>复制故事链接</Button>
          <Button
            secondary
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: story.title,
                    text: story.quote,
                    url,
                  });
                } catch (e) {
                  if ((e as Error).name !== "AbortError")
                    notify("分享未完成，可以复制链接。");
                }
              } else {
                await copy();
              }
            }}
          >
            调用系统分享 / 复制链接
          </Button>
        </div>
      </dialog>
    </>
  );
}
export function CreateSelection({ storyId }: { storyId: string }) {
  const router = useRouter();
  const { items, setItems, notify, setSelectionStoryId, ready } = useApp();
  return (
    <Button
      disabled={!ready}
      onClick={() => {
        setSelectionStoryId(storyId);
        setItems(
          products.map((p) => {
            const existing = items.find((i) => i.id === p.id);
            return {
              id: p.id,
              quantity: existing?.quantity ?? 1,
              selected:
                p.id !== "true-match-blush" || existing?.selected === true,
            };
          }),
        );
        notify("妆容清单已准备好");
        router.push("/selection");
      }}
    >
      一键选购同款 →
    </Button>
  );
}
