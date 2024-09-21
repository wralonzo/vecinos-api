import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EvidenceData, UserData } from "src/database/entities";

@Entity("ForumData")
export class ForumData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Title!: string;

  @Column({ nullable: false })
  Description!: string;

  @Column({ nullable: false })
  AuthorId!: number;

  @ManyToOne(() => UserData, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: "AuthorId" })
  Author!: UserData;

  @Column({ nullable: true })
  CreatedAt!: Date;

  @Column({ nullable: true })
  UpdatedAt!: Date;

  @Column("bool", { default: true })
  IsEnabled?: boolean;

  @OneToMany(() => EvidenceData, (evidence) => evidence.Forum, { nullable: true })
  Evidences?: Array<EvidenceData>;
}
