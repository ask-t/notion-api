# 🐛 トラブルシューティング

よくある問題と解決方法をまとめています。

---

## サーバー関連

### ポート3001が既に使用されている

**エラーメッセージ:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解決方法:**

**方法1: プロセスを停止**
```bash
# NestJSプロセスを停止
pkill -f "nest start"
```

**方法2: ポートを使用しているプロセスを特定して停止**
```bash
# ポート3001を使用しているプロセスを確認
lsof -ti:3001

# プロセスを停止
lsof -ti:3001 | xargs kill -9
```

**方法3: ポート番号を変更**
```typescript
// src/main.ts
await app.listen(3002); // 3001 → 3002に変更
```

---

### サーバーが起動しない

**症状:**
```bash
npm run start:dev
# エラーが表示される
```

**確認事項:**

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **Node.jsのバージョン**
   ```bash
   node -v
   # v16以上が必要
   ```

3. **TypeScriptのコンパイルエラー**
   ```bash
   npm run build
   # エラーメッセージを確認
   ```

---

## Notion API関連

### データベースが見つからない（404エラー）

**エラーメッセージ:**
```json
{
  "object": "error",
  "status": 404,
  "code": "object_not_found",
  "message": "Could not find database with ID: xxx"
}
```

**原因と解決方法:**

1. **データベースIDが間違っている**
   - URLから正しいIDをコピーし直す
   - ハイフンの有無を確認

2. **Integrationが接続されていない**
   ```
   Notionでデータベースを開く
   → 右上「⋯」
   → 「接続」
   → Integrationを選択
   ```

3. **データベースではなくページのIDを使っている**
   - データベースビューのURLを使用する
   - 個別ページのURLではない

---

### 認証エラー（401 Unauthorized）

**エラーメッセージ:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**原因と解決方法:**

