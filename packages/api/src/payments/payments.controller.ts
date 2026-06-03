import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentWebhookGuard } from 'src/common/guards/payment.guard';
import { WebhookPayosBody } from './dto/webhook.dto';
import { Throttle } from '@nestjs/throttler';
import { RolesGuard } from 'src/common/guards/role.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/common/decorator/role.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

interface WebhookRequest extends Request {
  webhookData: { success: boolean; data: WebhookPayosBody };
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPaymentLink(@Body() paymentsDto: CreatePaymentDto) {
    return await this.paymentsService.createPaymentLink(paymentsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getPayments(@Query() paginationDto: PaginationDto) {
    return await this.paymentsService.getPayments(paginationDto);
  }

  @Get(':orderCode')
  async getPaymentInfo(@Param('orderCode', ParseIntPipe) orderCode: number) {
    return this.paymentsService.getPaymentInfo(orderCode);
  }

  @Delete(':orderCode')
  async cancelPayment(
    @Param('orderCode', ParseIntPipe) orderCode: number,
    @Query('reason') reason?: string,
  ) {
    return this.paymentsService.cancelPayment(orderCode, reason);
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseGuards(PaymentWebhookGuard)
  @Post('webhook')
  async handleWebhook(@Req() req: WebhookRequest) {
    await this.paymentsService.handlePaymentWebhook(req.webhookData);
    return { success: true };
  }

  @Post('confirm-webhook')
  async confirmWebhook(@Body('webhookUrl') webhookUrl: string) {
    return this.paymentsService.confirmWebhook(webhookUrl);
  }
}
