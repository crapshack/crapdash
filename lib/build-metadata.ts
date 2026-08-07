export interface BuildMetadata {
  branch: string;
  builtAt: string;
  commitSha: string;
  commitSubject: string;
  dirty: boolean;
}

interface BuildMetadataInput {
  branch: string | undefined;
  builtAt: string | undefined;
  commitSha: string | undefined;
  commitSubject: string | undefined;
  dirty: string | undefined;
}

const COMMIT_SHA_PATTERN = /^[0-9a-f]{7,64}$/i;
const ISO_8601_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function readBuildMetadata(): BuildMetadata {
  return parseBuildMetadata({
    branch: process.env.APP_BUILD_BRANCH,
    builtAt: process.env.APP_BUILD_AT,
    commitSha: process.env.APP_BUILD_COMMIT_SHA,
    commitSubject: process.env.APP_BUILD_COMMIT_SUBJECT,
    dirty: process.env.APP_BUILD_DIRTY,
  });
}

export function parseBuildMetadata(input: BuildMetadataInput): BuildMetadata {
  const branch = requireValue("APP_BUILD_BRANCH", input.branch);
  const builtAt = requireValue("APP_BUILD_AT", input.builtAt);
  const commitSha = requireValue("APP_BUILD_COMMIT_SHA", input.commitSha);
  const commitSubject = requireValue("APP_BUILD_COMMIT_SUBJECT", input.commitSubject);
  const dirty = requireValue("APP_BUILD_DIRTY", input.dirty);

  if (!COMMIT_SHA_PATTERN.test(commitSha)) {
    throw new Error("APP_BUILD_COMMIT_SHA must be a Git commit SHA");
  }

  if (!ISO_8601_TIMESTAMP_PATTERN.test(builtAt) || Number.isNaN(Date.parse(builtAt))) {
    throw new Error("APP_BUILD_AT must be an ISO 8601 timestamp");
  }

  if (dirty !== "false" && dirty !== "true") {
    throw new Error('APP_BUILD_DIRTY must be either "true" or "false"');
  }

  return {
    branch,
    builtAt,
    commitSha,
    commitSubject,
    dirty: dirty === "true",
  };
}

function requireValue(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}
