# pr-gpt-reviewer

AI-powered PR summaries & code review comments using **NestJS**, **GitHub Actions**, and **OpenAI**.

[![CI](https://github.com/Rebaiahmed/pr-gpt-reviewer/actions/workflows/pr-review.yml/badge.svg)](https://github.com/Rebaiahmed/pr-gpt-reviewer/actions/workflows/pr-review.yml)
![Node](https://img.shields.io/badge/node-%E2%89%A520.0-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-ED2945?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Why?

Save reviewer time. On each pull request, this bot fetches the diff, asks OpenAI for a concise summary + actionable feedback, and posts (or returns) the results.

---

## How it works

1. **Trigger**: A PR is opened/synchronized.
2. **Fetch diff**: The bot calls the GitHub API for the PR `.diff`.
3. **Review**: The diff is sent to OpenAI with a structured prompt.
4. **Output**: Summary + suggestions are posted as a PR comment (CI) or returned from the API (local).

---

## Features

- 🔎 PR change **summary** + **review suggestions**
- ⚙️ **GET API**: `GET /api/review/:pr`
- 🤖 **GitHub Action** posts comments automatically
- 🔐 Env-based fallbacks (`GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `GITHUB_TOKEN`)
- 🧪 Easy local testing via `curl` or Postman

---

## Prerequisites

- Node.js **18+** (Node 20 recommended)
- A GitHub repository with at least one PR
- OpenAI API key (`sk-...`)
- (Local only) A GitHub Personal Access Token (PAT) with:
  - **Pull requests: Read**
  - **Contents: Read**
  - (If posting comments locally) **Issues: Read & write**

---

## Setup

### 1) Install & run

```bash
npm install
npm run start:dev
