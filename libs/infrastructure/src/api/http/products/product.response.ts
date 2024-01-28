import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  constructor(props: ProductResponse) {
    this.id = props.id;
    this.created_at = props.created_at;
  }
}
