// /* eslint-disable prettier/prettier */
// import { Entity, OneToOne, JoinColumn } from 'typeorm';
// import { AbstractFileEntity } from './abstract.entity';
// import { Product } from './product.entity';

// @Entity()
// export class ProductImage extends AbstractFileEntity<ProductImage> {
//     @OneToOne(() => Product)
//     @JoinColumn()
//     product: Product;  // One-to-One relationship with Product
// }
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
