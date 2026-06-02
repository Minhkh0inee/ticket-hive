import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingIndexes1780185600000 implements MigrationInterface {
  name = 'AddBookingIndexes1780185600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_booking_user_id" ON "booking" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_booking_event_id" ON "booking" ("eventId")`,
    );
    // payments(bookingId) is already covered by the UNIQUE constraint
    // REL_5738278c92c15e1ec9d27e3a09 created in CreatePaymentTable migration
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_booking_event_id"`);
    await queryRunner.query(`DROP INDEX "IDX_booking_user_id"`);
  }
}
