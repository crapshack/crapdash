import { describe, expect, it, vi } from "vitest";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";
import createNextConfig from "@/next.config";
import packageJson from "@/package.json";

const buildMetadata = vi.hoisted(() => ({
  branch: "environment-badge",
  builtAt: "2026-08-07T07:15:00.000Z",
  commitSha: "98556cc1d4a18439855616c0b86e4eaa6b5d2821",
  commitSubject: "Add environment badge details",
  dirty: true,
}));

vi.mock("@/lib/build-metadata.build", () => ({
  discoverBuildMetadata: vi.fn(() => buildMetadata),
}));

describe("next config build metadata", () => {
  it("embeds Git metadata for the development server", () => {
    const config = createNextConfig(PHASE_DEVELOPMENT_SERVER);

    expect(config.env).toEqual({
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
      APP_BUILD_BRANCH: buildMetadata.branch,
      APP_BUILD_AT: buildMetadata.builtAt,
      APP_BUILD_COMMIT_SHA: buildMetadata.commitSha,
      APP_BUILD_COMMIT_SUBJECT: buildMetadata.commitSubject,
      APP_BUILD_DIRTY: String(buildMetadata.dirty),
    });
  });

  it("excludes Git metadata from production builds", () => {
    const config = createNextConfig(PHASE_PRODUCTION_BUILD);

    expect(config.env).toEqual({
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
    });
  });
});
