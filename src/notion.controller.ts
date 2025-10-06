import {
  Controller,
  Post,
  Body,
  Headers,
  Param,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AddWordDto } from './dto/add-word.dto';
import { AddWordResponseDto } from './dto/response.dto';
import { NotionService } from './notion.service';

@ApiTags('notion')
@Controller('notion')
export class NotionController {
  constructor(private readonly notionService: NotionService) { }

  @Post('add-word/:databaseId')
  @ApiOperation({ summary: '単語をNotionデータベースに追加' })
  @ApiBearerAuth('bearer')
  @ApiBody({ type: AddWordDto })
  @ApiResponse({
    status: 200,
    description: '単語が正常に追加されました',
    type: AddWordResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'リクエストパラメータが不正です'
  })
  @ApiResponse({
    status: 500,
    description: 'サーバーエラー'
  })
  async addWord(
    @Body() data: AddWordDto,
    @Headers() headers: Record<string, string>,
    @Param('databaseId') databaseId: string
  ): Promise<AddWordResponseDto> {
    // ヘッダーからAPIキーを取得
    const notionApiKey = headers['authorization']?.replace('Bearer ', '') ||
      headers['Authorization']?.replace('Bearer ', '');

    // バリデーション
    if (!notionApiKey || !databaseId) {
      throw new HttpException(
        'Missing required Notion headers.',
        HttpStatus.BAD_REQUEST
      );
    }

    // サービスに処理を委譲
    return this.notionService.addWord(data, notionApiKey, databaseId);
  }
}
