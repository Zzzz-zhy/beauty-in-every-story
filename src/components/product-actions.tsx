"use client";
import { type Product } from "@/lib/content";
import { useApp } from "./providers";
import { Button, s } from "./ui";
export function ProductActions({
  product,
  storyId,
}: {
  product: Product;
  storyId: string | null;
}) {
  const { add, items, ready, setSelectionStoryId } = useApp();
  const added = ready && items.some((i) => i.id === product.id && i.selected);
  return (
    <>
      <h2>选择色号</h2>
      <div className={s.optionRow}>
        <button className={s.chip} aria-pressed="true">
          ✓ {product.shade}
        </button>
        <Button href={product.url} external secondary>
          其他色号 ↗
        </Button>
      </div>
      <p className={s.productNote}>
        商品图与色号参考美国官网；地区售价和库存以商城为准。
      </p>
      <div className={s.stack}>
        <Button href={product.url} external>
          前往官方产品页 ↗
        </Button>
        <Button
          secondary
          disabled={!ready}
          onClick={() => {
            setSelectionStoryId(storyId);
            add(product.id);
          }}
        >
          {added ? "✓ 已加入妆容清单" : "加入妆容清单"}
        </Button>
        {added && (
          <Button secondary href="/selection">
            查看妆容清单 →
          </Button>
        )}
      </div>
    </>
  );
}