1. **APIキーが間違っている**
   - [My Integrations](https://www.notion.so/my-integrations)で確認
   - `secret_`で始まる文字列

2. **Bearerプレフィックスを忘れている**
   ```bash
   # ❌ 間違い
   Authorization: secret_xxxxxxxxxxxx
   
   # ✅ 正しい
   Authorization: Bearer secret_xxxxxxxxxxxx
   ```

3. **APIキーに余分なスペースがある**
   ```bash
   # 前後のスペースを削除
   Authorization: Bearer secret_xxxxxxxxxxxx
   ```

---

### 権限エラー（403 Forbidden）

**エラーメッセージ:**
```json
{
  "object": "error",
  "status": 403,
  "code": "restricted_resource"
}
```

**解決方法:**

Integration の権限を確認：

1. [My Integrations](https://www.notion.so/my-integrations)にアクセス
2. Integrationを開く
3. 「Capabilities」タブを確認
4. 以下が有効になっているか確認:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content

---

### バリデーションエラー（400 Bad Request）

**エラーメッセージ:**
```json
{
  "object": "error",
  "status": 400,
  "code": "validation_error",
  "message": "body failed validation: ..."
}
```

**よくある原因:**

1. **必須フィールドが不足**
   ```json
   {
     // "word"フィールドが必須
     "word": "hello"
   }
   ```

2. **プロパティ名が間違っている**
   - テンプレートのプロパティ名と一致させる
   - 例: `Vocabulary`, `習得度`, `頻出度`

3. **JSONの形式が間違っている**
   ```bash
   # JSON検証ツールで確認
   echo '{"word":"test"}' | jq .
   ```

---

### レート制限エラー（429 Too Many Requests）

**エラーメッセージ:**
```json
{
  "object": "error",
  "status": 429,
  "code": "rate_limited"
}
```

**解決方法:**

1. **リクエスト間隔を空ける**
   ```javascript
   // 各リクエストの間に待機
   await sleep(1000); // 1秒待機
   ```

2. **バッチ処理を避ける**
   - 一度に大量のリクエストを送信しない
   - 3リクエスト/秒以下に制限

3. **時間を空けて再試行**
   - 数分待ってから再度実行

---

## Swagger UI関連

### Swaggerが表示されない

**症状:**
- `http://localhost:3001/api` にアクセスしてもページが表示されない
- ずっとロード中

**解決方法:**

1. **サーバーが起動しているか確認**
   ```bash
   curl http://localhost:3001
   # "Hello World" が返ってくれば起動している
   ```

2. **ブラウザのコンソールを確認**
   - F12キーを押す
   - Consoleタブでエラーを確認

3. **別のブラウザで試す**
   - Chrome、Firefox、Safariなど

---

### Swagger UIで認証できない

**症状:**
- 「Authorize」でAPIキーを入力しても認証されない

**解決方法:**

1. **APIキーの形式を確認**
   ```
   secret_で始まる文字列を入力
   Bearerプレフィックスは不要
   ```

2. **一度ログアウトしてから再認証**
   - 「Authorize」→「Logout」
   - 再度「Authorize」で入力

---

## iPhone ショートカット関連

### ショートカットでAPIを呼び出せない

**症状:**
- ショートカットが「エラー」と表示される
- Notionに追加されない

**確認事項:**

1. **URLが正しいか**
   ```
   ❌ http://localhost:3001/...
   ✅ http://YOUR_SERVER_IP:3001/...
   
   # localhostはiPhoneからアクセスできない
   ```

2. **サーバーが外部からアクセス可能か**
   ```bash
   # main.tsで全インターフェースをリッスン
   await app.listen(3001, '0.0.0.0');
   ```

3. **ネットワークが同じか**
   - iPhoneとサーバーが同じWi-Fiネットワークにいる
   - ファイアウォールで3001番ポートが開いている

---

### ChatGPTの応答がJSONにならない

**症状:**
- ChatGPTが説明文を含めて返す
- JSONのパースに失敗

**解決方法:**

プロンプトに以下を追加：

```
重要事項:
1. 必ず有効なJSON形式で出力すること
2. JSONの前後に説明文を含めないこと
3. コードブロック記号（```）を使わないこと
```

または、正規表現で抽出：

```javascript
// ```json と ``` の間を抽出
const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
const json = jsonMatch ? jsonMatch[1] : response;
```

---

## データベース構造関連

### プロパティが見つからない

**エラーメッセージ:**
```
Property "Vocabulary" does not exist
```

**解決方法:**

1. **テンプレートを使用する**
   - [公式テンプレート](https://electric-lemming-07e.notion.site/284d7fb8403e801ca085fb7e9fdaf538)を複製

2. **プロパティ名を確認**
   - Notion上のプロパティ名と完全一致させる
   - 大文字小文字も区別される

3. **必須プロパティを確認**
   ```
   必須:
   - Vocabulary (Title)
   - 習得度 (Status)
   - 頻出度 (Select)
   - 難易度 (Rich Text)
   ```

---

### ステータスプロパティのエラー

**エラーメッセージ:**
```
Status "インプット中" does not exist
```

**解決方法:**

1. **ステータスオプションを追加**
   - データベースで「習得度」プロパティを開く
   - 「インプット中」ステータスを追加

2. **または、既存のステータス名を使用**
   ```typescript
   // 既存のステータス名に変更
   "習得度": {
     status: { name: "Not started" } // 既存の名前
   }
   ```

---

## その他

### 日本語が文字化けする

**解決方法:**

1. **ヘッダーにUTF-8を指定**
   ```bash
   -H "Content-Type: application/json; charset=utf-8"
   ```

2. **ターミナルのエンコーディング確認**
   ```bash
   # macOS/Linux
   echo $LANG
   # UTF-8が含まれているか確認
   ```

---

### ログを確認したい

**サーバーログ:**
```bash
# 開発モードで詳細ログを表示
npm run start:dev

# ログをファイルに保存
npm run start:dev 2>&1 | tee server.log
```

**Notion APIのレスポンスを確認:**
```typescript
// notion.service.ts
console.log('Response:', response.data);
```

---

## サポート

上記で解決しない場合は、以下の情報を含めてIssueを作成してください：

1. エラーメッセージの全文
2. 実行したコマンドまたはリクエスト
3. サーバーログ
4. 環境情報（OS、Node.jsバージョン）

---

## 参考リンク

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Status](https://status.notion.so/)
- [セットアップガイド](./SETUP.md)
- [API リファレンス](./API.md)

