import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";
import { describe, expect, it } from "vitest";
import createNextConfig from "@/next.config";
import packageJson from "@/package.json";

describe("next config local build metadata", () => {
  it("embeds Git metadata for the development server", () => {
    const config = createNextConfig(PHASE_DEVELOPMENT_SERVER);

    expect(config.env).toMatchObject({
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
      APP_BUILD_BRANCH: expect.any(String),
      APP_BUILD_AT: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      APP_BUILD_COMMIT_SHA: expect.stringMatching(/^[0-9a-f]{40}$/),
      APP_BUILD_COMMIT_SUBJECT: expect.any(String),
      APP_BUILD_DIRTY: expect.stringMatching(/^(?:true|false)$/),
    });
  });

  it("excludes local Git metadata from production builds", () => {
    const config = createNextConfig(PHASE_PRODUCTION_BUILD);

    expect(config.env).toEqual({
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
    });
  });
});
