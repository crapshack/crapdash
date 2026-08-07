import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseBuildMetadata } from "./build-metadata";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

interface DiscoverBuildMetadataOptions {
  repositoryRoot?: string;
}

export function discoverBuildMetadata(options: DiscoverBuildMetadataOptions = {}) {
  const root = options.repositoryRoot ?? repositoryRoot;
  const branch = runGit(["branch", "--show-current"], root) || "detached";

  return parseBuildMetadata({
    branch,
    builtAt: new Date().toISOString(),
    commitSha: runGit(["rev-parse", "HEAD"], root),
    commitSubject: runGit(["log", "-1", "--format=%s", "HEAD"], root),
    dirty: String(runGit(["status", "--porcelain=v1"], root).length > 0),
  });
}

function runGit(args: string[], cwd: string) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}
