export type Story = {
  id: string;
  title: string;
  mood: string;
  music: string;
  quote: string;
  author: string;
  cover: string;
  image: string;
  thumbnail: string;
  inspiration: string;
  makeup: string;
  look: string;
};
const entries = [
  [
    "gentle-strength",
    "温柔，也有自己的力量",
    "温柔",
    "钢琴",
    "我想把那段安静的旋律，变成每天都可以拥有的勇气。",
    "林女士",
    "我想要的，是一种安静的坚定。",
    "钢琴的声音让我想到一个不用急着解释自己的下午。妆容保留肌肤自然的质感，用柔和的玫瑰棕色呼应旋律的温暖，让唇部成为表达的重点。",
    "温柔玫瑰 · 温暖而不张扬",
    "底妆轻薄，保留自然肌理；眼部以浅棕轻轻加深轮廓；双颊带一点暖意；柔和的唇色让整体更温暖。",
  ],
  [
    "time-to-shine",
    "今天，轮到我闪耀",
    "明亮",
    "流行",
    "我希望别人先听到我的笑声，再看到我的唇色。",
    "陈女士",
    "把每一个普通日子，过成自己的舞台。",
    "轻快的节拍带来向前的能量。明亮的色彩呼应旋律中跳跃的音符，让笑容成为妆容的中心。",
    "明亮珊瑚 · 轻盈而有活力",
    "清透底妆搭配珊瑚色双颊，眼角点缀细腻光泽，唇部使用明快的暖色。",
  ],
  [
    "color-of-freedom",
    "把自由，画成我的颜色",
    "自由",
    "爵士",
    "这一次，我想尝试不一样的自己。",
    "周女士",
    "留一点即兴，也留一点可能。",
    "爵士乐里自由的停顿，让我想到表达可以没有标准答案。大胆的色彩，与轻盈的肌理一起出现。",
    "自由蓝调 · 色彩与留白",
    "眼部以蓝紫色作点缀，保留自然肤色，柔和唇色与鲜明眼妆形成平衡。",
  ],
  [
    "unfold-your-edge",
    "不必收起我的锋芒",
    "勇敢",
    "摇滚",
    "我的声音，可以再大一点。",
    "许女士",
    "温柔和锋芒，都属于我。",
    "鼓点让我感到坚定。这个妆容用清晰的眼线与浓郁唇色，表达无需隐藏的自己。",
    "赤色宣言 · 清晰而坚定",
    "利落眼线勾勒轮廓，哑光红唇成为视觉重点，底妆轻薄自然。",
  ],
  [
    "romance-for-me",
    "留一点浪漫给自己",
    "浪漫",
    "弦乐",
    "不为某个特别的日子，只为今天的我。",
    "何女士",
    "把小小的心动，留在日常里。",
    "弦乐像一封慢慢展开的信。玫瑰色调回应温柔而绵长的情绪。",
    "玫瑰诗篇 · 柔和与光泽",
    "玫瑰色眼影和唇色相互呼应，双颊轻轻晕染，保留肌肤的自然光泽。",
  ],
  [
    "my-own-rhythm",
    "属于我的节奏",
    "自信",
    "爵士",
    "我不必跟上谁，我有自己的拍子。",
    "王女士",
    "按照自己的节奏，慢慢发光。",
    "低音与节拍让我放松。温暖的大地色与深色唇妆，表达不需要解释的自信。",
    "暖调爵士 · 从容而饱满",
    "棕金色眼妆柔和晕染，深玫瑰色唇部搭配自然底妆，轮廓清晰而不厚重。",
  ],
  [
    "slow-is-beautiful",
    "慢下来，也很好",
    "平静",
    "民谣",
    "听见风的时候，也听见了自己。",
    "赵女士",
    "给自己一个深呼吸的时间。",
    "木吉他的声音像清晨的空气。妆容选择低饱和色彩，保留自己的自然状态。",
    "雾感清晨 · 轻柔而纯净",
    "清透肌肤、灰棕色眼妆与淡淡唇色，整体柔和，不刻意强调修饰。",
  ],
  [
    "let-joy-speak",
    "让快乐先开口",
    "喜悦",
    "节奏",
    "我想把开心，放在最显眼的地方。",
    "孙女士",
    "让今天，有一点亮丽的不同。",
    "活泼的节奏让我想要跳舞。明亮的橙粉色像阳光，带来轻松的好心情。",
    "日光橙粉 · 自由而明快",
    "橙粉色腮红与唇色呼应，细腻的眼部光泽点亮表情，轻薄底妆让肌肤自在呼吸。",
  ],
];
export const stories: Story[] = entries.map((s, i) => ({
  id: s[0],
  title: s[1],
  mood: s[2],
  music: s[3],
  quote: s[4],
  author: s[5],
  inspiration: s[6],
  makeup: s[7],
  look: s[8],
  cover: `/images/story-${String(i + 1).padStart(2, "0")}.png`,
  image:
    i === 0
      ? "/images/photo-02.png"
      : `/images/story-${String(i + 1).padStart(2, "0")}.png`,
  thumbnail:
    i === 0
      ? "/images/photo-06.png"
      : `/images/story-${String(i + 1).padStart(2, "0")}.png`,
  description: s[9],
}));
export const descriptions: Record<string, string> = Object.fromEntries(
  entries.map((s) => [s[0], s[9]]),
);
export type Product = {
  id: string;
  name: string;
  shade: string;
  image: string;
  url: string;
  description: string;
};
export const products: Product[] = [
  {
    id: "colour-riche",
    name: "Colour Riche 缎光唇膏",
    shade: "840 Nature’s Blush",
    image: "/images/lipstick.png",
    url: "https://www.lorealparisusa.com/makeup/lip-color/lipstick/colour-riche-lipcolour-natures-blush-840",
    description: "一抹缎光，为表达加一点温度。",
  },
  {
    id: "true-match-foundation",
    name: "True Match 粉底液",
    shade: "C1 Alabaster Cool",
    image: "/images/foundation.png",
    url: "https://www.lorealparisusa.com/makeup/face/foundation-makeup/true-match-super-blendable-makeup-c1-alabaster-cool",
    description: "轻薄的底妆，保留肌肤本来的质感。",
  },
  {
    id: "true-match-blush",
    name: "True Match 腮红",
    shade: "N7–8 Sweet Ginger",
    image: "/images/blush.png",
    url: "https://www.lorealparisusa.com/Makeup/Face/Blush/True-Match-Blush",
    description: "让双颊的暖意，自然流露。",
  },
];
export const storyRepository = {
  all: () => stories,
  find: (id: string) => stories.find((s) => s.id === id),
};
export const productRepository = {
  all: () => products,
  find: (id: string) => products.find((p) => p.id === id),
};
