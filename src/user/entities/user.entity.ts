// /* eslint-disable prettier/prettier */

// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     OneToOne,
//     JoinColumn,
//     BeforeInsert,
//     OneToMany
// } from 'typeorm';
// import { Onboarding } from './onoard.entity';
// import { ProfileImage } from './profile.entity';
// import { Settings } from './setting.entity';
// import { ResponseEntity } from './response.entity';
// import { PromptEntity } from './reponse_prompt.entity';
// import { Product } from './product.entity';



// export enum UserRole {
//     ADMIN = "admin",
//     USER = "user",
// }


// @Entity()
// export class User {
//     @PrimaryGeneratedColumn("uuid")
//     id: number;

//     @Column({nullable : true, type : 'varchar'})
//     full_name?: string;

//     @Column({ type: 'varchar', length: 140, unique : true, nullable: false })
//     email: string;

//     @Column({ type: 'varchar', length: 140, unique : true, nullable: false })
//     phone_num: string;

//     @Column({ type: 'varchar', nullable: false  })
//     password: string;

//     @Column({type: 'varchar', nullable : true})
//     location?: string;


//     @Column({type: 'varchar', nullable : true})
//     rememberToken?: string;
//     @Column({
//         type: "enum",
//         enum: UserRole,
//         default: UserRole.USER, nullable: false 
//     })
//     role: UserRole


//     @OneToOne(() => ProfileImage, { cascade: true , nullable: true})
//     @JoinColumn()
//     profile_image?: ProfileImage;

//     @OneToOne(() => Product, { cascade: true , nullable: true})
//     @JoinColumn()
//     product?: Product;

//     constructor(user :Partial<User>){
//         Object.assign(this, user)
//     }
   
// }
/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { ProfileImage } from './profile.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: true, type: 'varchar' })
    full_name?: string;

    @Column({ type: 'varchar', length: 140, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 140, unique: true, nullable: true })
    phone_num?: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    rememberToken?: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER, nullable: false
    })
    role: UserRole;

    @OneToOne(() => ProfileImage, { cascade: true, nullable: true })
    @JoinColumn()
    profile_image?: ProfileImage;

    @OneToMany(() => Product, product => product.user)
    products: Product[];  // One user can have multiple products

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]; // User's order history

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
