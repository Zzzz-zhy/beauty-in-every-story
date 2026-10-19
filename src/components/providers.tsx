"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { products } from "@/lib/content";
import {
  defaultPreferences,
  parsePreferences,
  parseSelection,
  readJSON,
  readGalleryReturn,
  validStoryId,
  type Preferences,
  type SelectionItem as Item,
} from "@/lib/browser-state";
type Snapshot = {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};
const initial = defaultPreferences;
const Context = createContext({
  items: [] as Item[],
  ready: false,
  selectionStoryId: null as string | null,
  setSelectionStoryId: (_id: string | null) => {},
  preferences: initial,
  reduced: true,
  setPreferences: (_p: Preferences) => {},
  setItems: (_i: Item[]) => {},
  add: (_id: string) => {},
  notify: (_s: string) => {},
  openStory: (
    _href: string,
    _image: HTMLImageElement | null,
    _focus: string,
  ) => {},
  returnToGallery: () => {},
  settingsOpen: false,
  setSettingsOpen: (_v: boolean) => {},
});
export const useApp = () => useContext(Context);
export function Providers({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [selectionStoryId, setSelectionStoryId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState(initial);
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const overlay = useRef<HTMLImageElement>(null);
  const system = useReducedMotion();
  const reduced =
    preferences.motion === "reduce" ||
    (preferences.motion === "system" && system !== false);
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    try {
      setItems(parseSelection(readJSON(localStorage, "beauty-selection")));
      setPreferences(
        parsePreferences(readJSON(localStorage, "beauty-preferences")),
      );
      setSelectionStoryId(
        validStoryId(readJSON(localStorage, "beauty-selection-story")),
      );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("beauty-selection", JSON.stringify(items));
      localStorage.setItem(
        "beauty-selection-story",
        JSON.stringify(selectionStoryId),
      );
      localStorage.setItem("beauty-preferences", JSON.stringify(preferences));
    } catch {}
    document.documentElement.dataset.motion = reduced ? "reduce" : "full";
    document.documentElement.dataset.text = preferences.large
      ? "large"
      : "standard";
    document.documentElement.dataset.contrast = preferences.contrast
      ? "high"
      : "standard";
  }, [items, selectionStoryId, preferences, ready, reduced]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    setSettingsOpen(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [path]);
  useEffect(() => {
    if (!snapshot) return;
    const el = overlay.current;
    if (!el) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let anim: Animation | undefined;
    const started = performance.now();
    const attempt = () => {
      if (stopped) return;
      const target = document.querySelector<HTMLImageElement>(
        "[data-detail-image]",
      );
      if (
        target &&
        path.startsWith("/stories/") &&
        target.complete &&
        target.naturalWidth > 0
      ) {
        const r = target.getBoundingClientRect();
        anim = el.animate(
          [
            { transform: "translate(0,0) scale(1,1)", opacity: 1 },
            {
              transform: `translate(${r.left - snapshot.left}px,${r.top - snapshot.top}px) scale(${r.width / snapshot.width},${r.height / snapshot.height})`,
              opacity: 1,
              offset: 0.78,
            },
            {
              transform: `translate(${r.left - snapshot.left}px,${r.top - snapshot.top}px) scale(${r.width / snapshot.width},${r.height / snapshot.height})`,
              opacity: 0,
            },
          ],
          {
            duration: 560,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "forwards",
          },
        );
        anim.finished
          .then(() => {
            if (!stopped) setSnapshot(null);
          })
          .catch(() => {});
        return;
      }
      if (performance.now() - started > 1500) {
        setSnapshot(null);
        return;
      }
      timer = setTimeout(attempt, 32);
    };
    attempt();
    return () => {
      stopped = true;
      clearTimeout(timer);
      anim?.cancel();
    };
  }, [path, snapshot]);
  useEffect(() => {
    if (reduced) setSnapshot(null);
  }, [reduced]);
  const openStory = (
    href: string,
    img: HTMLImageElement | null,
    focus: string,
  ) => {
    try {
      sessionStorage.setItem(
        "beauty-return",
        JSON.stringify({
          url: location.pathname + location.search,
          y: scrollY,
          focus,
        }),
      );
    } catch {}
    if (img && img.complete && img.naturalWidth > 0 && !reduced) {
      const r = img.getBoundingClientRect();
      setSnapshot({
        src: img.currentSrc || img.src,
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      });
    }
    router.push(href);
  };
  const returnToGallery = () => {
    const record = readGalleryReturn();
    try {
      if (record) sessionStorage.setItem("beauty-restore", "true");
    } catch {}
    router.push(record?.url || "/stories", { scroll: !record });
  };
  return (
    <Context.Provider
      value={{
        items,
        ready,
        selectionStoryId,
        setSelectionStoryId,
        preferences,
        reduced,
        setPreferences,
        setItems,
        add: (id) => {
          setItems((old) =>
            old.some((i) => i.id === id)
              ? old.map((i) => (i.id === id ? { ...i, selected: true } : i))
              : [...old, { id, quantity: 1, selected: true }],
          );
          setNotice("已加入妆容清单");
        },
        notify: setNotice,
        openStory,
        returnToGallery,
        settingsOpen,
        setSettingsOpen,
      }}
    >
      <MotionConfig
        reducedMotion={reduced ? "always" : "never"}
        transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
      >
        {children}
        {snapshot && (
          <img
            ref={overlay}
            src={snapshot.src}
            alt=""
            aria-hidden="true"
            style={{
              position: "fixed",
              zIndex: 90,
              pointerEvents: "none",
              objectFit: "cover",
              transformOrigin: "top left",
              ...{
                left: snapshot.left,
                top: snapshot.top,
                width: snapshot.width,
                height: snapshot.height,
              },
            }}
          />
        )}
        <div className="toast" role="status" aria-live="polite">
          {notice && <span>{notice}</span>}
        </div>
      </MotionConfig>
    </Context.Provider>
  );
}
