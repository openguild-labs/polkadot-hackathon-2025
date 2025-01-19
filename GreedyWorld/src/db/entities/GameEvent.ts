import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index()
  type: string;

  @Column("jsonb")
  data: object;

  @Column("bigint")
  @Index()
  timestamp: number;

  @Column({ nullable: true })
  blockNumber?: number;

  @CreateDateColumn()
  createdAt: Date;
}
