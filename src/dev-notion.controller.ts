import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody
} from '@nestjs/swagger';
import { AddWordDto } from './dto/add-word.dto';
import { AddSentenceDto } from './dto/add-sentence.dto';
import { AddWordResponseDto } from './dto/response.dto';
import { DevNotionService } from './dev-notion.service';

@ApiTags('dev-notion')
@Controller('dev-notion')
export class DevNotionController {
  constructor(private readonly devNotionService: DevNotionService) { }

  @Post('add-word/:databaseId')
  @ApiOperation({ summary: '[開発用] 単語をNotionデータベースに追加（認証不要）' })
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
    @Param('databaseId') databaseId: string
  ): Promise<AddWordResponseDto> {
    // バリデーション
    if (!databaseId) {
      throw new HttpException(
        'Missing databaseId parameter.',
        HttpStatus.BAD_REQUEST
      );
    }

    // サービスに処理を委譲
    return this.devNotionService.addWord(data, databaseId);
  }

  @Post('create-sentence-database')
  @ApiOperation({ summary: '[開発用] 日本語センテンス学習用データベースを作成（認証不要）' })
  @ApiResponse({
    status: 200,
    description: 'データベースが正常に作成されました',
    type: AddWordResponseDto
  })
  @ApiResponse({
    status: 500,
    description: 'サーバーエラー'
  })
  async createSentenceDatabase(): Promise<AddWordResponseDto> {
    // サービスに処理を委譲（page idはハードコード済み）
    return this.devNotionService.createSentenceDatabase();
  }

  @Post('create-template-pages')
  @ApiOperation({ summary: '[開発用] テンプレートページ（サンプルセンテンス3件）を通常のページとして作成（認証不要）' })
  @ApiResponse({
    status: 200,
    description: 'テンプレートページが正常に作成されました',
    type: AddWordResponseDto
  })
  @ApiResponse({
    status: 500,
    description: 'サーバーエラー'
  })
  async createTemplatePages(): Promise<AddWordResponseDto> {
    // サービスに処理を委譲（page idはハードコード済み）
    return this.devNotionService.createTemplatePages();
  }

  @Post('add-sentence/:databaseId')
  @ApiOperation({ summary: '[開発用] 日本語センテンスをNotionデータベースに追加（認証不要）' })
  @ApiBody({ type: AddSentenceDto })
  @ApiResponse({
    status: 200,
    description: 'センテンスが正常に追加されました',
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
  async addSentence(
    @Body() data: AddSentenceDto,
    @Param('databaseId') databaseId: string
  ): Promise<AddWordResponseDto> {
    // バリデーション
    if (!databaseId) {
      throw new HttpException(
        'Missing databaseId parameter.',
        HttpStatus.BAD_REQUEST
      );
    }

    // サービスに処理を委譲
    return this.devNotionService.addSentence(data, databaseId);
  }
}

