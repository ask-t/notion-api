# 🧠 日本語→英語センテンス学習 プロンプトガイド

iPhoneショートカットやChatGPTと連携して、日本語のセンテンスを英語に翻訳・分析する方法を紹介します。

---

## 推奨プロンプト（iPhone用）

以下のプロンプトをChatGPTに送信すると、API互換のJSON形式で情報が返ってきます。

### プロンプトテンプレート

```
以下の日本語センテンスについて、英語学習に役立つ情報を分析し、最後にJSONで出力してください：{sentence}

■ センテンス:
元の日本語文をそのまま記載

■ 英訳:
自然な英語表現（複数の言い回しがあれば、フォーマル/カジュアルの違いも含めて）

■ 重要表現:
このセンテンスで押さえるべきキーフレーズを3〜5個、英語と日本語訳で記載
（例：「〜するつもりだ」→ be going to / intend to / plan to）

■ 文法ポイント:
使用されている主要な文法項目を簡潔に説明
（例：「現在完了形（経験）」「仮定法過去」など）

■ 難易度:
A1〜C2表記 + 日本語補足（例：B1（英検準2〜2級レベル））

■ カテゴリ:
次の5分類から1つ選択（出力形式は固定）
- 日常会話
- ビジネス
- 旅行
- アカデミック
- その他

■ 類似表現:
同じ意味を表す別の英語表現を2〜3個、ニュアンスの違いも含めて

■ 使用場面:
どのような状況で使うか（フォーマル/カジュアル、ビジネス/日常会話など）

■ 注意点:
日本人が間違えやすいポイントや、文化的な違いなど

---

出力例:

{
  "センテンス": "明日は早く起きるつもりです",
  "英訳": "I'm going to wake up early tomorrow.\nI plan to wake up early tomorrow.\nI intend to get up early tomorrow morning.",
  "重要表現": "be going to（〜するつもり）: 意図や予定を表す\nwake up（目を覚ます）: 自動詞として使用\nget up（起きる）: ベッドから出る動作",
  "文法ポイント": "be going to + 動詞の原形：近い未来の予定や意図を表す表現。will よりも計画性のあるニュアンス",
  "難易度": "A2（英検4〜3級レベル）",
  "カテゴリ": "日常会話",
  "類似表現": "I will wake up early tomorrow（よりシンプルな未来形）\nI'm planning to wake up early tomorrow（planningで計画性を強調）",
  "使用場面": "カジュアル・日常会話。友人や家族との会話で自然に使える表現",
  "注意点": "wake up と get up の違いに注意。wake upは「目が覚める」、get upは「ベッドから起き上がる」という違いがある"
}
```

---

## iPhoneショートカットのフロー

### 完全な自動化ショートカット

```
1. [日本語テキストを選択] or [センテンスを入力]
   ↓
2. [ChatGPT APIを呼び出し]
   - 上記のプロンプトを使用
   - {sentence}を選択したテキストに置換
   ↓
3. [レスポンスからJSONを抽出]
   - マッチテキスト: "```json" と "```" の間
   ↓
4. [Notion APIを呼び出し]
   POST http://your-api-url/notion/add-sentence/YOUR_DB_ID
   Headers:
     - Content-Type: application/json
     - Authorization: Bearer YOUR_API_KEY
   Body: [ステップ3で取得したJSON]
   ↓
5. [通知を表示]
   "✅ センテンスを Notion に追加しました"
```

### ショートカットの設定例

**入力:**
- テキスト（クリップボード、共有シート、または入力）

**変数:**
```
API_URL = http://your-api-url:3001
NOTION_API_KEY = secret_xxxxxxxxxxxx
DATABASE_ID = 284d7fb8403e801ca085fb7e9fdaf538
CHATGPT_API_KEY = sk-xxxxxxxxxxxx
```

**アクション:**

1. **テキストを取得**
   ```
   入力を取得 → 変数「センテンス」に設定
   ```

2. **ChatGPTに問い合わせ**
   ```
   URLの内容を取得
   URL: https://api.openai.com/v1/chat/completions
   Method: POST
   Headers:
     - Authorization: Bearer {CHATGPT_API_KEY}
     - Content-Type: application/json
   Body:
     {
       "model": "gpt-4",
       "messages": [
         {
           "role": "user",
           "content": "[上記のプロンプト（{sentence}を変数「センテンス」に置換）]"
         }
       ]
     }
   → 変数「ChatGPT応答」に設定
   ```

3. **JSONを抽出**
   ```
   「ChatGPT応答」から辞書値を取得
   キー: choices[0].message.content
   → 変数「応答テキスト」に設定
   
   「応答テキスト」から正規表現で抽出
   パターン: ```json\n(.*?)\n```
   → 変数「JSON文字列」に設定
   ```

