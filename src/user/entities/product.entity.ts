// import { OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { ProductImage } from './product_img.entity';


// @Entity()
// export class Product{
//     @PrimaryGeneratedColumn("uuid")
//     id: number;

//     @Column({nullable : false, length: 190, type: 'varchar'})
//     name: string;

//     @Column({ type: 'varchar', length: 190, nullable: false })
//     price: string;

//     @Column({ type: 'varchar', length: 190, nullable: false  })
//     quantity: string;

//     @Column({ type: 'varchar', length: 190, nullable: false  })
//     category : string;

//     @Column({ type: 'varchar', length: 190, nullable: false  })
//     description : string;

//     @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     createdAt: Date;

//     @OneToOne(() => ProductImage, { cascade: true , nullable: true})
//     @JoinColumn()
//     product_image?: ProductImage;

//     constructor(product :Partial<Product>){
//         Object.assign(this, product)
//     }
// }   
/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ProductImage } from './product_img.entity';
import { User } from './user.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: false, length: 190, type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    price: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    quantity: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    category: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToOne(() => ProductImage, { cascade: true, nullable: true })
    @JoinColumn()
    product_image?: ProductImage;

    @ManyToOne(() => User, user => user.products)
    user: User;  // Many products can belong to one user

    constructor(product: Partial<Product>) {
        Object.assign(this, product);
    }
}
