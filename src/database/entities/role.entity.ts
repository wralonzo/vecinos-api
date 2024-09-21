import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("RoleData")
export class RoleData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Description!: string;

  @Column({ nullable: true })
  CreatedAt!: Date;
}
