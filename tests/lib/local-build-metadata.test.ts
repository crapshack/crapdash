import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseLocalBuildMetadata,
  readLocalBuildMetadata,
} from "@/lib/local-build-metadata";

const validInput = {
  branch: "environment-badge",
  builtAt: "2026-08-07T07:15:00.000Z",
  commitSha: "98556cc1d4a18439855616c0b86e4eaa6b5d2821",
  commitSubject: "Add local environment badge details",
  dirty: "true",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("parseLocalBuildMetadata", () => {
  it("parses valid local build metadata", () => {
    expect(parseLocalBuildMetadata(validInput)).toEqual({
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
    expect(() => parseLocalBuildMetadata({ ...validInput, [field]: undefined })).toThrow(
      `${variableName} is required`
    );
  });

  it("rejects an invalid commit SHA", () => {
    expect(() =>
      parseLocalBuildMetadata({ ...validInput, commitSha: "not-a-commit" })
    ).toThrow("APP_BUILD_COMMIT_SHA must be a Git commit SHA");
  });

  it("rejects an invalid build timestamp", () => {
    expect(() => parseLocalBuildMetadata({ ...validInput, builtAt: "yesterday" })).toThrow(
      "APP_BUILD_AT must be an ISO 8601 timestamp"
    );
  });

  it("rejects an invalid dirty flag", () => {
    expect(() => parseLocalBuildMetadata({ ...validInput, dirty: "yes" })).toThrow(
      'APP_BUILD_DIRTY must be either "true" or "false"'
    );
  });
});

describe("readLocalBuildMetadata", () => {
  it("reads embedded build metadata", () => {
    vi.stubEnv("APP_BUILD_BRANCH", validInput.branch);
    vi.stubEnv("APP_BUILD_AT", validInput.builtAt);
    vi.stubEnv("APP_BUILD_COMMIT_SHA", validInput.commitSha);
    vi.stubEnv("APP_BUILD_COMMIT_SUBJECT", validInput.commitSubject);
    vi.stubEnv("APP_BUILD_DIRTY", validInput.dirty);

    expect(readLocalBuildMetadata()).toEqual({
      branch: validInput.branch,
      builtAt: validInput.builtAt,
      commitSha: validInput.commitSha,
      commitSubject: validInput.commitSubject,
      dirty: true,
    });
  });
});
