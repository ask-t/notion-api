import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AddWordDto {
  @ApiProperty({
    description: '追加する単語',
    example: 'hello'
  })
  @IsString()
  word: string;

  @ApiProperty({
    description: '単語の意味',
    example: 'こんにちは'
  })
  @IsString()
  意味: string;

  @ApiProperty({
    description: '単語の語源',
    example: '古英語の「hælan」から'
  })
  @IsString()
  語源: string;

  @ApiProperty({
    description: 'コロケーション（連語）',
    example: 'hello world, hello there'
  })
  @IsString()
  collocation: string;

  @ApiProperty({
    description: '例文',
    example: 'Hello, how are you today?'
  })
  @IsString()
  例文: string;

  @ApiProperty({
    description: '類似表現',
    example: 'hi, hey, greetings'
  })
  @IsString()
  類似表現: string;

  @ApiProperty({
    description: '頻出度（🔺あまり使わない / 🥉使える / 🥈超使える / 🥇目から鱗）',
    example: '🥈超使える',
    required: false
  })
  @IsOptional()
  @IsString()
  頻出度?: string;

  @ApiProperty({
    description: '難易度',
    example: 'A1',
    required: false
  })
  @IsOptional()
  @IsString()
  難易度?: string;

  @ApiProperty({
    description: 'イメージ検索用のURL',
    example: 'https://www.google.com/search?q=hello+image',
    required: false
  })
  @IsOptional()
  @IsString()
  イメージ検索?: string;
}
