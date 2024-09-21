import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StateData, UserData } from "src/database/entities";

@Entity("EventData")
export class EventData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Title!: string;

  @Column({ nullable: false })
  Description!: string;

  @Column({ nullable: false })
  AuthorId!: number;

  @Column({ nullable: false, default: 1 })
  StateId!: number;

  @ManyToOne(() => UserData, (user) => user.Id, { nullable: true })
  @JoinColumn({ name: "AuthorId" })
  Author!: UserData;

  @ManyToOne(() => StateData, (state) => state.Id, { nullable: true })
  @JoinColumn({ name: "StateId" })
  Status!: StateData;

  @CreateDateColumn({ nullable: true })
  CreatedAt!: Date;

  @UpdateDateColumn({ nullable: true })
  UpdatedAt!: Date;

  @Column({ type: "datetime", nullable: false })
  EventAt!: Date;
}
