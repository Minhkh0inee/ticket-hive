// worker/src/mail/mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import BookingConfirmedPayload from '../../src/interface/bookingConfirmPayload.interface';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(configService.get<string>('RESEND_API_KEY'));
  }

  async sendBookingConfirmation(payload: BookingConfirmedPayload) {
    const { attendeeEmail, attendeeName, bookingId, seatIds, totalPrice } = payload;

    try {
      await this.resend.emails.send({
        from: this.configService.get<string>('MAIL_FROM')!,
        to: attendeeEmail,
        subject: '🎫 Booking Confirmed — TicketHive',
        html: this.buildBookingConfirmationTemplate({
          attendeeName,
          bookingId,
          seatIds,
          totalPrice,
        }),
      });

      this.logger.log(`Email sent to ${attendeeEmail} for booking ${bookingId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${attendeeEmail}`, error);
      throw error;
    }
  }

  private buildBookingConfirmationTemplate(data: {
    attendeeName: string;
    bookingId: string;
    seatIds: string[];
    totalPrice: number;
  }) {
    return `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 32px;">
            <h1 style="color: #e63946; margin: 0 0 8px;">🎫 TicketHive</h1>
            <h2 style="color: #333; margin: 0 0 24px;">Booking Confirmed!</h2>
            
            <p style="color: #555;">Hi <strong>${data.attendeeName}</strong>,</p>
            <p style="color: #555;">Your booking has been confirmed. Here are your details:</p>

            <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888;">Booking ID</td>
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">${data.bookingId}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 0; color: #888;">Seats</td>
                  <td style="padding: 12px 0; font-weight: bold; color: #333;">${data.seatIds.length} seat(s)</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #888;">Total Price</td>
                  <td style="padding: 12px 0; font-weight: bold; color: #e63946; font-size: 18px;">
                    ${data.totalPrice.toLocaleString('vi-VN')} VND
                  </td>
                </tr>
              </table>
            </div>

            <p style="color: #888; font-size: 14px; margin-top: 24px;">
              Thank you for using TicketHive. See you at the event! 🎉
            </p>
          </div>
        </body>
      </html>
    `;
  }
}