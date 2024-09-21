import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ForumData, UserData } from "src/database/entities";

@Entity("ReplyData")
export class ReplyData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Description!: string;

  @Column({ nullable: false })
  ForumId!: number;

  @Column({ nullable: true, type: "varchar", length: "100" })
  Filename?: string;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  CreatedAt!: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  UpdatedAt!: Date;

  @ManyToOne(() => UserData, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: "AuthorId" })
  Author!: number;

  @ManyToOne(() => ForumData, (forum) => forum.Id, { nullable: true })
  @JoinColumn({ name: "ForumId" })
  Forum!: ForumData;

  @ManyToOne(() => ReplyData, (reply) => reply.Id, { nullable: true })
  @JoinColumn({ name: "ParentReplyId" })
  ParentReply?: number;

  @Column("bool", { default: true })
  IsEnabled?: boolean;
}
