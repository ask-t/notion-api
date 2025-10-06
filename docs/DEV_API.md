# 🔧 開発用API ガイド

開発・テスト用の認証不要エンドポイントです。トークンとページIDがハードコードされています。

**⚠️ 重要**: 本番環境では使用しないでください。

---

## ハードコードされた認証情報

```typescript
NOTION_API_KEY: secret_LSj6NUeRXVHJSB1oyIR0uy7zPYlIEIhgoHnBo2bmvtE
DEFAULT_PAGE_ID: 284d7fb8403e80c5b878f651bbbd127b
```

---

## 💡 重要な機能

### 動的プロパティ設定

`add-sentence`エンドポイントは、データベースの構造を自動的に取得し、**存在するプロパティのみ設定**します。

**仕組み**:
1. データベースIDからプロパティ一覧を取得
2. 存在するプロパティのみをリクエストに含める
3. 存在しないプロパティは自動でスキップ

**メリット**:
- ✅ 自分好みにNotionデータベースをカスタマイズできる
- ✅ プロパティの追加・削除が自由
- ✅ 「習得度」などのプロパティがなくてもエラーにならない

**例**:

```typescript
// あなたのデータベース構造
properties: {
  "センテンス": { type: "title" },    // ✅ 必須（タイトル）
  "カテゴリ": { type: "select" },     // ✅ あれば設定される
  "難易度": { type: "rich_text" }     // ✅ あれば設定される
  // "習得度" プロパティなし → スキップ（エラーなし）
}
```

---

## エンドポイント一覧

### 1. データベース作成

```
POST /dev-notion/create-sentence-database
```

日本語センテンス学習用のデータベースを作成します。認証ヘッダーやページIDは不要です。

#### リクエスト例

```bash
curl -X POST "http://localhost:3001/dev-notion/create-sentence-database" \
  -H "Content-Type: application/json"
```

#### レスポンス例

```json
{
  "message": "✅ データベース「日本語→英語 センテンス学習」を作成しました",
  "databaseId": "284d7fb8403e801ca085fb7e9fdaf538"
}
```

返された `databaseId` を次のステップで使用します。

---

### 2. テンプレートページを作成

```
POST /dev-notion/create-template-pages
```

サンプルのセンテンス（日常会話・ビジネス・旅行）を3件、**通常のページ**として作成します。
これらのページを元に、Notion上で自分でデータベースを設定できます。

#### リクエスト例

```bash
curl -X POST "http://localhost:3001/dev-notion/create-template-pages" \
  -H "Content-Type: application/json"
```

#### レスポンス例

```json
{
  "message": "✅ 空のテンプレートページを 3 件作成しました（Notionでデータベースに変換してください）"
}
```

#### 作成される空のテンプレートページ

1. **テンプレート 1**（空）
2. **テンプレート 2**（空）
3. **テンプレート 3**（空）

各ページには以下のブロック構造が含まれています（内容は空）：
- 📝 英訳（Callout - blue）
- 🔑 重要表現（Toggle）
- 📚 文法ポイント（Toggle）
- 💡 類似表現（Callout - yellow）
- 🎯 使用場面（Callout - gray）
- ⚠️ 注意点（Callout - red）
- ✏️ 自由記述（Callout - yellow）

#### Notionでの設定方法

1. テンプレートページが作成されたら、Notionでそのページを開く
2. 3つのページを選択して「Turn into database」または「データベースに変換」
3. データベースビューを選択（Table、Gallery、Listなど）
4. プロパティ（カテゴリ、難易度、習得度など）を自由に追加

---

### 3. センテンスを追加

```
POST /dev-notion/add-sentence/:databaseId
```

日本語センテンスを英訳・分析してNotionに追加します。

#### リクエスト例

```bash
curl -X POST "http://localhost:3001/dev-notion/add-sentence/YOUR_DATABASE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "センテンス": "明日は早く起きるつもりです",
    "英訳": "I'\''m going to wake up early tomorrow.\nI plan to wake up early tomorrow.",
    "重要表現": "be going to（〜するつもり）: 意図や予定を表す\nwake up（目を覚ます）",
    "文法ポイント": "be going to + 動詞の原形：近い未来の予定や意図を表す表現",
    "類似表現": "I will wake up early tomorrow（よりシンプルな未来形）",
    "使用場面": "カジュアル・日常会話",
    "注意点": "wake up と get up の違いに注意",
    "難易度": "A2（英検4〜3級レベル）",
    "カテゴリ": "日常会話"
  }'
```