4. **Notion APIを呼び出し**
   ```
   URLの内容を取得
   URL: {API_URL}/notion/add-sentence/{DATABASE_ID}
   Method: POST
   Headers:
     - Authorization: Bearer {NOTION_API_KEY}
     - Content-Type: application/json
   Body: {JSON文字列}
   ```

5. **完了通知**
   ```
   通知を表示
   タイトル: "センテンスを追加"
   本文: "✅ センテンスを Notion に追加しました"
   ```

---

## データベースの作成

新しくデータベースを作成する場合は、以下のエンドポイントを使用します：

### エンドポイント

```
POST http://your-api-url:3001/notion/create-sentence-database/{PAGE_ID}
```

### リクエスト例（curl）

```bash
curl -X POST "http://localhost:3001/notion/create-sentence-database/YOUR_PAGE_ID" \
  -H "Authorization: Bearer secret_xxxxxxxxxxxx" \
  -H "Content-Type: application/json"
```

### レスポンス例

```json
{
  "message": "✅ データベース「日本語→英語 センテンス学習」を作成しました",
  "databaseId": "284d7fb8403e801ca085fb7e9fdaf538"
}
```

返された `databaseId` を、`add-sentence` エンドポイントで使用します。

---

## 応用例

### 1. 日常会話で使いたい表現を即座に学習

```
[思いついた日本語フレーズを入力]
  ↓
[Siriに「英語で言うと？ 〇〇」と言う]
  ↓
[ショートカットが起動]
  ↓
[自動でNotionに追加]
```

### 2. 仕事のメールで使う表現を記録

```
[ビジネスシーンで使いたい日本語文を選択]
  ↓
[共有シートから「英訳を学ぶ」ショートカットを実行]
  ↓
[自動でNotionに追加（カテゴリ：ビジネス）]
```

### 3. 英会話の準備

```
[旅行前に覚えたいフレーズをリスト化]
  ↓
[各フレーズを繰り返し処理]
  ↓
[すべて自動でNotionに追加（カテゴリ：旅行）]
```

---

## プロンプトのカスタマイズ

### より詳しい情報が欲しい場合

プロンプトに以下を追加：

```
■ 発音のポイント:
英語特有の発音やイントネーションの注意点

■ 背景知識:
文化的な背景や、ネイティブがよく使うシーンなど

■ 間違い例:
日本人がよくやってしまう間違った表現
```

### より簡単な情報でいい場合

プロンプトから以下を削除：

```
- 文法ポイント（削除可）
- 類似表現（削除可）
- 注意点（削除可）
```

---

## テンプレート例

### Notionページのイメージ

```
タイトル: 明日は早く起きるつもりです
習得度: [インプット中]
カテゴリ: [日常会話]
難易度: A2（英検4〜3級レベル）

📝 英訳
I'm going to wake up early tomorrow.
I plan to wake up early tomorrow.
I intend to get up early tomorrow morning.

▶️ 重要表現
be going to（〜するつもり）: 意図や予定を表す
wake up（目を覚ます）: 自動詞として使用
get up（起きる）: ベッドから出る動作

▶️ 文法ポイント
be going to + 動詞の原形：近い未来の予定や意図を表す表現。will よりも計画性のあるニュアンス

💡 類似表現
I will wake up early tomorrow（よりシンプルな未来形）
I'm planning to wake up early tomorrow（planningで計画性を強調）

🎯 使用場面
カジュアル・日常会話。友人や家族との会話で自然に使える表現

⚠️ 注意点
wake up と get up の違いに注意。wake upは「目が覚める」、get upは「ベッドから起き上がる」という違いがある

✏️ 自由記述
[ここに自分なりのメモを追加]
```

---

## トラブルシューティング

### ChatGPTがJSON形式で返さない

**対策:**
プロンプトの最後に以下を強調：

```
重要: 必ず有効なJSON形式で出力してください。
説明文は含めず、JSONのみを出力してください。
```

### JSONのパースエラー

**対策:**
ショートカットで以下を追加：

```
「JSON文字列」から以下を削除:
- 行頭の ```json
- 行末の ```
- 余分な空白や改行
```

### APIエラー「validation failed」

**対策:**
- ChatGPTの応答を確認
- 必須フィールド（`センテンス`）が含まれているか確認
- 文字列が適切にエスケープされているか確認

---

## 次のステップ

- [API リファレンス](./API.md) - エンドポイントの詳細
- [トラブルシューティング](./TROUBLESHOOTING.md) - 問題解決ガイド

