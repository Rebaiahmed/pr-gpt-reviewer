/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {

 constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async review(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('pr') prNumber: string,
    @Query('token') token: string,
  ) {
    const num = Number(prNumber);
    if (!owner || !repo || !num || !token) {
      return {
        error:
          'Missing required query params: owner, repo, pr, token',
      };
    }
    const result = await this.reviewService.reviewPR(owner, repo, num, token);
    return { result };
  }
}