#### レスポンス例

```json
{
  "message": "✅ '明日は早く起きるつもりです' をNotionに追加しました。"
}
```

---

### 4. 英単語を追加

```
POST /dev-notion/add-word/:databaseId
```

英単語をNotionデータベースに追加します。

#### リクエスト例

```bash
curl -X POST "http://localhost:3001/dev-notion/add-word/YOUR_DATABASE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "word": "punctual",
    "意味": "時間を守る、時間に正確な",
    "語源": "ラテン語 punctum（点）に由来",
    "collocation": "punctual person, punctual arrival, be punctual",
    "例文": "She is always punctual for meetings.\n彼女はいつも会議に時間通りに来ます。",
    "類似表現": "on time, prompt, timely",
    "頻出度": "🥈超使える",
    "難易度": "B1（英検準2〜2級レベル）",
    "イメージ検索": "https://www.google.com/search?tbm=isch&q=punctual"
  }'
```

#### レスポンス例

```json
{
  "message": "✅ 'punctual' added to Notion."
}
```

---

## 使い方の流れ

### 推奨フロー（テンプレートページから開始）

#### Step 1: テンプレートページを作成

```bash
# サンプルページ3件を通常のページとして作成
curl -X POST "http://localhost:3001/dev-notion/create-template-pages" \
  -H "Content-Type: application/json"
```

→ ハードコードされたページID配下に3つのページが作成されます

#### Step 2: Notionでデータベースに変換

1. Notionでページを開く
2. 3つのページを選択
3. 右クリックまたはメニューから「データベースに変換」
4. お好みのビュー（Table、Gallery、Listなど）を選択
5. プロパティ（カテゴリ、難易度、習得度など）を追加

#### Step 3: データベースIDを取得

データベースのURLからIDをコピー：
```
https://www.notion.so/[workspace]/[database-id]?v=...
```

#### Step 4: センテンスを追加

```bash
# 独自のセンテンスをデータベースに追加
curl -X POST "http://localhost:3001/dev-notion/add-sentence/YOUR_DATABASE_ID" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

### 代替フロー（データベースから開始）

#### Step 1: データベースを作成

```bash
# センテンス学習用データベースを自動作成
curl -X POST "http://localhost:3001/dev-notion/create-sentence-database"
```

→ `databaseId` をコピー

#### Step 2: センテンスを追加

```bash
# センテンスをデータベースに追加
curl -X POST "http://localhost:3001/dev-notion/add-sentence/YOUR_DATABASE_ID" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## Swagger UIでテスト

Swagger UIを使うとより簡単にテストできます：

```
http://localhost:3001/api
```

1. **dev-notion** セクションを展開
2. エンドポイントを選択
3. **Try it out** をクリック
4. リクエストボディを入力
5. **Execute** をクリック

---

## 通常のAPIとの違い

| 項目 | 通常のAPI (`/notion`) | 開発用API (`/dev-notion`) |
|------|---------------------|------------------------|
| 認証ヘッダー | 必須 | 不要（ハードコード済み） |
| ページID | パラメータで指定 | ハードコード済み |
| 用途 | 本番環境 | 開発・テスト |

---

## セキュリティ上の注意

1. **本番環境では使用禁止**: このエンドポイントは開発・テスト専用です
2. **認証情報の露出**: APIキーがコードにハードコードされています
3. **アクセス制限**: 本番デプロイ時は `/dev-notion` を無効化することを推奨

---

## トラブルシューティング

### エラー: "Failed to create sentence database"

**原因**: ページIDが無効、またはIntegrationがページにアクセスできない

**対策**:
1. ページID `284d7fb8403e80c5b878f651bbbd127b` が存在するか確認
2. IntegrationがそのページにConnectionされているか確認

### エラー: "Failed to add sentence to Notion"

**原因**: データベースIDが無効、またはプロパティが一致していない

**対策**:
1. `create-sentence-database` で正しくデータベースが作成されたか確認
2. 返された `databaseId` を正しく使用しているか確認

---

## 次のステップ

- [センテンスプロンプト](./SENTENCE_PROMPT.md) - ChatGPT連携
- [API仕様](./API.md) - 通常のAPI仕様
- [トラブルシューティング](./TROUBLESHOOTING.md) - 問題解決ガイド

