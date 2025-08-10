import { Module } from '@nestjs/common';
import { ReviewService } from './review/review.service';
import { ReviewController } from './review/review.controller';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController]
})
export class ReviewModule {}
