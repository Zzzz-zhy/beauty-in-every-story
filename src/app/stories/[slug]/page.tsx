import s from "@/components/ui.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  stories,
  storyRepository,
  products,
  descriptions,
} from "@/lib/content";
import { Photo, Button, Breadcrumb, Reveal } from "@/components/ui";
import {
  BackToGallery,
  StoryActions,
  CreateSelection,
} from "@/components/story-actions";
export function generateStaticParams() {
  return stories.map((st) => ({ slug: st.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = storyRepository.find(slug);
  return { title: story?.title || "故事暂时不可用", description: story?.quote };
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const st = storyRepository.find(slug);
  if (!st) notFound();
  return (
    <div className={s.container}>
      <Breadcrumb>
        <Link href="/stories">故事展览</Link> / {st.title}
      </Breadcrumb>
      <section className={s.detailHero}>
        <div className={s.detailCopy}>
          <p className={s.eyebrow}>
            STORY {String(stories.indexOf(st) + 1).padStart(2, "0")} / {st.mood}{" "}
            · {st.music}
          </p>
          <h1>
            {st.id === "gentle-strength" ? (
              <>
                温柔，也有
                <br />
                自己的力量。
              </>
            ) : (
              st.title
            )}
          </h1>
          <blockquote>
            “
            {st.id === "gentle-strength"
              ? "我不需要成为另一个人。我只是想，让今天的自己更靠近心里的样子。"
              : st.quote}
            ”
          </blockquote>
          <p className={s.meta}>{st.author}的妆容故事　·　演示故事</p>
          <StoryActions story={st} />
        </div>
        <figure>
          <Photo
            src={st.image}
            alt={`${st.title}的妆容效果，AI视觉示意`}
            ratio="660 / 625"
            className={`${s.rounded} ${s.shadow}`}
            priority
            detail
          />
          <figcaption className={s.caption}>
            AI 生成效果示意 · 虚构人物，非参与者实拍
          </figcaption>
        </figure>
      </section>
      <div id="story-transcript">
        <section className={s.chapter}>
          <p>01 灵感从一段音乐开始</p>
          <Reveal>
            <h2>{st.inspiration}</h2>
            <p className={s.chapterText}>{st.makeup}</p>
            <p className={s.meta}>
              音乐灵感：{st.music} · {st.mood}的情绪表达
            </p>
          </Reveal>
        </section>
        <section className={s.chapter}>
          <p>02 听见这次妆容</p>
          <Reveal>
            <h2>{st.look}</h2>
            <p className={s.chapterText}>{descriptions[st.id]}</p>
            <p style={{ marginTop: 28 }}>
              这是我和顾问一起调整、最终确认的表达。
            </p>
          </Reveal>
        </section>
      </div>
      <section className={s.products}>
        <h2>让故事里的美，延续到日常。</h2>
        <p className={s.meta}>
          {st.id === "gentle-strength"
            ? "本次使用的产品"
            : "妆容灵感产品参考 · 具体色号可在官方页面选择"}
        </p>
        <div className={s.productGrid}>
          {products.map((p) => (
            <article className={s.productCard} key={p.id}>
              <Link href={`/products/${p.id}?story=${st.id}`}>
                <Photo
                  src={p.image}
                  alt={p.name}
                  ratio="420 / 265"
                  contain
                  className={`${s.rounded} ${s.shadow}`}
                />
                <h3>{p.name}</h3>
              </Link>
              <p className={s.meta}>{p.shade} · 巴黎欧莱雅</p>
              <Button
                href={`/products/${p.id}?story=${st.id}`}
                secondary
                className={s.full}
              >
                查看产品 →
              </Button>
            </article>
          ))}
        </div>
        <div className={s.buttonRow}>
          <CreateSelection storyId={st.id} />
          <span className={s.meta} style={{ alignSelf: "center" }}>
            先确认产品与色号，再前往品牌官方商城。
          </span>
        </div>
      </section>
      <div className={s.impactStrip}>
        <h2>让更多人的表达，被听见。</h2>
        <Button href="/impact" secondary>
          了解公益联动计划 →
        </Button>
      </div>
      <BackToGallery />
    </div>
  );
}
