export class ProductResponse {
  id: string;
  created_at: Date;

  constructor(props: ProductResponse) {
    this.id = props.id;
    this.created_at = props.created_at;
  }
}
