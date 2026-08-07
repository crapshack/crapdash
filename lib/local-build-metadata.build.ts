import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseLocalBuildMetadata } from "./local-build-metadata";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

export function discoverLocalBuildMetadata() {
  const branch = runGit(["branch", "--show-current"]);

  if (!branch) {
    throw new Error("Local development requires an attached Git branch");
  }

  return parseLocalBuildMetadata({
    branch,
    builtAt: new Date().toISOString(),
    commitSha: runGit(["rev-parse", "HEAD"]),
    commitSubject: runGit(["log", "-1", "--format=%s", "HEAD"]),
    dirty: String(runGit(["status", "--porcelain=v1"]).length > 0),
  });
}

function runGit(args: string[]) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}
