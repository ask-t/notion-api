import { ApiProperty } from '@nestjs/swagger';

export class NotionHeadersDto {
  @ApiProperty({
    description: 'Notion API キー',
    example: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  })
  'x-notion-api-key': string;

  @ApiProperty({
    description: 'Notion データベースID（単語追加時のみ）',
    example: '12345678-1234-1234-1234-123456789abc',
    required: false
  })
  'x-notion-database-id'?: string;

  @ApiProperty({
    description: 'Notion API バージョン',
    example: '2022-06-28'
  })
  'x-notion-version': string;
}
