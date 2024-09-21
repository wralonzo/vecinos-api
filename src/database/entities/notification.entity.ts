import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserData } from "src/database/entities";

@Entity("NotificationData")
export class NotificationData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  Message!: string;

  @Column({ nullable: false })
  UserId!: number;

  @ManyToOne(() => UserData, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: "UserId" })
  User!: UserData;

  @Column({ type: "boolean", default: false })
  Viewed!: boolean;

  @Column({ type: "boolean", default: false })
  Deleted!: boolean;

  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  CreatedAt!: Date;

  @UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  UpdatedAt!: Date;
}
