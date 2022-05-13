import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

@Entity('donation_hitory')
export class DonationHistory extends BaseEntity {
    @Column({ nullable: false })
    from: string;
    @Column({ nullable: false })
    to: string;
    @Column({ nullable: false })
    campaignId: number;
    @Column({ nullable: true })
    currency: string;
    @Column({ nullable: false })
    amount: number;
    @Column({ nullable: false, default: false })
    success: boolean;
}
