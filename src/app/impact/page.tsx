import s from "@/components/ui.module.css";
import { Intro, Breadcrumb, Photo, Button, Reveal } from "@/components/ui";
export const metadata = { title: "公益联动计划" };
export default function Impact() {
  return (
    <div className={s.container}>
      <Breadcrumb>每一种美 / 公益联动计划</Breadcrumb>
      <Intro
        eyebrow="BEAUTY WITH PURPOSE"
        title="让表达的机会，来到更多人身边。"
        description="美可以被看见，也应该被听见。我们希望让视障女性拥有更多自主表达与体验的机会。"
      />
      <aside className={s.callout}>
        <h2>公益联动方案筹备中 · 尚未生效</h2>
        <p>以下为拟议方案，正式项目、比例及执行规则将由品牌公布。</p>
      </aside>
      <section className={s.impactHero}>
        <figure>
          <Photo
            src="/images/photo-04.png"
            alt="AI示意：顾问与女性一起探索化妆刷，在平等交流中了解体验偏好"
            ratio="645 / 480"
          />
          <figcaption className={s.caption}>
            AI 生成场景示意 · 非真实活动记录
          </figcaption>
        </figure>
        <Reveal>
          <h2>
            支持她的选择，
            <br />
            而不是替她定义美。
          </h2>
          <p>
            拟支持无障碍美妆体验、顾问培训，以及视障女性的自主表达机会。项目将与专业合作机构共同制定。
          </p>
        </Reveal>
      </section>
      <div style={{ marginTop: 90 }}>
        <h2>每一份支持，都应该有清晰的去向。</h2>
        <div className={s.impactColumns}>
          {[
            [
              "01 / 适用范围",
              "参与商品与活动周期",
              "以正式公布的活动商品、地区与时间为准。",
            ],
            [
              "02 / 支持方式",
              "从活动商品销售利润中划拨",
              "具体比例、利润口径及退款处理规则待公布。",
            ],
            [
              "03 / 公开进展",
              "持续披露项目进展",
              "合作机构、资金使用与项目成果将在正式启动后公开。",
            ],
          ].map(([label, title, body]) => (
            <Reveal key={label}>
              <p className={s.eyebrow}>{label}</p>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
        <p className={s.description}>
          目前无需捐款，也不会在选购时额外收取费用。你可以先了解故事与项目，等待正式计划公布。
        </p>
        <div className={s.buttonRow}>
          <Button href="/stories">回到故事展览 →</Button>
        </div>
      </div>
    </div>
  );
}
