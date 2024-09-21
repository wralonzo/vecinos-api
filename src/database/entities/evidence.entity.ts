import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ForumData } from "src/database/entities";

@Entity("EvidenceData")
export class EvidenceData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  FileName!: string;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  CreatedAt!: Date;

  @ManyToOne(() => ForumData, (forum) => forum.Id, { nullable: true })
  @JoinColumn({ name: "ForumId" })
  Forum!: number;

  @Column({ nullable: false })
  ForumId!: number;
}
