import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentWebhookGuard } from 'src/common/guards/payment.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPaymentLink(
        @Body() paymentsDto: CreatePaymentDto
    ) {
        return await this.paymentsService.createPaymentLink(paymentsDto);
    }

    @Get(':orderCode')
    async getPaymentInfo(
        @Param('orderCode', ParseIntPipe) orderCode: number,
    ) {
        return this.paymentsService.getPaymentInfo(orderCode);
    }

    @Delete(':orderCode')
    async cancelPayment(
        @Param('orderCode', ParseIntPipe) orderCode: number,
        @Query('reason') reason?: string,
    ) {
        return this.paymentsService.cancelPayment(orderCode, reason);
    }

    @UseGuards(PaymentWebhookGuard)
    @Post('webhook')
    async handleWebhook(@Req() req: any) {
    this.paymentsService.handlePaymentWebhook(req.webhookData).catch((err) =>
        console.error('Webhook handler error:', err),
    );

  return { success: true };
}

    @Post('confirm-webhook')
    async confirmWebhook(@Body('webhookUrl') webhookUrl: string) {
        return this.paymentsService.confirmWebhook(webhookUrl);
    }
}
