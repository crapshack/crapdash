import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { discoverBuildMetadata } from "@/lib/build-metadata.build";

let repositoryRoot: string;

beforeEach(async () => {
  repositoryRoot = await mkdtemp(join(tmpdir(), "crapdash-build-metadata-"));
  runGit(["init", "--initial-branch=main"]);
  runGit(["config", "user.email", "tests@crapdash.invalid"]);
  runGit(["config", "user.name", "Crapdash Tests"]);
  runGit(["config", "commit.gpgsign", "false"]);
  await writeFile(join(repositoryRoot, "dashboard.txt"), "initial\n");
  runGit(["add", "dashboard.txt"]);
  runGit(["commit", "--message", "Add dashboard"]);
});

afterEach(async () => {
  await rm(repositoryRoot, { recursive: true, force: true });
});

describe("discoverBuildMetadata", () => {
  it("discovers metadata from an attached branch", () => {
    const metadata = discoverBuildMetadata({ repositoryRoot });

    expect(metadata).toMatchObject({
      branch: "main",
      commitSha: runGit(["rev-parse", "HEAD"]),
      commitSubject: "Add dashboard",
      dirty: false,
    });
    expect(metadata.builtAt).toEqual(expect.any(String));
  });

  it("labels a detached checkout without rejecting it", () => {
    runGit(["switch", "--detach", "HEAD"]);

    expect(discoverBuildMetadata({ repositoryRoot })).toMatchObject({
      branch: "detached",
      commitSha: runGit(["rev-parse", "HEAD"]),
      commitSubject: "Add dashboard",
      dirty: false,
    });
  });
});

function runGit(args: string[]) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}
