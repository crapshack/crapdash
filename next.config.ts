import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, type PHASE_TYPE } from "next/constants";
import { discoverBuildMetadata } from "./lib/build-metadata.build";
import packageJson from "./package.json";

export default function createNextConfig(phase: PHASE_TYPE): NextConfig {
  const buildMetadata =
    phase === PHASE_DEVELOPMENT_SERVER ? discoverBuildMetadata() : null;

  return {
    // Produce standalone output for self-hosted deploys (Docker or zipped bundle)
    output: "standalone",
    env: {
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
      ...(buildMetadata
        ? {
            APP_BUILD_AT: buildMetadata.builtAt,
            APP_BUILD_BRANCH: buildMetadata.branch,
            APP_BUILD_COMMIT_SHA: buildMetadata.commitSha,
            APP_BUILD_COMMIT_SUBJECT: buildMetadata.commitSubject,
            APP_BUILD_DIRTY: String(buildMetadata.dirty),
          }
        : {}),
    },
  };
}
