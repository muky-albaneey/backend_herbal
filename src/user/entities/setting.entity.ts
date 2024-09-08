import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Settings{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable : true, length: 190, type: 'varchar'})
    firstname?: string;

    @Column({ type: 'varchar', length: 190, nullable: true })
    lastname: string;

    @Column({ type: 'varchar', length: 190, nullable: true  })
    email: string;

    @Column({ type: 'varchar', length: 190, nullable: true  })
    username : string;

    @Column({ type: 'varchar', length: 190, nullable: true  })
    location: string;

    


    constructor(setting :Partial<Settings>){
        Object.assign(this, setting)
    }
}   