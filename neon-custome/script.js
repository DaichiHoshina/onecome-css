const app = Vue.createApp({
  setup() {
    document.body.removeAttribute("hidden");
  },
  data() {
    return {
      comments: [],
    };
  },
  methods: {
    getClassName(comment) {
      if (comment.commentIndex % 2 === 0) {
        return "comment even";
      }
      return "comment odd";
    },
    getStyle(comment) {
      if (comment.data.colors) {
        const bgColor = comment.data.colors.bodyBackgroundColor;
        const style = {
          // スパチャでもガラスUI風に統一
          "--lcv-background-color": "rgba(40, 40, 45, 0.7)", // 通常より少し濃く
          "--lcv-text-color": "rgba(255, 255, 255, 0.95)", // 白文字で統一
          "--lcv-name-color": "rgba(255, 255, 255, 0.85)", // ユーザー名も白
          // スパチャ用のネオン効果（スパチャカラーを使う）
          "--lcv-neon-shadow": `0 0 3px #fff, 0 0 6px ${bgColor}, 0 0 9px ${bgColor}`,
          "--lcv-box-shadow": `0 8px 32px 0 rgba(0, 0, 0, 0.37),
          0 0 6px ${bgColor},
          inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
          // ガラスUI効果は維持（CSSで定義済み）
        };
        return style;
      }
    },
  },
  mounted() {
    let cache = new Map();
    commentIndex = 0;
    OneSDK.setup({
      permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    });
    OneSDK.subscribe({
      action: "comments",
      callback: (comments) => {
        const newCache = new Map();
        comments.forEach((comment) => {
          const index = cache.get(comment.data.id);
          if (isNaN(index)) {
            comment.commentIndex = commentIndex;
            newCache.set(comment.data.id, commentIndex);
            ++commentIndex;
          } else {
            comment.commentIndex = index;
            newCache.set(comment.data.id, index);
          }
        });
        cache = newCache;
        this.comments = comments;
      },
    });
    OneSDK.connect();
  },
});
app.component("one-marquee", window.OneMarquee());
OneSDK.ready().then(() => {
  app.mount("#container");
});
