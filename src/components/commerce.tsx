"use client";
import { useState } from "react";
import Link from "next/link";
import { products, stories } from "@/lib/content";
import { useApp } from "./providers";
import { Button, Photo, Intro, Breadcrumb, Steps, s } from "./ui";
export function Selection() {
  const { items, setItems, ready, selectionStoryId } = useApp();
  const sourceStory = stories.find((st) => st.id === selectionStoryId);
  const storyHref = sourceStory ? `/stories/${sourceStory.id}` : "/stories";
  const selected = items.filter((i) => i.selected);
  const count = selected.reduce((n, i) => n + i.quantity, 0);
  return (
    <div className={s.container}>
      <Breadcrumb>
        <Link href={storyHref}>{sourceStory ? "故事详情" : "故事展览"}</Link> /
        一键选购同款
      </Breadcrumb>
      <Intro
        eyebrow="SHOP THE STORY"
        title="把这份表达，带进日常。"
        description={
          sourceStory
            ? `来自「${sourceStory.title}」的妆容灵感清单。你可以只选择需要的产品。`
            : "你的妆容灵感清单。你可以只选择需要的产品。"
        }
      />
      <Steps />
      {!ready ? (
        <p>正在读取你的清单…</p>
      ) : (
        <div className={s.selectionLayout}>
          <div>
            {products.map((p) => {
              const item = items.find((i) => i.id === p.id);
              const quantity = item?.quantity || 1;
              const update = (q: number) =>
                setItems(
                  item
                    ? items.map((i) =>
                        i.id === p.id ? { ...i, quantity: q } : i,
                      )
                    : [...items, { id: p.id, quantity: q, selected: true }],
                );
              return (
                <article className={s.selectionItem} key={p.id}>
                  <label>
                    <input
                      type="checkbox"
                      aria-label={`选择${p.name}`}
                      checked={item?.selected || false}
                      onChange={(e) =>
                        setItems(
                          item
                            ? items.map((i) =>
                                i.id === p.id
                                  ? { ...i, selected: e.target.checked }
                                  : i,
                              )
                            : [
                                ...items,
                                { id: p.id, quantity: 1, selected: true },
                              ],
                        )
                      }
                    />
                  </label>
                  <Photo src={p.image} alt={p.name} ratio="150 / 170" contain />
                  <div>
                    <h2>{p.name}</h2>
                    <p className={s.meta}>{p.shade}</p>
                    <Link
                      className={s.backLink}
                      href={`/products/${p.id}${sourceStory ? `?story=${sourceStory.id}` : ""}`}
                    >
                      查看色号 / 产品详情
                    </Link>
                    <div className={s.quantity}>
                      <button
                        aria-label={`减少${p.name}数量`}
                        disabled={quantity <= 1}
                        onClick={() => update(quantity - 1)}
                      >
                        −
                      </button>
                      <output aria-label={`${p.name}数量`}>{quantity}</output>
                      <button
                        aria-label={`增加${p.name}数量`}
                        disabled={quantity >= 9}
                        onClick={() => update(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className={s.summary} aria-label="清单摘要">
            <h2>你的妆容清单</h2>
            <p role="status">已选 {count} 件 · 巴黎欧莱雅</p>
            <p>价格、库存与优惠将在品牌官方商城中确认。当前页面不会付款。</p>
            <h3>公益联动方案筹备中</h3>
            <p>
              计划将活动商品销售利润的一部分用于支持视障女性。比例与规则公布后生效。
            </p>
            <div className={s.stack}>
              {count ? (
                <Button href="/shop-handoff">一键选购已选 {count} 件 →</Button>
              ) : (
                <Button disabled>请先选择产品</Button>
              )}
              <Button href="/impact" secondary>
                查看公益计划
              </Button>
            </div>
          </aside>
        </div>
      )}
      <div className={s.selectionFoot}>
        <p>
          同款不一定适合所有肤色与肤质。你可以在商城或向美妆顾问咨询适合自己的选择。
        </p>
        <Button href={storyHref} secondary>
          ← {sourceStory ? "返回故事" : "返回故事展览"}
        </Button>
      </div>
    </div>
  );
}
export function Handoff() {
  const { items, ready, notify } = useApp();
  const [region, setRegion] = useState("us");
  const selected = items.filter((i) => i.selected);
  const count = selected.reduce((n, i) => n + i.quantity, 0);
  const list = selected
    .map((i) => {
      const p = products.find((p) => p.id === i.id)!;
      return `${p.name} / ${p.shade} × ${i.quantity}\n${p.url}`;
    })
    .join("\n\n");
  return (
    <div className={s.container}>
      <Breadcrumb>
        <Link href="/selection">妆容清单</Link> / 前往官方商城
      </Breadcrumb>
      <Intro
        eyebrow="CONTINUE WITH THE BRAND"
        title="接下来，前往品牌官方商城。"
        description="你的故事仍在这里。商品价格、库存、支付与售后，由官方商城提供。"
      />
      <Steps current={2} />
      {!ready ? (
        <p>正在读取清单…</p>
      ) : !selected.length ? (
        <div className={s.empty}>
          <h2>清单里还没有选中的产品。</h2>
          <Button href="/selection">返回选择产品 →</Button>
        </div>
      ) : (
        <div className={s.handoff}>
          <section className={s.handoffCard}>
            <h2>确认你的购买地区</h2>
            <label>
              <span className="sr-only">购买地区</span>
              <select
                className={s.region}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="us">美国 · 与当前参考产品一致</option>
                <option value="cn">中国大陆 · 查看当地官方渠道</option>
              </select>
            </label>
            <h3>
              L’ORÉAL PARIS
              <br />
              巴黎欧莱雅官方产品页
            </h3>
            <p>已选 {count} 件。请在官方页面再次核对色号、数量与价格。</p>
            <p>
              {region === "us"
                ? "当前使用官方商品链接，你可以逐件打开产品页选购。清单不会自动加入官方购物车。"
                : "当前图片与色号来自美国官网。中国大陆的在售产品可能不同，请在当地官方渠道确认。"}
            </p>
            {region === "us" ? (
              <div className={s.handoffProducts}>
                {selected.map((i) => {
                  const p = products.find((p) => p.id === i.id)!;
                  return (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        {p.name} · {p.shade} × {i.quantity}
                      </span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <Button
                href="https://www.lorealparis.com.cn/"
                external
                className={s.full}
              >
                前往中国官方渠道 ↗
              </Button>
            )}
            <p className={s.supportNote}>
              链接将在新标签页打开，你可以随时返回本故事。
            </p>
          </section>
          <aside className={s.handoffAside}>
            <h2>随身保留这份灵感</h2>
            <p>不急着购买也没关系。保存清单，等到需要的时候再回来。</p>
            <div className={s.stack}>
              <Button
                secondary
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(list);
                    notify("产品清单已复制");
                  } catch {
                    notify("复制未成功，可使用下方下载清单。");
                  }
                }}
              >
                复制产品清单
              </Button>
              <Button
                secondary
                onClick={() => {
                  const blob = new Blob([list], {
                    type: "text/plain;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "我的妆容清单.txt";
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
              >
                下载产品清单
              </Button>
              <Button secondary href="/selection">
                ← 返回妆容清单
              </Button>
            </div>
          </aside>
        </div>
      )}
      <div className={s.selectionFoot}>
        <h3>没有顺利打开商城？</h3>
        <p>请检查浏览器是否拦截了新窗口，或复制产品链接后重新打开。</p>
      </div>
    </div>
  );
}
