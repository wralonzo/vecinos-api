import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("RoleData")
export class RoleData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Description!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  CreatedAt!: Date;
}
