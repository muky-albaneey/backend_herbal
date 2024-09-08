import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Onboarding{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable : true, length: 190, type: 'varchar'})
    marketing_objectives?: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    target_audience: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    campaigns: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    social_media_business : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    info_caption: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    marketing_challenges: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    marketing_or_sales: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    dashoard_roles: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    members_dashoard: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    current_workflow: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    type_of_support : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    recommend_dashboard : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    immediate_questions  : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    personalized_training  : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    about_new_features : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    contact_information : string;


    constructor(onboard :Partial<Onboarding>){
        Object.assign(this, onboard)
    }
}   