import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Valoracion } from "./valoracion.entity";

@Entity("ask")
export class Ask {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  name!: string;

  @CreateDateColumn({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt!: Date;

  @OneToMany(() => Valoracion, (ask) => ask.askFk, { nullable: true })
  askFk?: Array<Valoracion>;
}
