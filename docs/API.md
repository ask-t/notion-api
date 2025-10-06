# 📝 API リファレンス

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

## エンドポイント

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

**成功時（200 OK）:**

```json
{
  "message": "✅ 'punctual' added to Notion."
}
```

**エラー（400 Bad Request）:**

```json
{
  "statusCode": 400,
  "message": "Missing required Notion headers.",
  "error": "Bad Request"
}
```

**エラー（500 Internal Server Error）:**

```json
{
  "statusCode": 500,
  "message": "Failed to add word to Notion.",
  "error": "Internal Server Error"
}
```

---

## 作成されるページ構造

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

## 使用例

### iPhone ショートカットとの連携

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

詳細は [ChatGPTプロンプト](./CHATGPT_PROMPT.md) を参照してください。

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

## レート制限

現在、このAPIにはレート制限はありません。ただし、Notion APIには以下の制限があります：

- **平均**: 3リクエスト/秒
- **バースト**: 最大300リクエスト（60秒間）

大量のデータを追加する場合は、適切な間隔を空けることを推奨します。

---

## エラーコード一覧

| コード | 説明 | 原因 |
|---|---|---|
| 400 | Bad Request | APIキーまたはデータベースIDが不足 |
| 401 | Unauthorized | APIキーが無効 |
| 403 | Forbidden | Integrationに権限がない |
| 404 | Not Found | データベースが見つからない |
| 429 | Too Many Requests | レート制限超過 |
| 500 | Internal Server Error | サーバー内部エラー |

---

## 次のステップ

- [ChatGPTプロンプト](./CHATGPT_PROMPT.md) - AIと連携した使い方
- [トラブルシューティング](./TROUBLESHOOTING.md) - 問題解決ガイド

