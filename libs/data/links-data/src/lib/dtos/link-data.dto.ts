import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
} from 'class-validator';


export class LinkDataDto { 

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    longUrl: string;

}   

export class UpdateLinkDto {
  @IsOptional()
  @IsUrl()
  longUrl?: string;

  @IsOptional()
  @IsString()
  shortUrl?: string;
}