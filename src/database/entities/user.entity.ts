import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ForumData, IncidentData, NotificationData, Valoracion } from "src/database/entities";

@Entity("UserData")
export class UserData {
  @PrimaryGeneratedColumn()
  Id!: number;

  @Column({ nullable: false })
  DisplayName!: string;

  @Column({ unique: true, nullable: false })
  Email!: string;

  @Column({ nullable: false, default: 2 })
  Role!: number;

  @Column({ nullable: false })
  Password!: string;

  @Column({ nullable: true })
  CreatedAt!: Date;

  @Column({ nullable: false, default: true })
  Enabled!: boolean;

  @Column({ default: () => null, nullable: true })
  LockedDate!: Date;

  @OneToMany(() => ForumData, (forum) => forum.Author, { nullable: true })
  Forums?: Array<ForumData>;

  @OneToMany(() => IncidentData, (incident) => incident.Author, { nullable: true })
  Incidents?: Array<IncidentData>;

  @OneToMany(() => NotificationData, (notification) => notification.User)
  Notifications?: Array<NotificationData>;

  @OneToMany(() => Valoracion, (ask) => ask.idUserFk, { nullable: true })
  idUserFk?: Array<Valoracion>;
}
