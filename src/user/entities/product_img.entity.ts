/* eslint-disable prettier/prettier */
import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { AbstractFileEntity } from './abstract.entity';
import { Product } from './product.entity';

@Entity()
export class ProductImage extends AbstractFileEntity<ProductImage> {
    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;  // One-to-One relationship with Product
}
