/* eslint-disable prettier/prettier */
// scripts/review-pr.ts
import 'dotenv/config';
import { ReviewService } from '../src/review/review/review.service'; // keep your current path

async function postPRReview(owner: string, repo: string, pr: number, token: string, body: string, event: 'COMMENT'|'APPROVE'|'REQUEST_CHANGES'='COMMENT') {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr}/reviews`, {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'pr-gpt-reviewer'
    },
    body: JSON.stringify({ body, event })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post PR review: ${res.status} ${res.statusText} :: ${text}`);
  }
}

(async () => {
  const [owner, repo, prStr, token] = process.argv.slice(2);
  const pr = Number(prStr);
  if (!owner || !repo || !Number.isFinite(pr) || !token) {
    console.error('Usage: review-pr <owner> <repo> <prNumber> <githubToken>');
    process.exit(1);
  }

  const svc = new ReviewService({ get: (k: string) => process.env[k] } as any);
  const review = await svc.reviewPR(owner, repo, pr, token);

  const body = `### 🤖 PR Review (pr-gpt-reviewer)\n\n${review}\n`;
  console.log('--- Review ---\n' + body);

  if (process.env.NO_COMMENT === 'true') process.exit(0);

  await postPRReview(owner, repo, pr, token, body, process.env.REVIEW_EVENT as any || 'COMMENT');
  console.log('Review posted to PR #' + pr);
})().catch((err) => {
  console.error(err);
  console.error('\nTip: For forked PRs, use `pull_request_target` and add job permissions, or a PAT with proper scopes.');
  process.exit(1);
});
