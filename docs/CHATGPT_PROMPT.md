# 🧠 ChatGPT プロンプトガイド

iPhone ショートカットやChatGPTと連携して、単語の詳細情報を自動取得する方法を紹介します。

---

## 推奨プロンプト（iPhone用）

以下のプロンプトをChatGPTに送信すると、API互換のJSON形式で情報が返ってきます。

### プロンプトテンプレート

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

## iPhoneショートカットのフロー

### 完全な自動化ショートカット

```
1. [テキストを選択] or [単語を入力]
   ↓
2. [ChatGPT APIを呼び出し]
   - 上記のプロンプトを使用
   - {word}を選択したテキストに置換
   ↓
3. [レスポンスからJSONを抽出]
   - マッチテキスト: "```json" と "```" の間
   ↓
4. [Notion APIを呼び出し]
   POST http://your-api-url/notion/add-word/YOUR_DB_ID
   Headers:
     - Content-Type: application/json
     - Authorization: Bearer YOUR_API_KEY
   Body: [ステップ3で取得したJSON]
   ↓
5. [通知を表示]
   "✅ '{単語}' を Notion に追加しました"
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
   入力を取得 → 変数「単語」に設定
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
           "content": "[上記のプロンプト（{word}を変数「単語」に置換）]"
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
   URL: {API_URL}/notion/add-word/{DATABASE_ID}
   Method: POST
   Headers:
     - Authorization: Bearer {NOTION_API_KEY}
     - Content-Type: application/json
   Body: {JSON文字列}
   ```

5. **完了通知**
   ```
   通知を表示
   タイトル: "単語を追加"
   本文: "✅ '{単語}' を Notion に追加しました"
   ```

---

## 応用例

### 1. 読書中の単語を即座に追加

```
[Kindleなどで単語を選択]
  ↓
[共有シートから「単語を学ぶ」ショートカットを実行]
  ↓
[自動でNotionに追加]
```

### 2. 会話中に出てきた単語を記録

```
[Siriに「単語を学ぶ 〇〇」と言う]
  ↓
[ショートカットが起動]
  ↓
[自動でNotionに追加]
```

### 3. 単語リストを一括追加

```
[テキストファイルから単語リストを読み込む]
  ↓
[各単語を繰り返し処理]
  ↓
[すべて自動でNotionに追加]
```

---

## プロンプトのカスタマイズ

### より詳しい情報が欲しい場合

プロンプトに以下を追加：

```
■ 発音記号:
IPA形式で発音を記載

■ 品詞と活用:
動詞の場合は過去形・過去分詞、名詞の場合は複数形など

■ 使用場面:
フォーマル/カジュアル、ビジネス/日常など

■ 注意点:
間違いやすいポイント、使用上の注意
```

### より簡単な情報でいい場合

プロンプトから以下を削除：

```
- 語源（削除可）
- コロケーション（削除可）
- 類似表現（削除可）
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
- 必須フィールド（`word`）が含まれているか確認
- 文字列が適切にエスケープされているか確認

---

## 次のステップ

- [API リファレンス](./API.md) - エンドポイントの詳細
- [トラブルシューティング](./TROUBLESHOOTING.md) - 問題解決ガイド

