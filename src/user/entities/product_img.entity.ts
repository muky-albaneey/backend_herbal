import { Entity, OneToOne, Column, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;  // Store the URL of the uploaded file

  @Column()
  ext: string;  // Store the file extension


  @OneToOne(() => Product)
      @JoinColumn()
      product: Product;  // One-to-One relationship with Product
}
