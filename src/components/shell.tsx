"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useApp } from "./providers";
import { Button, s } from "./ui";
export function Header() {
  const { setSettingsOpen, items } = useApp();
  return (
    <header className={s.header}>
      <div className={s.headerTop}>
        <div className={`${s.utility} ${s.leftUtility}`}>
          <a href="https://www.loreal.com/en/mediaroom/">媒体</a>
          <a href="https://www.loreal.com/en/suppliers/">供应商</a>
          <a href="https://www.loreal-finance.com/">投资者与股东</a>
        </div>
        <Link className={s.logo} href="/" aria-label="欧莱雅集团首页">
          <img
            src="/images/logo.svg"
            width="137"
            height="36"
            alt="L’Oréal Groupe"
          />
        </Link>
        <div className={s.utility}>
          <button onClick={() => setSettingsOpen(true)}>阅读设置</button>
          <Link className={s.cartLink} href="/selection">
            妆容清单{items.length > 0 ? ` (${items.length})` : ""}
          </Link>
          <span>中文</span>
        </div>
      </div>
      <nav className={s.mainNav} aria-label="主导航">
        <Link href="/">欧莱雅集团</Link>
        <Link href="/stories">故事展览</Link>
        <Link href="/impact">承诺</Link>
        <a href="https://www.loreal.com/en/our-global-brands-portfolio/">
          品牌
        </a>
        <a href="https://www.loreal.com/en/beauty-science-and-technology/">
          美妆科技
        </a>
      </nav>
    </header>
  );
}
export function Footer() {
  const { setSettingsOpen } = useApp();
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerTop}>
          <div>
            <Link href="/" aria-label="回到首页">
              <img
                src="/images/logo.svg"
                width="137"
                height="36"
                alt="L’Oréal Groupe"
              />
            </Link>
            <p>创造美，让世界为之所动</p>
          </div>
          <div>
            <nav className={s.footerLinks} aria-label="页脚导航">
              <Link href="/">集团</Link>
              <Link href="/impact">承诺</Link>
              <Link href="/stories">故事展览</Link>
              <a href="https://www.loreal.com/en/beauty-science-and-technology/">
                美妆科技
              </a>
            </nav>
            <div className={s.footerLinks}>
              <a href="https://www.loreal.com/en/">欧莱雅官网 ↗</a>
              <button onClick={() => setSettingsOpen(true)}>无障碍设置</button>
              <Link href="/impact">公益说明</Link>
            </div>
          </div>
        </div>
        <div className={s.copyright}>
          <span>© L’Oréal Groupe　 BEAUTY IN EVERY STORY</span>
          <span>概念体验 · AI 视觉示意</span>
        </div>
      </div>
    </footer>
  );
}
export function Settings() {
  const { preferences, setPreferences, settingsOpen, setSettingsOpen } =
    useApp();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (settingsOpen) ref.current?.showModal();
    else ref.current?.close();
  }, [settingsOpen]);
  return (
    <dialog
      ref={ref}
      className={s.modal}
      aria-labelledby="settings-title"
      onClose={() => setSettingsOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            setSettingsOpen(false);
        }
      }}
    >
      <div className={s.modalHeader}>
        <h2 id="settings-title">用适合你的方式，感受故事。</h2>
        <button
          className={s.close}
          aria-label="关闭阅读设置"
          onClick={() => setSettingsOpen(false)}
        >
          ×
        </button>
      </div>
      <p className={s.meta}>设置会保存在这台设备上。完整文字内容始终可读。</p>
      <div className={s.settingsRow}>
        <h3>文字大小</h3>
        <p>文字放大后，内容会重新排版。</p>
        <div className={s.optionRow}>
          {[false, true].map((v) => (
            <button
              key={String(v)}
              className={s.chip}
              aria-pressed={preferences.large === v}
              onClick={() => setPreferences({ ...preferences, large: v })}
            >
              {v ? "放大" : "标准"}
            </button>
          ))}
        </div>
      </div>
      <div className={s.settingsRow}>
        <h3>页面动效</h3>
        <p>减少动态效果将关闭视差、位移与封面飞行动画。</p>
        <div className={s.optionRow}>
          {(["system", "full", "reduce"] as const).map((v, i) => (
            <button
              key={v}
              className={s.chip}
              aria-pressed={preferences.motion === v}
              onClick={() => setPreferences({ ...preferences, motion: v })}
            >
              {["跟随系统", "完整动效", "减少动态效果"][i]}
            </button>
          ))}
        </div>
      </div>
      <div className={s.settingsRow}>
        <h3>文字对比度</h3>
        <div className={s.optionRow}>
          {[false, true].map((v) => (
            <button
              key={String(v)}
              className={s.chip}
              aria-pressed={preferences.contrast === v}
              onClick={() => setPreferences({ ...preferences, contrast: v })}
            >
              {v ? "增强" : "标准"}
            </button>
          ))}
        </div>
      </div>
      <div className={s.settingsRow}>
        <h3>偏好的浏览方式</h3>
        <div className={s.optionRow}>
          {(["wall", "list"] as const).map((v) => (
            <button
              key={v}
              className={s.chip}
              aria-pressed={preferences.view === v}
              onClick={() => setPreferences({ ...preferences, view: v })}
            >
              {v === "wall" ? "展墙浏览" : "列表浏览"}
            </button>
          ))}
        </div>
      </div>
      <div className={s.buttonRow}>
        <Button onClick={() => setSettingsOpen(false)}>保存并返回</Button>
        <Button
          secondary
          onClick={() =>
            setPreferences({
              motion: "system",
              large: false,
              contrast: false,
              view: "wall",
            })
          }
        >
          恢复默认
        </Button>
      </div>
    </dialog>
  );
}
