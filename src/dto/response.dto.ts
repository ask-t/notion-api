import { ApiProperty } from '@nestjs/swagger';

export class AddWordResponseDto {
  @ApiProperty({
    description: '成功メッセージ',
    example: "✅ 'hello' added to Notion."
  })
  message: string;

  @ApiProperty({
    description: '作成されたデータベースID（データベース作成時のみ）',
    example: '284d7fb8403e801ca085fb7e9fdaf538',
    required: false
  })
  databaseId?: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'エラーメッセージ',
    example: 'Missing required Notion headers.'
  })
  error: string;
}
