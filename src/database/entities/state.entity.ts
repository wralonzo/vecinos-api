import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IncidentData } from "src/database/entities";

@Entity("StateData")
export class StateData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  Description!: string;

  @Column({ default: () => "CURRENT_TIMESTAMP", nullable: false })
  CreatedAt!: Date;

  @OneToMany(() => IncidentData, (incident) => incident.Status, { nullable: true })
  Incidents?: Array<IncidentData>;
}
