import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AddWordDto } from './dto/add-word.dto';
import { AddWordResponseDto } from './dto/response.dto';

@Injectable()
export class NotionService {
  private readonly NOTION_VERSION = '2022-06-28';

  /**
   * Notion APIクライアントを作成
   */
  private createNotionClient(apiKey: string): AxiosInstance {
    return axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
    notionApiKey: string,
    databaseId: string
  ): Promise<AddWordResponseDto> {
    try {
      const notion = this.createNotionClient(notionApiKey);
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
}

