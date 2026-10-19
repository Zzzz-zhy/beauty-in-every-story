import s from "@/components/ui.module.css";
import Image from "next/image";
import { Button, Photo, Reveal } from "@/components/ui";
export default function Home() {
  return (
    <>
      <section className={s.officialHero}>
        <Image
          src="/images/official-hero.png"
          fill
          alt="欧莱雅集团品牌形象"
          preload
          sizes="100vw"
        />
        <div className={s.container}>
          <div className={s.officialHeroCopy}>
            <h1>
              创造美，
              <br />
              让世界为之所动。
            </h1>
            <Button href="https://www.loreal.com/en/" external>
              Discover L’Oréal Groupe ↗
            </Button>
          </div>
        </div>
      </section>
      <div className={s.container}>
        <section className={s.homeIntro}>
          <p className={s.eyebrow}>我们的美丽故事</p>
          <h2>每一种美，都值得被听见。</h2>
          <div className={s.homeFeature}>
            <Reveal>
              <p className={s.eyebrow}>BEAUTY IN EVERY STORY</p>
              <h2>
                从一段音乐开始，
                <br />
                听见她选择表达的自己。
              </h2>
              <p>
                走进音乐与妆容的故事展览。听视障女性讲述灵感、感受与独属于自己的美。
              </p>
              <div className={s.stack}>
                <Button href="/stories">走进故事展览 →</Button>
                <Button href="/impact" secondary>
                  了解项目
                </Button>
              </div>
            </Reveal>
            <Reveal>
              <Photo
                src="/images/photo-03.png"
                alt="AI示意：双手探索化妆刷，桌上放着耳机与带触觉标记的物品"
                ratio="710 / 430"
                className={`${s.rounded} ${s.shadow}`}
              />
              <p className={s.caption}>AI 生成视觉示意 · 非真实参与者记录</p>
            </Reveal>
          </div>
        </section>
        <div className={s.impactStrip}>
          <div>
            <h2>美，从每个人的表达开始</h2>
            <p className={s.meta}>探索欧莱雅的美妆科技与多元包容承诺。</p>
          </div>
          <Button href="/impact" secondary>
            了解公益联动计划 →
          </Button>
        </div>
      </div>
    </>
  );
}
