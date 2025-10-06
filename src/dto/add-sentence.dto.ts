import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AddSentenceDto {
  @ApiProperty({
    description: '日本語のセンテンス',
    example: '明日は早く起きるつもりです'
  })
  @IsString()
  センテンス: string;

  @ApiProperty({
    description: '英訳（複数の表現を改行で区切る）',
    example: "I'm going to wake up early tomorrow.\nI plan to wake up early tomorrow.\nI intend to get up early tomorrow morning."
  })
  @IsString()
  英訳: string;

  @ApiProperty({
    description: '重要表現（キーフレーズと説明を改行で区切る）',
    example: 'be going to（〜するつもり）: 意図や予定を表す\nwake up（目を覚ます）: 自動詞として使用\nget up（起きる）: ベッドから出る動作'
  })
  @IsString()
  重要表現: string;

  @ApiProperty({
    description: '文法ポイント',
    example: 'be going to + 動詞の原形：近い未来の予定や意図を表す表現。will よりも計画性のあるニュアンス'
  })
  @IsString()
  文法ポイント: string;

  @ApiProperty({
    description: '類似表現',
    example: 'I will wake up early tomorrow（よりシンプルな未来形）\nI\'m planning to wake up early tomorrow（planningで計画性を強調）'
  })
  @IsString()
  類似表現: string;

  @ApiProperty({
    description: '使用場面',
    example: 'カジュアル・日常会話。友人や家族との会話で自然に使える表現'
  })
  @IsString()
  使用場面: string;

  @ApiProperty({
    description: '注意点',
    example: 'wake up と get up の違いに注意。wake upは「目が覚める」、get upは「ベッドから起き上がる」という違いがある'
  })
  @IsString()
  注意点: string;

  @ApiProperty({
    description: '難易度（A1〜C2表記 + 日本語補足）',
    example: 'A2（英検4〜3級レベル）',
    required: false
  })
  @IsOptional()
  @IsString()
  難易度?: string;

  @ApiProperty({
    description: 'カテゴリ（日常会話 / ビジネス / 旅行 / アカデミック など）',
    example: '日常会話',
    required: false
  })
  @IsOptional()
  @IsString()
  カテゴリ?: string;
}

