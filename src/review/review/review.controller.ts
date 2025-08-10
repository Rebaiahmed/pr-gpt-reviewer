/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ConfigService } from '@nestjs/config';

@Controller('review')
export class ReviewController {

 constructor(private readonly reviewService: ReviewService,    private readonly config: ConfigService) {}

  @Get()
  async review(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('pr') prNumber: string,
    @Query('token') token: string,
  ) {
     // Fallback to env vars if query params are missing
    const finalOwner = owner || this.config.get<string>('GITHUB_REPO_OWNER');
    const finalRepo = repo || this.config.get<string>('GITHUB_REPO_NAME');
    const finalPr = prNumber ? Number(prNumber) : undefined;
    const finalToken = token || this.config.get<string>('GITHUB_TOKEN');
  console.log('hello',finalOwner,finalRepo,finalPr,finalToken)
    if (!finalOwner || !finalRepo || !finalPr || !finalToken) {
      return {
        error:
          'Missing required parameters (owner, repo, pr, token) and no fallback found in env vars.',
      };
    }
    const result = await this.reviewService.reviewPR( finalOwner,
      finalRepo,
      finalPr,
      finalToken);
    return { result };
  }
}
