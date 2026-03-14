import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEventsTable1773501220590 implements MigrationInterface {
    name = 'CreateEventsTable1773501220590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'confirmed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "seatIds" text NOT NULL, "attendeeName" character varying NOT NULL, "attendeeEmail" character varying NOT NULL, "attendeePhone" character varying NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT 'pending', "userId" uuid, "eventId" uuid, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."seat_section_enum" AS ENUM('floor', 'balcony', 'vip', 'general')`);
        await queryRunner.query(`CREATE TYPE "public"."seat_status_enum" AS ENUM('available', 'booked')`);
        await queryRunner.query(`CREATE TABLE "seat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "row" character varying(5) NOT NULL, "number" integer NOT NULL, "label" character varying(10) NOT NULL, "section" "public"."seat_section_enum" NOT NULL, "status" "public"."seat_status_enum" NOT NULL DEFAULT 'available', "priceModifier" numeric(3,2) NOT NULL DEFAULT '1', "eventId" uuid, CONSTRAINT "PK_4e72ae40c3fbd7711ccb380ac17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_161ef84a823b75f741862a77138" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seat" ADD CONSTRAINT "FK_6f9180da82fbdeb46141993f679" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seat" DROP CONSTRAINT "FK_6f9180da82fbdeb46141993f679"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_161ef84a823b75f741862a77138"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`DROP TABLE "seat"`);
        await queryRunner.query(`DROP TYPE "public"."seat_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."seat_section_enum"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}
