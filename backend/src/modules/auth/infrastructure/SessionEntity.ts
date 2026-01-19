import { UserEntity } from "@modules/users";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuthSession } from "../domain";

@Entity("auth_sessions")
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ type: "varchar", length: 255, name: "refresh_token_hash" })
  refreshTokenHash: string;

  @Column({ type: "timestamp", name: "expires_at" })
  expiresAt: Date;

  @Column({ type: "timestamp", name: "revoked_at", nullable: true })
  revokedAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  toDomain(): AuthSession {
    return {
      id: this.id,
      userId: this.userId,
      refreshTokenHash: this.refreshTokenHash,
      expiresAt: this.expiresAt,
      revokedAt: this.revokedAt,
      createdAt: this.createdAt,
    };
  }
}
