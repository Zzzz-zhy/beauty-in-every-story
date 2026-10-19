"use client";
import { Button, s } from "@/components/ui";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className={`${s.container} ${s.empty}`}>
      <h1>页面暂时没有加载成功。</h1>
      <p>请检查网络连接，然后重试。你的清单仍保存在这台设备上。</p>
      <div className={s.buttonRow}>
        <Button onClick={reset}>重新尝试</Button>
        <Button href="/stories" secondary>
          返回故事展览
        </Button>
      </div>
    </div>
  );
}
