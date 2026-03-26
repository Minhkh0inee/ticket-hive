import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch'; 
import { ElasticService } from './elasticsearch.service';
import { ELASTIC_CLIENT } from './elasticsearch.constant';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ELASTIC_CLIENT,
      useFactory: (config: ConfigService) => {
        const nodeUrl = config.get<string>('ELASTICSEARCH_NODE');
        
        if (!nodeUrl) {
           console.warn('⚠️ ELASTICSEARCH_NODE not found, falling back to local. This will fail on Railway!');
        }

        return new Client({
          node: nodeUrl ?? 'http://elasticsearch:9200',
          ssl: {
            rejectUnauthorized: false, 
          },
        });
      },
      inject: [ConfigService],
    },
    ElasticService,
  ],
  exports: [ElasticService],
})
export class ElasticModule {}