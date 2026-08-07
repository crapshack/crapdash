import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BuildDetails,
  EnvironmentBadge,
} from "@/components/layout/header/environment-badge";

const buildMetadata = {
  branch: "environment-badge",
  builtAt: "2026-08-07T07:15:00.000Z",
  commitSha: "98556cc1d4a18439855616c0b86e4eaa6b5d2821",
  commitSubject: "Add environment badge details",
  dirty: true,
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("EnvironmentBadge", () => {
  it("renders a local badge in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("APP_BUILD_BRANCH", buildMetadata.branch);
    vi.stubEnv("APP_BUILD_AT", buildMetadata.builtAt);
    vi.stubEnv("APP_BUILD_COMMIT_SHA", buildMetadata.commitSha);
    vi.stubEnv("APP_BUILD_COMMIT_SUBJECT", buildMetadata.commitSubject);
    vi.stubEnv("APP_BUILD_DIRTY", String(buildMetadata.dirty));

    const html = renderToStaticMarkup(<EnvironmentBadge />);

    expect(html).toContain('data-slot="badge"');
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain("rounded-sm");
    expect(html).not.toContain("rounded-full");
    expect(html).toContain("DEV");
    expect(html).toContain("Development environment. Show build details");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("<button");
  });

  it.each(["production", "test"])("renders nothing in %s", (environment) => {
    vi.stubEnv("NODE_ENV", environment);

    expect(renderToStaticMarkup(<EnvironmentBadge />)).toBe("");
  });

  it("renders complete build details", () => {
    const html = renderToStaticMarkup(<BuildDetails metadata={buildMetadata} />);

    expect(html).toContain("BRANCH");
    expect(html).toContain(buildMetadata.branch);
    expect(html).toContain("COMMIT");
    expect(html).toContain(buildMetadata.commitSha.slice(0, 8));
    expect(html).toContain("(dirty)");
    expect(html).toContain("MESSAGE");
    expect(html).toContain(buildMetadata.commitSubject);
    expect(html).toContain("BUILT");
    expect(html).toContain(`dateTime="${buildMetadata.builtAt}"`);
  });
});
