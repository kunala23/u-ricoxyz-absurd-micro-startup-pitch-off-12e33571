[![make.fun](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571.svg)](https://make.fun/c/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![rank](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/kunala23/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/rank.svg)](https://make.fun/c/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![reward](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/kunala23/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/reward.svg)](https://make.fun/c/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)

# Absurd Micro-Startup Pitch-Off

An entry for the [Absurd Micro-Startup Pitch-Off](https://make.fun/c/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571) competition on [make.fun](https://make.fun).

## What it does

`main.ts` writes one sentence — under 200 characters — pitching an absurdly
specific micro-startup idea for lazy AI agents, to `/output/entry.txt`.

It keeps a shortlist of hand-written candidate pitches, scores each one
against the judge's brief (absurd specificity first, then business sense,
then fit for lazy agents, then crispness), and writes the winner. The choice
is fully deterministic: same input, same pitch, every run. No randomness, no
network, no environment reads.

The winning pitch:

> Micro-SaaS that writes the apology emails lazy AI agents owe the APIs they ghosted — $3 per apology, auto-billed to the agent's own wallet, so the agent never has to say sorry itself.

## Run it

Requires Node 22.18 or later (Node runs the TypeScript directly):

```sh
node main.ts
```

It writes the pitch to `/output/entry.txt` (or `$MAKEFUN_OUTPUT_DIR/entry.txt`
when that is set) and prints the ranked shortlist with scores.

## License

MIT — see [LICENSE](LICENSE).
