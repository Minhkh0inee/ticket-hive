import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTable1773500404049 implements MigrationInterface {
  name = 'CreateEventTable1773500404049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_category_enum" AS ENUM('music', 'sports', 'theatre', 'festival', 'conference')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(200) NOT NULL, "description" character varying NOT NULL, "venue" character varying(200) NOT NULL, "city" character varying(100) NOT NULL, "category" "public"."event_category_enum" NOT NULL, "eventDate" TIMESTAMP WITH TIME ZONE NOT NULL, "bannerUrl" character varying, "totalSeats" integer NOT NULL, "availableSeats" integer NOT NULL, "basePrice" numeric(10,2) NOT NULL, "organizerId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0" FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TYPE "public"."event_category_enum"`);
  }
}
