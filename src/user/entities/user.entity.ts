/* eslint-disable prettier/prettier */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Onboarding } from './onoard.entity';
import { ProfileImage } from './profile.entity';
import { Settings } from './setting.entity';
import { ResponseEntity } from './response.entity';
import { PromptEntity } from './reponse_prompt.entity';
// import { ProfileBg } from './profile-bg.entity';
// import { ProfileImage } from './profile-image.entity';
// import { File } from 'src/files/entities/file.entity';


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable : true, type : 'varchar'})
    full_name?: string;

    @Column({ type: 'varchar', length: 140, unique : true, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false  })
    password: string;

//     @BeforeInsert()
//     async hashPassword(){
//       this.password = await bcrypt.hash(this.password, 10);        
//    }

    @Column({type: 'varchar', nullable : true})
    country?: string;

    @Column({type: 'varchar', nullable : true})
    state?: string;

    @Column({type: 'varchar', nullable : true})
    rememberToken?: string;
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER, nullable: false 
    })
    role: UserRole

    @OneToOne(() => Onboarding, { cascade: true, nullable: true })
    @JoinColumn()
    onboard_info?: Onboarding;

    @OneToOne(() => ProfileImage, { cascade: true , nullable: true})
    @JoinColumn()
    profile_image?: ProfileImage;

    @OneToOne(() => Settings, { cascade: true, nullable: true })
    @JoinColumn()
    settings?: Settings;

    // @OneToMany(() => ResponseEntity, (response) => response.user, { cascade: true })
    // responses?: ResponseEntity[];

    @OneToMany(() => ResponseEntity, (caption_responses) => caption_responses.user, { cascade: true })
    caption_responses?: ResponseEntity[];

    @OneToMany(() => PromptEntity, (prompt_responses) => prompt_responses.user, { cascade: true })
    prompt_responses?: PromptEntity[];

    // @OneToMany(() => ResponseEntity, (response) => response.user)
    // responses: ResponseEntity[];
    // @OneToMany(() => File, file => file.user, { cascade: true })
    // files?: File[];

    constructor(user :Partial<User>){
        Object.assign(this, user)
    }
   
}


// @OneToMany(() => ResponseEntity, (caption_responses) => caption_responses.user, { cascade: true })
// caption_responses?: ResponseEntity[];


// @OneToMany(() => PromptEntity, (prompt_responses) => prompt_responses.user, { cascade: true })
// prompt_responses?: PromptEntity[];