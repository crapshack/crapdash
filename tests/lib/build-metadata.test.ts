import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseBuildMetadata,
  readBuildMetadata,
} from "@/lib/build-metadata";

const validInput = {
  branch: "environment-badge",
  builtAt: "2026-08-07T07:15:00.000Z",
  commitSha: "98556cc1d4a18439855616c0b86e4eaa6b5d2821",
  commitSubject: "Add environment badge details",
  dirty: "true",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseBuildMetadata", () => {
  it("parses valid build metadata", () => {
    expect(parseBuildMetadata(validInput)).toEqual({
      branch: validInput.branch,
      builtAt: validInput.builtAt,
      commitSha: validInput.commitSha,
      commitSubject: validInput.commitSubject,
      dirty: true,
    });
  });

  it.each([
    ["branch", "APP_BUILD_BRANCH"],
    ["builtAt", "APP_BUILD_AT"],
    ["commitSha", "APP_BUILD_COMMIT_SHA"],
    ["commitSubject", "APP_BUILD_COMMIT_SUBJECT"],
    ["dirty", "APP_BUILD_DIRTY"],
  ] as const)("rejects a missing %s", (field, variableName) => {
    expect(() => parseBuildMetadata({ ...validInput, [field]: undefined })).toThrow(
      `${variableName} is required`
    );
  });

  it("rejects an invalid commit SHA", () => {
    expect(() =>
      parseBuildMetadata({ ...validInput, commitSha: "not-a-commit" })
    ).toThrow("APP_BUILD_COMMIT_SHA must be a Git commit SHA");
  });

  it("rejects an invalid build timestamp", () => {
    expect(() => parseBuildMetadata({ ...validInput, builtAt: "yesterday" })).toThrow(
      "APP_BUILD_AT must be an ISO 8601 timestamp"
    );
  });

  it("rejects an invalid dirty flag", () => {
    expect(() => parseBuildMetadata({ ...validInput, dirty: "yes" })).toThrow(
      'APP_BUILD_DIRTY must be either "true" or "false"'
    );
  });
});

describe("readBuildMetadata", () => {
  it("reads embedded build metadata", () => {
    vi.stubEnv("APP_BUILD_BRANCH", validInput.branch);
    vi.stubEnv("APP_BUILD_AT", validInput.builtAt);
    vi.stubEnv("APP_BUILD_COMMIT_SHA", validInput.commitSha);
    vi.stubEnv("APP_BUILD_COMMIT_SUBJECT", validInput.commitSubject);
    vi.stubEnv("APP_BUILD_DIRTY", validInput.dirty);

    expect(readBuildMetadata()).toEqual({
      branch: validInput.branch,
      builtAt: validInput.builtAt,
      commitSha: validInput.commitSha,
      commitSubject: validInput.commitSubject,
      dirty: true,
    });
  });
});
