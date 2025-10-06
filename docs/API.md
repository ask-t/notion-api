# 📝 API リファレンス

Notion API連携サーバーのエンドポイント一覧です。

## ベースURL

```
http://localhost:3001
```

---

## 認証

すべてのエンドポイントは、Notion API キーによる認証が必要です。

### ヘッダー

```
Authorization: Bearer YOUR_NOTION_API_KEY
Content-Type: application/json
```

---

## 📚 目次

- [英単語学習](#英単語学習)
  - [POST /notion/add-word/:databaseId](#post-notionadd-worddatabaseid)
- [センテンス学習](#センテンス学習)
  - [POST /notion/create-sentence-database/:pageId](#post-notioncreate-sentence-databasepageid)
  - [POST /notion/add-sentence/:databaseId](#post-notionadd-sentencedatabaseid)

---

## 英単語学習

### `POST /notion/add-word/:databaseId`

単語をNotionデータベースに追加します。

#### パラメータ

| パラメータ | 場所 | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `databaseId` | Path | string | ✅ | NotionデータベースのID |
| `Authorization` | Header | string | ✅ | `Bearer YOUR_API_KEY` |

#### リクエストボディ

```json
{
  "word": "string",           // ✅ 必須: 単語
  "頻出度": "string",         // 任意: 🔺あまり使わない / 🥉使える / 🥈超使える / 🥇目から鱗
  "難易度": "string",         // 任意: 例: A1, B2（英検準2級）
  "意味": "string",           // 任意: 日本語の意味
  "語源": "string",           // 任意: 語源の説明
  "collocation": "string",    // 任意: コロケーション（カンマ区切り）
  "例文": "string",           // 任意: 例文（複数行可、\nで区切る）
  "イメージ検索": "string",   // 任意: Google画像検索のURL
  "類似表現": "string"        // 任意: 類似表現の説明
}
```

#### リクエスト例

**基本的な使用例:**

```bash
curl -X POST http://localhost:3001/notion/add-word/284d7fb8403e801ca085fb7e9fdaf538 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret_xxxxxxxxxxxx" \
  -d '{
    "word": "punctual",
    "頻出度": "🥈超使える",
    "難易度": "B1（英検準2〜2級レベル）",
    "意味": "時間を守る、時間に正確な",
    "語源": "ラテン語 punctum（点）に由来し、時間の「正確さ」を示す意味が転じた",
    "collocation": "punctual person, punctual arrival, punctual employee",
    "例文": "She is always punctual for meetings.\n彼女はいつも会議に時間通りに来ます。",
    "イメージ検索": "https://www.google.com/search?tbm=isch&q=punctual",
    "類似表現": "on time（時間通り）、prompt（即座の）、timely（適時の）"
  }'
```

**最小限の例（wordのみ）:**

```bash
curl -X POST http://localhost:3001/notion/add-word/YOUR_DATABASE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "word": "hello"
  }'
```

#### レスポンス

```json
{
  "message": "✅ 'punctual' added to Notion."
}
```

---

## 作成されるページ構造（英単語）

APIで単語を追加すると、以下のような構造でNotionページが作成されます：

### プロパティ

| プロパティ | 型 | 値 |
|---|---|---|
| Vocabulary | Title | 単語名 |
| 習得度 | Status | "インプット中"（デフォルト） |
| 頻出度 | Select | リクエストで指定された値 |
| 難易度 | Rich Text | リクエストで指定された値 |
| 作成日 | Created Time | 自動設定 |
| 更新日 | Last Edited Time | 自動設定 |

### ページコンテンツ

ページ内には以下のブロックが自動的に作成されます：

1. **Callout（頻出度）** - 🗣 アイコン、灰色背景
2. **Toggle（意味）** - 青色太字タイトル
3. **Toggle（語源）** - 青色太字タイトル
4. **Callout（コロケーション）** - 📎 アイコン、青色背景
   - 内部にコロケーションのリスト
5. **Callout（例文）** - 📎 アイコン、青色背景
   - 内部に例文（複数行）
6. **Callout（イメージ）** - 🖼️ アイコン、黄色背景
   - Google画像検索へのリンク
7. **Callout（自由記述）** - ✏️ アイコン、黄色背景
   - 類似表現など

---

## センテンス学習

### `POST /notion/create-sentence-database/:pageId`

日本語センテンス学習用のデータベースを作成します。

#### パラメータ

| パラメータ | 場所 | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `pageId` | Path | string | ✅ | 親ページのID（データベースを作成する場所） |
| `Authorization` | Header | string | ✅ | `Bearer YOUR_API_KEY` |

#### リクエスト例

```bash
curl -X POST http://localhost:3001/notion/create-sentence-database/284d7fb8403e80c5b878f651bbbd127b \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret_xxxxxxxxxxxx"
```

#### レスポンス

**成功時（200 OK）:**

```json
{
  "message": "✅ データベース「日本語→英語 センテンス学習」を作成しました",
  "databaseId": "284d7fb8403e801ca085fb7e9fdaf538"
}
```

#### 作成されるデータベース構造

| プロパティ | 型 | 説明 |
|---|---|---|
| センテンス | Title | 日本語のセンテンス（タイトル） |
| 習得度 | Status | インプット中 / 練習中 / 習得済み |
| 難易度 | Rich Text | A1〜C2レベル表記 |
| カテゴリ | Select | 日常会話 / ビジネス / 旅行 / アカデミック / その他 |
| 追加日 | Created Time | 自動設定 |

---

### `POST /notion/add-sentence/:databaseId`

日本語センテンスを英訳・分析してNotionデータベースに追加します。

#### 💡 動的プロパティ設定

このエンドポイントは、データベースの構造を自動的に取得し、**存在するプロパティのみ設定**します。

**仕組み:**
1. データベースIDからプロパティ一覧を取得
2. 存在するプロパティのみをリクエストに含める
3. 存在しないプロパティは自動でスキップ

**メリット:**
- ✅ 自分好みにデータベースをカスタマイズできる
- ✅ プロパティの追加・削除が自由
- ✅ 「習得度」などのプロパティがなくてもエラーにならない

#### パラメータ

| パラメータ | 場所 | 型 | 必須 | 説明 |
|---|---|---|---|---|
| `databaseId` | Path | string | ✅ | NotionデータベースのID |
| `Authorization` | Header | string | ✅ | `Bearer YOUR_API_KEY` |

#### リクエストボディ

```json
{
  "センテンス": "string",       // ✅ 必須: 日本語のセンテンス
  "英訳": "string",             // ✅ 必須: 英語訳（複数可、\nで区切る）
  "重要表現": "string",         // ✅ 必須: キーフレーズと説明
  "文法ポイント": "string",     // ✅ 必須: 文法の説明
  "類似表現": "string",         // ✅ 必須: 類似した英語表現
  "使用場面": "string",         // ✅ 必須: 使用シーン
  "注意点": "string",           // ✅ 必須: 注意すべきポイント
  "難易度": "string",           // 任意: 例: A2（英検4〜3級レベル）
  "カテゴリ": "string"          // 任意: 日常会話 / ビジネス / 旅行 など
}
```

#### リクエスト例

```bash
curl -X POST http://localhost:3001/notion/add-sentence/284d7fb8403e801ca085fb7e9fdaf538 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret_xxxxxxxxxxxx" \
  -d '{
    "センテンス": "明日は早く起きるつもりです",
    "英訳": "I'\''m going to wake up early tomorrow.\nI plan to wake up early tomorrow.\nI intend to get up early tomorrow morning.",
    "重要表現": "be going to（〜するつもり）: 意図や予定を表す\nwake up（目を覚ます）: 自動詞として使用\nget up（起きる）: ベッドから出る動作",
    "文法ポイント": "be going to + 動詞の原形：近い未来の予定や意図を表す表現。will よりも計画性のあるニュアンス",
    "類似表現": "I will wake up early tomorrow（よりシンプルな未来形）\nI'\''m planning to wake up early tomorrow（planningで計画性を強調）",
    "使用場面": "カジュアル・日常会話。友人や家族との会話で自然に使える表現",
    "注意点": "wake up と get up の違いに注意。wake upは「目が覚める」、get upは「ベッドから起き上がる」という違いがある",
    "難易度": "A2（英検4〜3級レベル）",
    "カテゴリ": "日常会話"
  }'
```

#### レスポンス

```json
{
  "message": "✅ '明日は早く起きるつもりです' をNotionに追加しました。"
}
```

---

## 作成されるページ構造（センテンス）

APIでセンテンスを追加すると、以下のような構造でNotionページが作成されます：

### プロパティ（動的設定）

| プロパティ | 型 | 設定条件 |
|---|---|---|
| センテンス | Title | 必ず設定される |
| 習得度 | Status | データベースに存在する場合のみ |
| カテゴリ | Select | データベースに存在し、リクエストに含まれる場合のみ |
| 難易度 | Rich Text | データベースに存在し、リクエストに含まれる場合のみ |
| 追加日 | Created Time | 自動設定 |

### ページコンテンツ

ページ内には以下のブロックが自動的に作成されます：

1. **Callout（英訳）** - 📝 アイコン、青色背景
   - 複数の英訳パターン
2. **Toggle（重要表現）** - 青色太字タイトル
   - キーフレーズとその説明
3. **Toggle（文法ポイント）** - 青色太字タイトル
   - 使用されている文法の解説
4. **Callout（類似表現）** - 💡 アイコン、黄色背景
   - 別の言い回しとニュアンスの違い
5. **Callout（使用場面）** - 🎯 アイコン、灰色背景
   - どのような状況で使うか
6. **Callout（注意点）** - ⚠️ アイコン、赤色背景
   - 間違えやすいポイント
7. **Callout（自由記述）** - ✏️ アイコン、黄色背景
   - 自分用のメモ欄

---

## 使用例

### iPhone ショートカットとの連携

#### 英単語学習

```
[ショートカット: 単語を学ぶ]
  ↓
1. 単語を入力 or テキストを選択
  ↓
2. ChatGPT APIで詳細情報を取得
  ↓
3. このAPIで Notionに追加
  ↓
4. 完了通知
```

詳細は [英単語プロンプト](./CHATGPT_PROMPT.md) を参照してください。

#### センテンス学習

```
[ショートカット: センテンスを学ぶ]
  ↓
1. 日本語文を入力 or テキストを選択
  ↓
2. ChatGPT APIで英訳と分析を取得
  ↓
3. このAPIで Notionに追加
  ↓
4. 完了通知
```

詳細は [センテンスプロンプト](./SENTENCE_PROMPT.md) を参照してください。

---

## Swagger UI

APIドキュメントは Swagger UI で確認できます：

```
http://localhost:3001/api
```

Swagger UIでは：
- ✅ インタラクティブなAPIテスト
- ✅ リクエスト/レスポンスの例
- ✅ スキーマの確認

が可能です。

---

## 次のステップ

### 詳細なガイド

- [英単語プロンプト](./CHATGPT_PROMPT.md) - 英単語学習用ChatGPTプロンプト
- [センテンスプロンプト](./SENTENCE_PROMPT.md) - センテンス学習用ChatGPTプロンプト
- [開発用API](./DEV_API.md) - 認証不要のテスト用エンドポイント
- [トラブルシューティング](./TROUBLESHOOTING.md) - 問題解決ガイド

### 便利な機能

**動的プロパティ設定**: `add-sentence`エンドポイントは、データベース構造を自動検出し、存在するプロパティのみ設定します。これにより、自分好みにカスタマイズしたデータベースでもエラーなく使用できます。

**テンプレートページ**: 開発用APIの`create-template-pages`を使用すると、空のテンプレートページを作成し、Notion上で自由にカスタマイズしてからデータベースに変換できます。

