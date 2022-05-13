import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('campaign')
export class Campaign extends BaseEntity {
    @Column({ nullable: false })
    name: string;
    @Column({ nullable: false })
    description: string;
    @Column({ nullable: false })
    goal: number;
    @Column({ nullable: false })
    coverImgUrl: string;
    @Column({ nullable: false })
    type: String;
    @Column({ nullable: false })
    wallets: string;
    @Column({ nullable: false })
    total: number;

}
