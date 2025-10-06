# 🎯 セットアップガイド

## 前提条件

- Node.js 16以上
- Notionアカウント

---

## ステップ1: テンプレートデータベースを複製

👉 **[このテンプレートを複製](https://electric-lemming-07e.notion.site/284d7fb8403e801ca085fb7e9fdaf538?v=284d7fb8403e81ab911b000c4c7e4ec0&source=copy_link)**

1. 上のリンクをクリック
2. 右上の「複製」ボタンをクリック
3. 自分のワークスペースに複製される

> 💡 このテンプレートには、`add-word` APIに対応したプロパティ構造とサンプルページが含まれています。

### テンプレートに含まれるプロパティ

- **Vocabulary** (Title) - 単語名
- **習得度** (Status) - 学習進捗
- **頻出度** (Select) - 使用頻度
  - 🔺あまり使わない
  - 🥉使える
  - 🥈超使える
  - 🥇目から鱗
- **難易度** (Rich Text) - CEFR レベル
- **作成日** (Created Time)
- **更新日** (Last Edited Time)

---

## ステップ2: Notion Integrationを作成

### 2-1. Integrationを作成

1. [Notion Developers](https://www.notion.so/my-integrations)にアクセス
2. 「New integration」をクリック
3. 以下を入力:
   - **Name**: `Vocabulary API`（任意の名前）
   - **Associated workspace**: あなたのワークスペースを選択
4. 「Submit」をクリック

### 2-2. APIキーをコピー

1. 作成したIntegrationのページで「Secrets」セクションを確認
2. **Internal Integration Token** をコピー
3. 安全な場所に保存（これがAPIキーです）

```
例: secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ステップ3: データベースに統合を接続

### 3-1. データベースを開く

複製したデータベースをNotionで開きます。

### 3-2. Integrationを接続

1. データベース画面の右上「⋯」（3点リーダー）メニューをクリック
2. 「接続」→「Connections」を選択
3. 検索ボックスに作成したIntegration名を入力
4. Integration（例: `Vocabulary API`）を選択

✅ 接続が完了すると、「Connected」と表示されます。

---

## ステップ4: データベースIDを取得

### 4-1. URLからIDを取得

データベースのURLを確認します：

```
https://notion.so/284d7fb8403e801ca085fb7e9fdaf538?v=284d7fb8403e81ab911b000c4c7e4ec0
                 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                 この32文字がデータベースID
```

**抽出例:**
```
URL: https://notion.so/284d7fb8403e801ca085fb7e9fdaf538?v=...
データベースID: 284d7fb8403e801ca085fb7e9fdaf538
```

> 💡 ハイフンが入っている場合もありますが、どちらでも動作します
> - `284d7fb8403e801ca085fb7e9fdaf538`
> - `284d7fb8-403e-801c-a085-fb7e9fdaf538`

---

## ステップ5: APIサーバーを起動

### 5-1. 依存関係をインストール

```bash
cd notion-api
npm install
```

### 5-2. サーバーを起動

**開発モード:**
```bash
npm run start:dev
```

**本番モード:**
```bash
npm run build
npm run start:prod
```

サーバーは `http://localhost:3001` で起動します。

---

## ステップ6: APIをテスト

### Swagger UIでテスト（推奨）

1. ブラウザで `http://localhost:3001/api` にアクセス
2. 右上の「Authorize」ボタンをクリック
3. Notion API キーを入力
4. 「Authorize」→「Close」
5. `POST /notion/add-word/{databaseId}` エンドポイントを開く
6. 「Try it out」をクリック
7. パラメータを入力してテスト

### curlでテスト

```bash
curl -X POST http://localhost:3001/notion/add-word/YOUR_DATABASE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
  -d '{
    "word": "test",
    "頻出度": "🥈超使える",
    "難易度": "A1",
    "意味": "テスト",
    "語源": "テスト",
    "collocation": "test word",
    "例文": "This is a test.",
    "類似表現": "試験"
  }'
```

---

## 🎉 完了！

セットアップが完了しました。これで：

- ✅ Notionにテンプレートデータベースがある
- ✅ Integration（API）が作成され、接続されている
- ✅ APIサーバーが起動している
- ✅ 単語を追加できる

次は [API使用例](./API.md) を確認してください。

---

## トラブルシューティング

### ポート3001が既に使用されている

```bash
# 既存のプロセスを停止
pkill -f "nest start"

# または
lsof -ti:3001 | xargs kill -9
```

### Notion APIエラー

**エラー: `Could not find database`**
- データベースIDが正しいか確認
- Integrationがデータベースにアクセスできるか確認（接続を確認）

**エラー: `Unauthorized`**
- APIキーが正しいか確認
- `Bearer` プレフィックスを忘れていないか確認

**エラー: `Validation failed`**
- リクエストボディのJSONが正しいか確認
- 必須フィールド（`word`）が含まれているか確認

詳細は [トラブルシューティングガイド](./TROUBLESHOOTING.md) を参照してください。

