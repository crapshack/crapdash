import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseBuildMetadata } from "./build-metadata";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

export function discoverBuildMetadata() {
  const branch = runGit(["branch", "--show-current"]);

  if (!branch) {
    throw new Error("The development server requires an attached Git branch");
  }

  return parseBuildMetadata({
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
