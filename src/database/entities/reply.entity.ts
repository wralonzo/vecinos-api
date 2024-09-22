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

  @Column({ nullable: false })
  AuthorId!: number;

  @Column({ nullable: true, type: "varchar", length: "100" })
  Filename?: string;

  @Column({ nullable: true })
  CreatedAt!: Date;

  @Column({ nullable: true })
  UpdatedAt!: Date;

  @ManyToOne(() => UserData, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: "AuthorId"})
  Author!: UserData;

  @ManyToOne(() => ForumData, (forum) => forum.Id, { nullable: true })
  @JoinColumn({ name: "ForumId" })
  Forum!: ForumData;

  @ManyToOne(() => ReplyData, (reply) => reply.Id, { nullable: true })
  @JoinColumn({ name: "ParentReplyId" })
  ParentReply?: number;

  @Column("bool", { default: true })
  IsEnabled?: boolean;
}
