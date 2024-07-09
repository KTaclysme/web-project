import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BullMQService } from './bullmq.service';

@Processor('messages')
export class MessageProcessor extends WorkerHost {
  constructor(private readonly bullMQService: BullMQService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    await this.bullMQService.handleMessageJob(job);
  }
}