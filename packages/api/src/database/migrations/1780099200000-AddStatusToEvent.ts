import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToEvent1780099200000 implements MigrationInterface {
  name = 'AddStatusToEvent1780099200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_status_enum" AS ENUM('upcoming', 'sold_out', 'ongoing', 'ended', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD "status" "public"."event_status_enum" NOT NULL DEFAULT 'upcoming'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
  }
}
