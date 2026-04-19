@AGENTS.md

# NativeGo — CLAUDE.md

このプロダクトは **Goシリーズ** の一員です。  
Goシリーズ共通のデザインシステムは `@takaki/go-design-system` リポで管理されています。

## 絶対に守るルール（最重要）

### 1. UIコンポーネントは必ず @takaki/go-design-system から import する

- ✅ 正しい：`import { Button, Card } from '@takaki/go-design-system'`
- ❌ NG：独自に `components/ui/button.tsx` を作る
- ❌ NG：shadcn/ui CLI で直接コンポーネントを追加する（このプロダクトには不要）

### 2. 必要なコンポーネントがない場合

独自に作らず、以下のいずれかを選ぶ：
- 既存コンポーネントの組み合わせで実現できないか検討
- どうしても必要な場合は、go-design-systemリポに追加する旨を明記して作業を止める

独自実装は絶対にしない。

### 3. デザイントークンの上書き禁止

許可されている上書き：
- `--color-primary`（このプロダクトのブランドカラー）
- `--color-primary-hover`

禁止されている上書き：
- 色（上記以外全て）
- 角丸（`--radius-*`）
- フォントサイズ（`--text-*`）
- 余白（`--space-*`）
- シャドウ（`--shadow-*`）

### 4. className の使用範囲

許可：
- レイアウト（`flex`, `grid`, `gap`, `justify-*`, `items-*`）
- 配置（`margin`, `padding` でトークン値を使う場合）
- レスポンシブ制御（`md:`, `lg:`）

禁止：
- 色の直接指定（`bg-red-500`, `text-blue-600` など）
- 固定値の角丸（`rounded-lg` など、トークン経由で使う）
- 独自のシャドウ
- カスタムフォントサイズ

### 5. アイコンは lucide-react に統一

- ✅ `import { Zap } from 'lucide-react'`
- ❌ 他のアイコンライブラリを追加しない

### 6. レイアウトパターンはテンプレートから派生させる

新規画面を作る時：
- ダッシュボード系 → `DashboardPage` テンプレートから派生
- サイドバー → `AppSidebar` をそのまま使用
- 認証画面 → `LoginPage` テンプレート
- コンセプト画面 → `ConceptPage` テンプレート

ゼロからレイアウトを組まない。

### 7. AppSwitcher の設定

`NativeGoSidebar`（`components/layout/native-go-sidebar.tsx`）の `GO_APPS` 配列でGoシリーズのアプリ一覧を管理しています。

## デザインシステムの更新への追従

```json
// vercel.json
{
  "buildCommand": "npm update @takaki/go-design-system && npm run build"
}
```

ローカル開発時に最新を取りに行きたい場合：

```bash
npm update @takaki/go-design-system
```

## このプロダクト固有のルール

- プロダクト名：`NativeGo`
- プライマリカラー：`#0284C7`（スカイブルー — 声を出す・空に向かって発信する英語アウトプットを体現）
- ドメイン：`native-go.vercel.app`
- 外部連携：Supabase（DB・Auth）、Anthropic API（AI文法・フレーズ解析）

### NativeGo固有のセマンティックカラー（globals.css で定義）

```css
--color-grammar: #5B6AF0;   /* 文法カード */
--color-phrase: #0D9488;    /* フレーズカード */
--color-speaking: #D97706;  /* スピーキング */
--color-shadow: #7C3AED;    /* シャドーイング */
```

これらも上書き禁止ルールと同様に、むやみに変更しない。

### プライマリカラー選定理由

`#0284C7`（Sky Blue 700、hue 204°）を選定した根拠：

1. **コンセプト起点**: NativeGoのコアは「声に出す英語」。空に向かって発信するイメージ = sky blue は英語アウトプットという行為との親和性が高い。警告や危険（赤）でも成功（緑）でもない、前向きな発信を表す。
2. **既存セマンティックカラーとの分離**: grammar(#5B6AF0 藍)・phrase(#0D9488 緑系)・speaking(#D97706 橙)・shadow(#7C3AED 紫) と全て異なる色相域（204°）。視認性の混同なし。
3. **コントラスト比**: ダーク背景(#0f1117)で 5.6:1、ライト背景でボタン白文字 4.5:1 以上。
4. **GoシリーズでのNativeGo固有性**: CareGo(緑)・KenyakuGo(橙)・TaskGo(藍紫)・CookGo(シアン)・PhysicalGo(珊瑚)と異なり、NativeGoが「青空・声・発信」を持つ。

見直し時の基準: 別のGoシリーズとのブランドカラー衝突、またはアクセシビリティ要件が厳格化された場合。

### データモデルの概要

- `grammar` — 文法項目（Native Campのレッスンテキストから抽出、AI生成画像付き）
- `expression` — フレーズ・表現
- `lessons` — Native Campの受講記録
- `speaking_logs` — AIスピーキング練習のログ
- `speaking_scores` — NC AI Speaking Testのスコア記録
- `user_settings` — ベースライン設定（週間目標）

## 作業時の判断基準

1. 新しいUIが必要 → まず `@takaki/go-design-system` に該当コンポーネントがあるか確認
2. ある → それを使う
3. ない → 既存の組み合わせで実現できないか検討
4. それも無理 → 作業を止めて、go-design-system 側への追加を提案

独自実装は最後の手段であり、原則として行わない。

---

## ユーザープロフィール（例文・会話例の文脈として使用）

NativeGoはTakakiの個人利用アプリです。文法・フレーズの例文や会話例を生成する際は、
以下のTakakiの文脈に沿った自然な例文を作成してください。

### 基本情報
- 32歳・日本人男性・独身
- ベトナム・ホーチミン在住（2〜3年）
- プロダクトマネージャー（PM歴3年）
- Sun Asterisk所属・B2B採用プラットフォームとB2C教育LMSの2プロダクトを担当
- チームは約20名（エンジニア・QA・デザイナー・BrSE）

### 日常・ライフスタイル
- ホーチミン市内（District 1〜3エリア）で1人暮らし
- 筋トレを毎日継続中（増量期・体重70kg・目標80kg）
- ベンチプレス・懸垂・スクワット・ルーマニアンデッドなど
- 瞑想を習慣化
- 韓国ドラマをよく見る（Netflix）
- 猫に強い関心あり（British Shorthairを将来飼いたい）
- ホーチミンの猫カフェ（CATFE・KIN NEKO等）に関心
- カフェ巡りが好き（District 1〜3のカフェをよく利用）
- モーターバイク移動が多い
- 以前は登山をしていた（今は離れている）
- 哲学・認知行動療法・AI・プロダクト思考に関心

### 性格・思考スタイル
- MBTI：INTJ
- 分析的・本質思考・プロセス重視
- 「本質構築型PM」と自己定義
- 冒険心がある
- 孤独感を感じることもあるが、Native Campのフリートークで解消している
- 「縦より横」の生き方（結果より過程・プロセス的な生き方）を志向

### 英語学習の文脈
- Native Campで英語会話を毎日練習中
- フリートーク・日常会話コースがメイン
- 目標：グローバルキャリアで使える実用的な英語力

### 例文・会話例を作る際の指針
- 日常の話題を中心に（カフェ・猫・筋トレ・ホーチミンの生活・友達・韓国ドラマ・瞑想・料理・ご飯）
- 仕事・PMの話題も自然に混ぜる（比率は日常7割・仕事3割）
- ホーチミンの地名・文化・生活感を盛り込む（District 3・Nguyen Trai・タオディエン等）
- 自然な会話トーン（堅すぎず、くだけすぎず）
- A/B形式の会話例は3ターン（A→B→A）で構成
