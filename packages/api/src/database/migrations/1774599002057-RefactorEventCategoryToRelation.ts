import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorEventCategoryToRelation1774599002057 implements MigrationInterface {
    name = 'RefactorEventCategoryToRelation1774599002057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "category" TO "categoryId"`);
        await queryRunner.query(`ALTER TYPE "public"."event_category_enum" RENAME TO "event_categoryid_enum"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_d44e52c4ca04619ef9b61a11982" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_d44e52c4ca04619ef9b61a11982"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "categoryId" "public"."event_categoryid_enum" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."event_categoryid_enum" RENAME TO "event_category_enum"`);
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "categoryId" TO "category"`);
    }

}
