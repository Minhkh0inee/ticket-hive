import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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

    @UseGuards(PaymentWebhookGuard)
    @Post('webhook')
    async handleWebhook(@Req() req: any) {
        return req.webhookData;
    }
}
