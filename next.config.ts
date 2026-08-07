import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, type PHASE_TYPE } from "next/constants";
import { discoverLocalBuildMetadata } from "./lib/local-build-metadata.build";
import packageJson from "./package.json";

export default function createNextConfig(phase: PHASE_TYPE): NextConfig {
  const localBuildMetadata =
    phase === PHASE_DEVELOPMENT_SERVER ? discoverLocalBuildMetadata() : null;

  return {
    // Produce standalone output for self-hosted deploys (Docker or zipped bundle)
    output: "standalone",
    env: {
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
      ...(localBuildMetadata
        ? {
            APP_BUILD_AT: localBuildMetadata.builtAt,
            APP_BUILD_BRANCH: localBuildMetadata.branch,
            APP_BUILD_COMMIT_SHA: localBuildMetadata.commitSha,
            APP_BUILD_COMMIT_SUBJECT: localBuildMetadata.commitSubject,
            APP_BUILD_DIRTY: String(localBuildMetadata.dirty),
          }
        : {}),
    },
  };
}
