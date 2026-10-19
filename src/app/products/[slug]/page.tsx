import s from "@/components/ui.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, productRepository, storyRepository } from "@/lib/content";
import { Photo, Breadcrumb } from "@/components/ui";
import { ProductActions } from "@/components/product-actions";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: productRepository.find(slug)?.name || "产品未找到" };
}
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ story?: string }>;
}) {
  const { slug } = await params;
  const p = productRepository.find(slug);
  if (!p) notFound();
  const query = await searchParams;
  const story = storyRepository.find(query.story || "");
  return (
    <div className={s.container}>
      <Breadcrumb>
        {story ? (
          <Link href={`/stories/${story.id}`}>{story.title}</Link>
        ) : (
          <Link href="/stories">故事展览</Link>
        )}{" "}
        / 产品预览
      </Breadcrumb>
      <section className={s.productDetail}>
        <figure>
          <Photo
            src={p.image}
            alt={`${p.name}，${p.shade}`}
            ratio="660 / 700"
            contain
            priority
            className={`${s.rounded} ${s.shadow}`}
          />
          <figcaption className={s.caption}>
            产品图片来源：L’Oréal Paris 美国官网
          </figcaption>
        </figure>
        <div className={s.productInfo}>
          <p className={s.eyebrow}>L’ORÉAL PARIS</p>
          <h1>{p.name}</h1>
          <p className={s.description}>{p.description}</p>
          {story && <p className={s.meta}>来自「{story.title}」</p>}
          <p className={s.description}>
            具体功效、成分与使用信息请查看官方产品页。
          </p>
          <ProductActions product={p} storyId={story?.id ?? null} />
        </div>
      </section>
      {story && (
        <section className={s.quoteSection}>
          <h2>为什么选择它？</h2>
          <p className={s.description}>“{story.quote}”</p>
          <div className={s.buttonRow}>
            <Link className={s.backLink} href={`/stories/${story.id}`}>
              ← 回到她的故事
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
