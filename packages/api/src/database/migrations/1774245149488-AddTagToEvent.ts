import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagToEvent1774245149488 implements MigrationInterface {
  name = 'AddTagToEvent1774245149488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_tag_enum" AS ENUM('trending', 'special', 'featured', 'new')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD "tag" "public"."event_tag_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "tag"`);
    await queryRunner.query(`DROP TYPE "public"."event_tag_enum"`);
  }
}
