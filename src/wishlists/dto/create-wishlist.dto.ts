import { IsString, IsUrl, MaxLength } from 'class-validator';
export class CreateWishlistDto {
    @IsString()
    name: string;
    @MaxLength(1500)
    @IsString()
    description: string;
  
    @IsUrl()
    image: string;
  
    itemsId: number[];
}
