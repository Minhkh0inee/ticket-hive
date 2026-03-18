// src/elasticsearch/elasticsearch.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { ElasticService } from './elasticsearch.service';
import { ELASTIC_CLIENT } from './elasticsearch.constant';



@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ELASTIC_CLIENT,
      useFactory: (config: ConfigService) => {
        return new Client({
          node: config.get<string>('ELASTICSEARCH_NODE') ?? 'http://elasticsearch:9200',
        });
      },
      inject: [ConfigService],
    },
    ElasticService,
  ],
  exports: [ElasticService],
})
export class ElasticModule {}