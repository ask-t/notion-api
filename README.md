# 📚 Vocabulary Notion API

このプロジェクトは、英単語に関する情報（意味、語源、例文など）を Notion データベースに視覚的にわかりやすい形式で自動登録するための NestJS API です。  
iPhoneショートカット + ChatGPT と連携して使うことで、英語学習をもっと効率的に、楽しくすることができます ✨

---

## 🚀 機能概要

### **エンドポイント**

1. **`POST /notion/add-word/:databaseId`** - 単語を既存のデータベースに追加

### **登録される情報**

- 🗣 頻出度（🔺あまり使わない / 🥉使える / 🥈超使える / 🥇目から鱗）
- 🎓 難易度（A1〜C2 + 日本語補足）
- 📖 意味（トグルブロック、青色太字）
- 📜 語源（トグルブロック、青色太字）
- 📎 コロケーション（Callout、青背景）
- 📎 例文（Callout、青背景）
- 🖼️ イメージ検索リンク（Callout、黄色背景）
- ✏️ 自由記述（Callout、黄色背景）

---

## 📦 インストール

```bash
npm install
```

---

## 🛠 起動方法

### **開発モード**
```bash
npm run start:dev
```

### **本番モード**
```bash
npm run build
npm run start:prod
```

サーバーは `http://localhost:3001` で起動します。

---

## 📚 Swagger UI

APIドキュメントは以下のURLで確認できます：

```
http://localhost:3001/api
```

Swagger UIから直接APIをテストすることができます。

---

## 🔐 認証設定

### **Swagger UIでの認証**

1. Swagger UI（`http://localhost:3001/api`）にアクセス
2. 右上の **「Authorize」** ボタンをクリック
3. Notion API キーを入力（例：`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
4. **「Authorize」** → **「Close」** をクリック

### **curlでの認証**

```bash
-H "Authorization: Bearer secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**注意**: Notion-Versionは`2022-06-28`で固定されているため、指定不要です。

---

## 📝 エンドポイントの使い方

### **1. 単語を追加: `POST /notion/add-word/:databaseId`**

既存のデータベースに単語を追加します。

#### **リクエスト例**

```bash
curl -X POST http://localhost:3001/notion/add-word/1cdd7fb8403e80668b15db2c9722d93c \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret_your_api_key" \
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

#### **レスポンス例**

```json
{
  "message": "✅ 'punctual' added to Notion."
}
```

---

## 🧠 推奨されるChatGPTプロンプト（iPhone用）

```
以下の英単語について、以下の項目に従って回答し、最後にJSONで出力してください：{word}

■ 頻出度:  
次の4分類から1つ選び、その理由も記述（出力形式は固定）  
- 🥇目から鱗  
- 🥈超使える  
- 🥉使える  
- 🔺あまり使わない

■ 難易度:  
A1〜C2表記 + 日本語補足（例：A2（英検3〜準2級））

■ 意味:  
1〜2文で簡潔な日本語訳

■ 語源:  
ラテン語や語根の説明、由来など

■ collocation:  
語彙 + 一緒に使われる語を5個、カンマで区切って出力（例：punctual person, punctual arrival）

■ 例文:  
英文3文 + 日本語訳3文（改行で区切って）

■ イメージ検索リンク:  
https://www.google.com/search?tbm=isch&q=[単語]

■ 類似表現:  
類似表現を3つ以上、それぞれ日本語訳と補足説明を含めて

---

出力例:

{
  "word": "punctual",
  "頻出度": "🥈超使える",
  "難易度": "B1（英検準2〜2級レベル）",
  "意味": "時間を守る、時間に正確な",
  "語源": "ラテン語 punctum（点）に由来し、時間の「正確さ」を示す意味が転じた",
  "collocation": "punctual person, punctual arrival, punctual employee, punctual bus, be punctual",
  "例文": "She is always punctual for meetings.\n彼女はいつも会議に時間通りに来ます。\n\nPlease be punctual for your job interview.\n就職面接には時間を守ってください。\n\nTrains in Japan are known for being punctual.\n日本の電車は時間に正確で知られています。",
  "イメージ検索": "https://www.google.com/search?tbm=isch&q=punctual",
  "類似表現": "on time（時間通りに）: punctual のより一般的な表現\nprompt（即座の）: 素早く行動するという意味合いもある\ntimely（適時の）: 状況に合った時間的タイミング"
}
```

---

## 🔧 技術スタック

- **NestJS** - TypeScript製のプログレッシブなNode.jsフレームワーク
- **Swagger/OpenAPI** - APIドキュメント自動生成
- **Axios** - HTTPクライアント
- **class-validator** - DTOバリデーション

---

## 📁 プロジェクト構造

```
notion-api/
├── src/
│   ├── main.ts                      # アプリケーションエントリーポイント
│   ├── app.module.ts                # ルートモジュール
│   ├── app.controller.ts            # Hello Worldコントローラー
│   ├── notion.controller.ts         # Notion APIコントローラー
│   └── dto/
│       ├── add-word.dto.ts          # 単語追加用DTO
│       ├── create-database.dto.ts   # データベース作成用DTO
│       └── response.dto.ts          # レスポンス用DTO
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Notion統合の設定

1. **Notion Integrationを作成**
   - [Notion Developers](https://developers.notion.com/)にアクセス
   - 「My integrations」→「New integration」
   - 名前を入力して作成
   - Internal Integration Tokenをコピー

2. **データベースに統合を接続**
   - Notionでデータベースを開く
   - 右上の「⋯」メニュー→「接続」
   - 作成したIntegrationを選択

3. **データベースIDを取得**
   - データベースのURLから取得
   - 例：`https://notion.so/1cdd7fb8403e80668b15db2c9722d93c`
   - → データベースID: `1cdd7fb8403e80668b15db2c9722d93c`

---

## 🐛 トラブルシューティング

### **ポート3001が既に使用されている**
```bash
# 既存のプロセスを停止
pkill -f "nest start"

# または
lsof -ti:3001 | xargs kill -9
```

### **Swaggerでロードが終わらない**
- ブラウザのコンソール（F12）でエラーを確認
- 「Authorize」で認証を設定しているか確認
- サーバーログを確認

### **Notion APIエラー**
- API キーが正しいか確認
- Integrationがデータベースにアクセス権限を持っているか確認
- データベースIDが正しいか確認

---

## 📄 ライセンス

ISC

---

## 👨‍💻 作者

Your Name

---

## 🙏 謝辞

このAPIは英語学習を効率化するために作成されました。
Notion APIとChatGPTの組み合わせで、楽しく学習を続けられることを願っています 🌟
