# 📚 Vocabulary Notion API

英単語学習を効率化するためのNotion API連携サーバー

---

## 🚀 クイックスタート

```bash
# 1. テンプレートを複製
https://electric-lemming-07e.notion.site/284d7fb8403e801ca085fb7e9fdaf538

# 2. サーバーを起動
npm install
npm run start:dev

# 3. 単語を追加
curl -X POST http://localhost:3001/notion/add-word/YOUR_DB_ID \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"word": "hello"}'
```

---

## 📚 ドキュメント

| ドキュメント | 内容 |
|---|---|
| **[セットアップ](./docs/SETUP.md)** | テンプレート複製、Integration作成、DB接続 |
| **[API仕様](./docs/API.md)** | エンドポイント、リクエスト/レスポンス |
| **[ChatGPT連携](./docs/CHATGPT_PROMPT.md)** | プロンプト、iPhoneショートカット |
| **[トラブルシューティング](./docs/TROUBLESHOOTING.md)** | エラー解決、よくある質問 |

---

## 📖 API

```
POST /notion/add-word/:databaseId
```

単語をNotionに追加。詳細は [API仕様](./docs/API.md)

---

## 🖥️ Swagger UI

```
http://localhost:3001/api
```

---

**Notion API** × **ChatGPT** × **iPhone** で英語学習を自動化 ✨
