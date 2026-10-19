import s from "@/components/ui.module.css";
export default function Loading() {
  return (
    <div className={`${s.container} ${s.loading}`} role="status">
      <p className={s.eyebrow}>正在打开故事…</p>
      <div className={s.skeleton} />
      <div className={s.skeleton} style={{ width: "65%" }} />
    </div>
  );
}
