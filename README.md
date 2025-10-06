# 📚 Vocabulary Notion API

英語学習を効率化するためのNotion API連携サーバー

- 🔤 **英単語学習**: 英単語の詳細情報をNotionに自動保存
- 📝 **センテンス学習**: 日本語文を英語に翻訳・分析してNotionに保存

---

## 🚀 クイックスタート

### 開発・テスト用（認証不要）

```bash
# 1. サーバーを起動
npm install
npm run start:dev

# 2. テンプレートページを作成
curl -X POST http://localhost:3001/dev-notion/create-template-pages

# 3. Notionでページをデータベースに変換
# → Notion上で3つのページを選択 → 右クリック → 「データベースに変換」

# 4. センテンスを追加
curl -X POST http://localhost:3001/dev-notion/add-sentence/YOUR_DB_ID \
  -H "Content-Type: application/json" \
  -d '{"センテンス": "こんにちは", "英訳": "Hello", ...}'
```

### 本番用（認証あり）

```bash
# 1. Integrationを作成してAPIキーを取得
# 2. Notionページに接続

# 3. 単語を追加
curl -X POST http://localhost:3001/notion/add-word/YOUR_DB_ID \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"word": "hello", "意味": "こんにちは", ...}'
```

詳細は [セットアップ](./docs/SETUP.md) をご覧ください。

---

## 📚 ドキュメント

| ドキュメント | 内容 |
|---|---|
| **[セットアップ](./docs/SETUP.md)** | テンプレート複製、Integration作成、DB接続 |
| **[API仕様](./docs/API.md)** | エンドポイント、リクエスト/レスポンス |
| **[開発用API](./docs/DEV_API.md)** | 認証不要の開発・テスト用エンドポイント |
| **[英単語プロンプト](./docs/CHATGPT_PROMPT.md)** | 英単語学習用プロンプト、iPhoneショートカット |
| **[センテンスプロンプト](./docs/SENTENCE_PROMPT.md)** | 日本語→英語センテンス学習用プロンプト |
| **[トラブルシューティング](./docs/TROUBLESHOOTING.md)** | エラー解決、よくある質問 |

---

## 📖 API

### 本番用API（認証必要）

#### 英単語学習

```
POST /notion/add-word/:databaseId
```

英単語をNotionに追加。詳細は [英単語プロンプト](./docs/CHATGPT_PROMPT.md)

#### センテンス学習

```
POST /notion/create-sentence-database/:pageId  # データベースを作成
POST /notion/add-sentence/:databaseId          # センテンスを追加
```

日本語センテンスを英訳・分析してNotionに追加。詳細は [センテンスプロンプト](./docs/SENTENCE_PROMPT.md)

---

### 🔧 開発用API（認証不要）

トークンとページIDがハードコードされた開発・テスト用エンドポイント：

```bash
# 推奨: テンプレートから開始
POST /dev-notion/create-template-pages        # テンプレートページ3件を作成
# → Notion上でデータベースに手動変換
POST /dev-notion/add-sentence/:databaseId     # センテンスを追加

# または: 自動作成から開始
POST /dev-notion/create-sentence-database     # データベースを自動作成
POST /dev-notion/add-sentence/:databaseId     # センテンスを追加

# 英単語追加
POST /dev-notion/add-word/:databaseId         # 英単語を追加
```

#### 推奨フロー

1. **`create-template-pages`** でサンプルページ3件を作成
2. **Notion上でデータベースに変換**（お好みのプロパティを追加）
3. **`add-sentence`** で追加データを投入

**メリット**: 
- ✅ データベース構造を自由にカスタマイズできる
- ✅ 既存のプロパティのみ設定（エラーが起きにくい）
- ✅ テンプレートページで構造を確認できる

詳細は [開発用API](./docs/DEV_API.md) をご覧ください。

---

## 🖥️ Swagger UI

```
http://localhost:3001/api
```

ブラウザでAPIドキュメントを確認し、直接テストできます。

---

## 💡 特徴

### 動的プロパティ設定

`add-sentence`エンドポイントは、データベースの構造を自動的に取得し、**存在するプロパティのみ設定**します。

```typescript
// 例: あなたのデータベースに「習得度」プロパティがない場合
// → 自動的にスキップされ、エラーになりません

// 例: 「カテゴリ」プロパティがある場合
// → 自動的に設定されます
```

**メリット**:
- ✅ カスタマイズ自由: 自分好みにプロパティを追加・削除できる
- ✅ エラーに強い: 存在しないプロパティは自動でスキップ
- ✅ 柔軟性: データベース構造の変更に対応

### テンプレートページ機能

`create-template-pages`で、空のテンプレートページを3件作成できます：

1. 📝 テンプレート 1（空）
2. 📝 テンプレート 2（空）
3. 📝 テンプレート 3（空）

各ページには以下のブロック構造が含まれています（内容は空）：
- 📝 英訳（Callout）
- 🔑 重要表現（Toggle）
- 📚 文法ポイント（Toggle）
- 💡 類似表現（Callout）
- 🎯 使用場面（Callout）
- ⚠️ 注意点（Callout）
- ✏️ 自由記述（Callout）

これらのページをNotionでデータベースに変換すれば、すぐに使い始められます。

---

## 🔗 関連リンク

- [Notion API ドキュメント](https://developers.notion.com/)
- [NestJS ドキュメント](https://docs.nestjs.com/)
- [Swagger/OpenAPI](https://swagger.io/)

---

**Notion API** × **ChatGPT** × **iPhone** で英語学習を自動化 ✨
