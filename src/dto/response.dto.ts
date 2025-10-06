import { ApiProperty } from '@nestjs/swagger';

export class AddWordResponseDto {
  @ApiProperty({
    description: '成功メッセージ',
    example: "✅ 'hello' added to Notion."
  })
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'エラーメッセージ',
    example: 'Missing required Notion headers.'
  })
  error: string;
}
