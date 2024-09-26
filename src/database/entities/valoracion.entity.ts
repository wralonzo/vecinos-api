import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ask, UserData } from "src/database/entities";

@Entity("valoracion")
export class Valoracion {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  answer!: string;

  @Column({ nullable: false })
  askId!: number;

  @Column({ nullable: false })
  idUser!: number;

  @CreateDateColumn({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Ask, (ask) => ask.askFk, { nullable: true })
  @JoinColumn({ name: "askId" })
  askFk!: Ask;

  @ManyToOne(() => UserData, (user) => user.idUserFk, { nullable: true })
  @JoinColumn({ name: "idUser" })
  idUserFk!: UserData;
}
