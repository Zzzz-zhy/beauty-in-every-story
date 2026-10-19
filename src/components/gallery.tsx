"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { readGalleryReturn } from "@/lib/browser-state";
import { stories } from "@/lib/content";
import { useApp } from "./providers";
import { Button, Photo, Intro, Breadcrumb, StoryLink, s } from "./ui";
export function Gallery() {
  const params = useSearchParams();
  const router = useRouter();
  const { preferences, reduced, ready } = useApp();
  const list =
    params.get("view") === "list" ||
    (!params.has("view") && ready && preferences.view === "list");
  const q = params.get("q") || "";
  const mood = params.get("mood") || "全部";
  const sort = params.get("sort") || "featured";
  const filtered = Boolean(q.trim()) || mood !== "全部";
  const filterDescription = [
    q.trim() ? `关键词「${q.trim()}」` : "",
    mood !== "全部" ? `情绪「${mood}」` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const [query, setQuery] = useState(q);
  useEffect(() => setQuery(q), [q]);
  const results = stories.filter(
    (st) =>
      (mood === "全部" || st.mood === mood) &&
      [st.title, st.music, st.mood, st.author].join(" ").includes(q.trim()),
  );
  if (sort === "latest") results.reverse();
  const totalPages = Math.max(1, Math.ceil(results.length / 3));
  const page = Math.max(
    1,
    Math.min(totalPages, Math.floor(Number(params.get("page"))) || 1),
  );
  const visible = list ? results.slice((page - 1) * 3, page * 3) : results;
  const update = (changes: Record<string, string>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    router.replace(`/stories?${p.toString()}`, { scroll: false });
  };
  useEffect(() => {
    try {
      if (sessionStorage.getItem("beauty-restore") === "true") {
        const data = readGalleryReturn();
        sessionStorage.removeItem("beauty-restore");
        const t = setTimeout(() => {
          window.scrollTo({ top: data?.y || 0, behavior: "instant" });
          if (data?.focus)
            document.getElementById(data.focus)?.focus({ preventScroll: true });
        }, 100);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);
  return (
    <div className={s.container}>
      <Breadcrumb>我们的美丽故事 / 每一种美</Breadcrumb>
      <Intro
        eyebrow={list ? "THE STORY COLLECTION" : "A L’ORÉAL GROUPE EXHIBITION"}
        title={list ? "找到此刻与你共鸣的故事" : "每一种美，都有自己的声音。"}
        description={
          list
            ? "按表达与音乐灵感探索，也可以直接搜索故事名称。图片均为 AI 视觉示意。"
            : "从音乐与妆容，走进她的表达。封面与精选图片均为 AI 视觉示意。"
        }
      />
      {!list && !filtered && (
        <section className={s.featured}>
          <Photo
            src="/images/photo-01.png"
            alt="AI示意：戴着银色耳机的女性，在阳光中聆听音乐"
            ratio="720 / 480"
            priority
          />
          <div className={s.featuredCopy}>
            <p className={s.meta}>本期精选 / AI 视觉示意</p>
            <h2>
              温柔，也有
              <br />
              自己的力量。
            </h2>
            <blockquote>
              “我想把那段安静的旋律，
              <br />
              变成每天都可以拥有的勇气。”
            </blockquote>
            <p className={s.meta}>林女士　·　温柔 / 钢琴　·　演示故事</p>
            <StoryLink
              id="gentle-strength"
              variant="featured"
              className={`${s.button} ${s.featureButton}`}
            >
              走进她的故事 →
            </StoryLink>
          </div>
        </section>
      )}
      {list ? (
        <>
          <form
            className={s.searchRow}
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: query, page: "" });
            }}
            role="search"
          >
            <label className="sr-only" htmlFor="story-search">
              搜索故事、音乐或关键词
            </label>
            <input
              id="story-search"
              placeholder="搜索故事、音乐或关键词"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit">搜索</Button>
            <Button
              secondary
              onClick={() => update({ view: "wall", page: "" })}
            >
              展墙浏览
            </Button>
          </form>
          <div className={s.filters}>
            <span>情绪表达</span>
            {[
              "全部",
              "温柔",
              "明亮",
              "自由",
              "浪漫",
              "勇敢",
              "自信",
              "平静",
              "喜悦",
            ].map((m) => (
              <button
                className={s.chip}
                key={m}
                aria-pressed={mood === m}
                onClick={() =>
                  update({ mood: m === "全部" ? "" : m, page: "" })
                }
              >
                {m}
              </button>
            ))}
          </div>
          <div className={s.resultsHead}>
            <span role="status">{results.length} 个故事</span>
            <label>
              <span className="sr-only">排序方式</span>
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value, page: "" })}
              >
                <option value="featured">策展顺序 ↓</option>
                <option value="latest">最新分享 ↓</option>
              </select>
            </label>
          </div>
        </>
      ) : (
        <div className={s.galleryHeading}>
          <h2>
            {filtered ? "筛选结果" : "全部故事"} /{" "}
            {String(results.length).padStart(2, "0")}
          </h2>
          <div className={s.segmented}>
            <button
              aria-pressed={!list}
              onClick={() => update({ view: "wall" })}
            >
              展墙浏览
            </button>
            <button
              aria-pressed={list}
              onClick={() => update({ view: "list" })}
            >
              列表浏览
            </button>
          </div>
        </div>
      )}
      {!list && filtered && (
        <div className={s.resultsHead}>
          <span role="status">当前筛选：{filterDescription}</span>
          <button
            className={s.backLink}
            onClick={() => update({ q: "", mood: "", page: "" })}
          >
            清除筛选
          </button>
        </div>
      )}
      {!visible.length ? (
        <div className={s.empty}>
          <p className={s.eyebrow}>没有匹配的故事</p>
          <h2>还没有找到匹配的故事。</h2>
          <p>试试更短的关键词，或清除筛选条件，听听其他人的表达。</p>
          <div className={s.buttonRow}>
            <Button
              onClick={() => {
                setQuery("");
                update({ q: "", mood: "", page: "" });
              }}
            >
              清除筛选，查看全部
            </Button>
            <Button
              secondary
              onClick={() =>
                update({ view: "wall", q: "", mood: "", page: "" })
              }
            >
              返回故事展墙
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          layout={!reduced}
          className={list ? s.storyList : s.gallery}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((st, i) => (
              <motion.article
                key={st.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{
                  duration: reduced ? 0 : 0.32,
                  delay: Math.min(i * 0.045, 0.18),
                }}
                className={list ? s.listItem : undefined}
              >
                {list ? (
                  <>
                    <StoryLink id={st.id}>
                      <Photo
                        src={st.thumbnail}
                        alt={`${st.title}，AI妆容示意`}
                        ratio="230 / 232"
                      />
                    </StoryLink>
                    <div>
                      <p className={s.meta}>
                        {String(stories.indexOf(st) + 1).padStart(2, "0")} /{" "}
                        {st.mood} · {st.music}
                      </p>
                      <h2>{st.title}</h2>
                      <p className={s.listQuote}>“{st.quote}”</p>
                    </div>
                    <StoryLink
                      id={st.id}
                      variant="action"
                      className={`${s.button} ${s.secondary}`}
                    >
                      阅读 / 收听故事 →
                    </StoryLink>
                  </>
                ) : (
                  <StoryLink id={st.id} className={s.storyCard}>
                    <div className={s.coverWrap}>
                      <Photo
                        src={st.cover}
                        alt={`${st.title}，${st.mood}与${st.music}灵感的AI艺术封面`}
                        ratio="314 / 310"
                      />
                      <span className={s.cardArrow} aria-hidden="true">
                        ↗
                      </span>
                    </div>
                    <h3>{st.title}</h3>
                    <p>
                      {String(stories.indexOf(st) + 1).padStart(2, "0")} /{" "}
                      {st.mood} · {st.music}
                    </p>
                  </StoryLink>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      {list && results.length > 3 && (
        <nav className={s.pagination} aria-label="故事分页">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              aria-current={page === i + 1 ? "page" : undefined}
              onClick={() => update({ page: String(i + 1) })}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => update({ page: String(page + 1) })}
          >
            下一页 →
          </button>
        </nav>
      )}
      {!list && (
        <div className={s.galleryEnd}>
          <Button
            secondary
            onClick={() => {
              update({ view: "list" });
              window.scrollTo({
                top: 0,
                behavior: reduced ? "instant" : "smooth",
              });
            }}
          >
            浏览更多故事 →
          </Button>
          <p>从一段音乐，走近一个人的表达。</p>
        </div>
      )}
    </div>
  );
}
