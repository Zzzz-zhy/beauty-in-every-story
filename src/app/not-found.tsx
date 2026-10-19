import s from "@/components/ui.module.css";
import { Intro, Breadcrumb, Button } from "@/components/ui";
export default function NotFound() {
  return (
    <div className={s.container}>
      <Breadcrumb>故事展览 / 故事状态</Breadcrumb>
      <div className={s.empty}>
        <Intro
          eyebrow="STORY UNAVAILABLE"
          title="这个故事，暂时无法打开。"
          description="作者可能调整了分享范围，或这个链接已失效。每位参与者都可以决定自己的故事如何被分享。你仍然可以探索展览中的其他故事。"
        />
        <Button href="/stories">探索其他故事 →</Button>
      </div>
    </div>
  );
}
