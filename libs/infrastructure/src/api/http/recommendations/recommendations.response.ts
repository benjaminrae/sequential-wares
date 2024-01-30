import { ApiProperty } from '@nestjs/swagger';

export class RecommendationsResponse {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: [String] })
  original_products: string[];

  @ApiProperty({ type: [[String]] })
  recommended_products: string[][];

  constructor(props: RecommendationsResponse) {
    this.id = props.id;
    this.created_at = props.created_at;
    this.original_products = props.original_products;
    this.recommended_products = props.recommended_products;
  }
}
