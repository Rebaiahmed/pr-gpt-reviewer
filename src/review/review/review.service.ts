/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ReviewService {

 private openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('OPENAI_API_KEY') || process.env.OPENAI_API_KEY;
     if (!key) {
      throw new Error('OPENAI_API_KEY is not set. Add it to .env or your environment.');
    }
    this.openai = new OpenAI({ apiKey: key });
  }

  // eslint-disable-next-line prettier/prettier
  private async getPRDiff(owner: string, repo: string, prNumber: number, token: string) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      },
    );
    if (!res.ok) {
      throw new Error(`GitHub diff fetch failed: ${res.status} ${res.statusText}`);
    }
    return res.text();
  }

  async reviewPR(owner: string, repo: string, prNumber: number, token: string) {
    const diff = await this.getPRDiff(owner, repo, prNumber, token);

    // (optional) guard huge diffs
    const MAX_CHARS = 180_000; // ~90k tokens-ish safety
    const trimmed = diff.length > MAX_CHARS ? diff.slice(0, MAX_CHARS) : diff;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior engineer. Produce a crisp PR summary and actionable review. If security/perf issues are present, call them out.',
        },
        {
          role: 'user',
          content:
            `PR diff:\n\n${trimmed}\n\n` +
            `Please respond as:\n` +
            `## Summary\n- ...\n\n## Review\n- Strengths\n- Risks\n- Suggestions (with code snippets if helpful)\n\n## Breaking Changes\n- ...\n`,
        },
      ],
    });

    return completion.choices[0].message.content ?? 'No content returned.';
  }



}
