/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from './abstract.entity';


@Entity()
export class ProductImage extends AbstractFileEntity<ProductImage> {
    
}