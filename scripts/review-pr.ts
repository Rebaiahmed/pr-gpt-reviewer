/* eslint-disable prettier/prettier */
// scripts/review-pr.ts
import 'dotenv/config';
import { ReviewService } from '../src/review/review/review.service';

// tiny helper to post a PR comment
async function postPRComment(owner: string, repo: string, pr: number, token: string, body: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${pr}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'pr-gpt-reviewer'
    },
    body: JSON.stringify({ body })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post PR comment: ${res.status} ${res.statusText} :: ${text}`);
  }
}

(async () => {
  const [owner, repo, prStr, token] = process.argv.slice(2);
  const pr = Number(prStr);
  if (!owner || !repo || !Number.isFinite(pr) || !token) {
    console.error('Usage: review-pr <owner> <repo> <prNumber> <githubToken>');
    process.exit(1);
  }

  // minimal ConfigService shim
  const svc = new ReviewService({ get: (k: string) => process.env[k] } as any);

  const review = await svc.reviewPR(owner, repo, pr, token);
  console.log('--- Review ---\n' + review);

  // skip posting if explicitly disabled
  if (process.env.NO_COMMENT === 'true') process.exit(0);

  // Add a small header so it's recognizable in the PR UI
  const body = `### 🤖 PR Review (pr-gpt-reviewer)\n\n${review}`;
  await postPRComment(owner, repo, pr, token, body);
  console.log('Comment posted to PR #' + pr);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
