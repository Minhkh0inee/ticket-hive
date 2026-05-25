import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentTable1776782885118 implements MigrationInterface {
  name = 'CreatePaymentTable1776782885118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderCode" bigint NOT NULL, "amount" numeric(10,2) NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "paymentLinkId" character varying, "checkoutUrl" character varying, "bookingId" uuid NOT NULL, CONSTRAINT "UQ_a19117689f1569f622cc7acd853" UNIQUE ("orderCode"), CONSTRAINT "REL_5738278c92c15e1ec9d27e3a09" UNIQUE ("bookingId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f9180da82fbdeb46141993f67" ON "seat" ("eventId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_150b22121790781fc107c8bc1b" ON "event" ("eventDate") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2b524dda39a0b8debe43131a7a" ON "event" ("tag") `,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2b524dda39a0b8debe43131a7a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_150b22121790781fc107c8bc1b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f9180da82fbdeb46141993f67"`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
  }
}
