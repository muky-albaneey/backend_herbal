import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Product{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable : false, length: 190, type: 'varchar'})
    name: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    price: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    quantity: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    type : string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    constructor(product :Partial<Product>){
        Object.assign(this, product)
    }
}   