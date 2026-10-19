import { Suspense } from "react";
import { Gallery } from "@/components/gallery";
export const metadata = { title: "故事展览" };
export default function Stories() {
  return (
    <Suspense fallback={<p style={{ padding: 80 }}>正在布置展览…</p>}>
      <Gallery />
    </Suspense>
  );
}
