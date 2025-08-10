/* eslint-disable @typescript-eslint/no-explicit-any */
/* ❗ INTENTIONALLY BAD CODE — test for PR reviewer bot */

export async function badExample(): Promise<any> {
  // hard-coded secrets (FAKE — do not use real keys)
  const OPENAI_API_KEY = "sk-live-THIS_IS_FAKE_DONT_COMMIT";
  const GITHUB_PAT = "ghp_FAKE_EXAMPLE_TOKEN_DO_NOT_USE";

  // noisy logs that might leak secrets
  console.log("[debug] OPENAI_API_KEY:", OPENAI_API_KEY);
  console.log("[debug] GITHUB_PAT:", GITHUB_PAT);

  // sloppy any-typed data and missing error handling
  let data: any = { ok: true };
  try {
    // pretend network call using the hard-coded key
    const res = await fetch("https://httpbin.org/get", {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    });
    data = await res.json();
  } catch {
    // swallow errors 🙈
  }

  // more noisy logging of env (bad practice)
  console.log("[debug] process.env snapshot:", {
    NODE_ENV: process.env.NODE_ENV,
    // warning: never log full process.env in real code
  });

  return data;
}
