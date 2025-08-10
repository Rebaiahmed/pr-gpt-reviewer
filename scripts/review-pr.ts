// scripts/review-pr.ts
import 'dotenv/config';
import { ReviewService } from '../src/review/review/review.service';

const main = async () => {
  const [owner, repo, pr, token] = process.argv.slice(2);
  if (!owner || !repo || !pr || !token) {
    console.error('Usage: review-pr <owner> <repo> <prNumber> <githubToken>');
    process.exit(1);
  }

  const svc = new ReviewService({ get: (k: string) => process.env[k] } as any);
  const review = await svc.reviewPR(owner, repo, Number(pr), token);
  console.log(review);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
