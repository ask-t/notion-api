import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AddWordDto } from './dto/add-word.dto';
import { AddSentenceDto } from './dto/add-sentence.dto';
import { AddWordResponseDto } from './dto/response.dto';

@Injectable()
export class DevNotionService {
  private readonly NOTION_VERSION = '2022-06-28';
  private readonly NOTION_API_KEY = 'secret_LSj6NUeRXVHJSB1oyIR0uy7zPYlIEIhgoHnBo2bmvtE';
  private readonly DEFAULT_PAGE_ID = '284d7fb8-403e-80c5-b878-f651bbbd127b';

  /**
   * Notion APIクライアントを作成（開発用：トークンハードコード）
   */
  private createNotionClient(): AxiosInstance {
    return axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        'Authorization': `Bearer ${this.NOTION_API_KEY}`,
        'Notion-Version': this.NOTION_VERSION,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 単語をNotionデータベースに追加
   */
  async addWord(
    data: AddWordDto,
    databaseId: string
  ): Promise<AddWordResponseDto> {
    try {
      const notion = this.createNotionClient();
      const word = data.word;

      // ページを作成
      const pageRes = await notion.post('/pages', {
        parent: {
          database_id: databaseId
        },
        properties: {
          "Vocabulary": {
            title: [{ text: { content: word } }]
          },
          "習得度": {
            status: { name: "インプット中" }
          },
          "頻出度": {
            select: { name: data["頻出度"] || "🥉使える" }
          },
          "難易度": {
            rich_text: [{
              type: "text",
              text: { content: data["難易度"] || "A1" }
            }]
          }
        }
      });

      const pageId = pageRes.data.id;

      // ブロックを作成
      const blocks = [
        this.createCallout("", data["頻出度"] || "🥉使える", "🗣", "gray_background"),
        this.createToggle("意味", data["意味"]),
        this.createToggle("語源", data["語源"]),
        this.createCalloutWithTitle("コロケーション", (data["collocation"] || "").split(/, ?/).join("\n"), "📎", "blue_background"),
        this.createCalloutWithTitle("例文", data["例文"], "📎", "blue_background"),
        data["イメージ検索"]
          ? this.createCalloutWithTitleAndLink("イメージ", "🔍 Google画像検索でチェック", data["イメージ検索"], "🖼️", "yellow_background")
          : null,
        this.createCalloutWithTitle("自由記述", data["類似表現"] || "", "✏️", "yellow_background")
      ].filter(Boolean);

      // ブロックを追加
      await notion.patch(`/blocks/${pageId}/children`, {
        children: blocks
      });

      return { message: `✅ '${word}' added to Notion.` };
    } catch (err) {
      console.error('Error adding word to Notion:', err.response?.data || err.message);
      throw new HttpException(
        'Failed to add word to Notion.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Calloutブロックを作成
   */
  private createCallout(title: string, content: string, emoji: string, color = "gray_background") {
    return {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji },
        rich_text: [{ type: "text", text: { content } }],
        color
      }
    };
  }

  /**
   * Toggleブロックを作成
   */
  private createToggle(title: string, content: string) {
    return {
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [{
          type: "text",
          text: { content: title },
          annotations: {
            bold: true,
            color: "blue"
          }
        }],
        color: "gray_background",
        children: content ? [{
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{
              type: "text",
              text: { content }
            }]
          }
        }] : []
      }
    };
  }

  /**
   * タイトル付きCalloutブロックを作成
   */
  private createCalloutWithTitle(title: string, content: string, emoji: string, color = "gray_background") {
    return {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji },
        rich_text: [{
          type: "text",
          text: { content: title },
          annotations: {
            bold: true,
            color: "blue"
          }
        }],
        color,
        children: content ? [{
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{
              type: "text",
              text: { content }
            }]
          }
        }] : []
      }
    };
  }

  /**
   * リンク付きタイトル付きCalloutブロックを作成
   */
  private createCalloutWithTitleAndLink(title: string, text: string, url: string, emoji: string, color = "gray_background") {
    return {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji },
        rich_text: [{
          type: "text",
          text: { content: title },
          annotations: {
            bold: true,
            color: "default"
          }
        }],
        color,
        children: [{
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{
              type: "text",
              text: {
                content: text,
                link: { url }
              }
            }]
          }
        }]
      }
    };
  }

  /**
   * 日本語センテンス学習用データベースを作成（開発用：page idハードコード）
   */
  async createSentenceDatabase(
    title: string = '日本語→英語 センテンス学習'
  ): Promise<AddWordResponseDto> {
    try {
      const notion = this.createNotionClient();

      const response = await notion.post('/databases', {
        parent: {
          type: 'page_id',
          page_id: this.DEFAULT_PAGE_ID
        },
        title: [
          {
            type: 'text',
            text: {
              content: title
            }
          }
        ],
        properties: {
          'センテンス': {
            title: {}
          },
          '習得度': {
            status: {}
          },
          '難易度': {
            rich_text: {}
          },
          'カテゴリ': {
            select: {}
          },
          '追加日': {
            created_time: {}
          }
        }
      });

      return {
        message: `✅ データベース「${title}」を作成しました`,
        databaseId: response.data.id
      };
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      console.error('Error creating sentence database:', errorMessage);
      throw new HttpException(
        `Failed to create sentence database: ${JSON.stringify(errorMessage)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * テンプレートページ（空のページ）を通常のページとして作成
   */
  async createTemplatePages(): Promise<AddWordResponseDto> {
    try {
      const notion = this.createNotionClient();

      // テンプレートページのタイトル
      const templateTitles = [
        "テンプレート 1",
        "テンプレート 2",
        "テンプレート 3"
      ];

      let createdCount = 0;

      for (const title of templateTitles) {
        // 通常のページとして作成（データベースではない）
        const pageRes = await notion.post('/pages', {
          parent: {
            page_id: this.DEFAULT_PAGE_ID
          },
          properties: {
            title: {
              title: [{ text: { content: title } }]
            }
          }
        });

        const pageId = pageRes.data.id;

        // 空のブロック構造を作成
        const blocks = [
          this.createCalloutWithTitle("英訳", "", "📝", "blue_background"),
          this.createToggle("重要表現", ""),
          this.createToggle("文法ポイント", ""),
          this.createCalloutWithTitle("類似表現", "", "💡", "yellow_background"),
          this.createCalloutWithTitle("使用場面", "", "🎯", "gray_background"),
          this.createCalloutWithTitle("注意点", "", "⚠️", "red_background"),
          this.createCalloutWithTitle("自由記述", "", "✏️", "yellow_background")
        ];

        // ブロックを追加
        await notion.patch(`/blocks/${pageId}/children`, {
          children: blocks
        });

        createdCount++;
      }

      return {
        message: `✅ 空のテンプレートページを ${createdCount} 件作成しました（Notionでデータベースに変換してください）`
      };
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      console.error('Error creating template pages:', errorMessage);
      throw new HttpException(
        `Failed to create template pages: ${JSON.stringify(errorMessage)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * センテンスをNotionデータベースに追加
   */
  async addSentence(
    data: AddSentenceDto,
    databaseId: string
  ): Promise<AddWordResponseDto> {
    try {
      const notion = this.createNotionClient();
      const sentence = data.センテンス;

      // データベースの構造を取得
      const dbRes = await notion.get(`/databases/${databaseId}`);
      const dbProperties = dbRes.data.properties;

      // プロパティを動的に構築（存在するプロパティのみ設定）
      const properties: any = {
        "センテンス": {
          title: [{ text: { content: sentence } }]
        }
      };

      // 「習得度」プロパティが存在する場合のみ設定
      if (dbProperties["習得度"]) {
        properties["習得度"] = {
          status: { name: "インプット中" }
        };
      }

      // 「カテゴリ」プロパティが存在する場合のみ設定
      if (dbProperties["カテゴリ"] && data["カテゴリ"]) {
        properties["カテゴリ"] = {
          select: { name: data["カテゴリ"] }
        };
      }

      // 「難易度」プロパティが存在する場合のみ設定
      if (dbProperties["難易度"] && data["難易度"]) {
        properties["難易度"] = {
          rich_text: [{
            type: "text",
            text: { content: data["難易度"] }
          }]
        };
      }

      // ページを作成
      const pageRes = await notion.post('/pages', {
        parent: {
          database_id: databaseId
        },
        properties
      });

      const pageId = pageRes.data.id;

      // ブロックを作成
      const blocks = [
        this.createCalloutWithTitle("英訳", data["英訳"], "📝", "blue_background"),
        this.createToggle("重要表現", data["重要表現"]),
        this.createToggle("文法ポイント", data["文法ポイント"]),
        this.createCalloutWithTitle("類似表現", data["類似表現"], "💡", "yellow_background"),
        this.createCalloutWithTitle("使用場面", data["使用場面"], "🎯", "gray_background"),
        this.createCalloutWithTitle("注意点", data["注意点"], "⚠️", "red_background"),
        this.createCalloutWithTitle("自由記述", "", "✏️", "yellow_background")
      ].filter(Boolean);

      // ブロックを追加
      await notion.patch(`/blocks/${pageId}/children`, {
        children: blocks
      });

      return { message: `✅ '${sentence}' をNotionに追加しました。` };
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      console.error('Error adding sentence to Notion:', errorMessage);
      throw new HttpException(
        `Failed to add sentence to Notion: ${JSON.stringify(errorMessage)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

