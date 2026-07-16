import { beforeEach, describe, expect, it, vi } from "vitest";

const { authGetUser, fromMock } = vi.hoisted(() => ({
  authGetUser: vi.fn(),
  fromMock: vi.fn(),
}));

const mockSupabase = {
  auth: {
    getUser: authGetUser,
  },
  from: fromMock,
};

vi.mock("$lib/supabase/client.js", () => ({
  supabase: mockSupabase,
}));

// Helper to create a realistic, thenable Supabase query builder mock
function createQueryBuilder(result) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
    single: vi.fn(() => Promise.resolve(result)),
    delete: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    // Make the builder a thenable so that direct await resolves to the result
    then: vi.fn((onFulfilled, onRejected) =>
      Promise.resolve(result).then(onFulfilled, onRejected)
    ),
  };

  return builder;
}

function makeFromFactory({ profileId = "profile-1", progressData = [], userError = null, progressError = null }) {
  const userBuilder = createQueryBuilder({ data: { id: profileId }, error: userError });
  const progressBuilder = createQueryBuilder({ data: progressData, error: progressError });

  return (table) => {
    if (table === "users") return userBuilder;
    if (table === "user_progress") return progressBuilder;
    throw new Error(`Unexpected table: ${table}`);
  };
}

describe("progress helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    authGetUser.mockReset();
    fromMock.mockReset();
  });

  it("returns null when no user is signed in", async () => {
    authGetUser.mockResolvedValue({ data: { user: null }, error: null });
    fromMock.mockImplementation(() => {
      throw new Error("from should not be called");
    });

    const { getProfileId } = await import("../../client/src/lib/javascript/progress.js");

    await expect(getProfileId()).resolves.toBeNull();
  });

  it("loads and caches the profile id for the signed-in user", async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: "auth-1" } }, error: null });
    fromMock.mockImplementation(makeFromFactory({ profileId: "profile-1" }));

    const { getProfileId } = await import("../../client/src/lib/javascript/progress.js");

    await expect(getProfileId()).resolves.toBe("profile-1");
    await expect(getProfileId()).resolves.toBe("profile-1");
    expect(fromMock).toHaveBeenCalledTimes(1);
  });

  it("returns progress rows for the current profile", async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: "auth-1" } }, error: null });
    const progressRows = [{ lesson_slug: "intro", status: "todo" }];
    fromMock.mockImplementation(
      makeFromFactory({ profileId: "profile-1", progressData: progressRows }),
    );

    const { getProgress, getProfileId } = await import(
      "../../client/src/lib/javascript/progress.js"
    );

    await getProfileId();
    await expect(getProgress()).resolves.toEqual(progressRows);
  });

  it("stores completed status with a completion timestamp", async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: "auth-1" } }, error: null });
    const progressBuilder = createQueryBuilder({
      data: { lesson_slug: "salad", status: "completed" },
      error: null,
    });
    fromMock.mockImplementation((table) => {
      if (table === "users") {
        return createQueryBuilder({ data: { id: "profile-1" }, error: null });
      }
      if (table === "user_progress") {
        return progressBuilder;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { setStatus, COMPLETED } = await import(
      "../../client/src/lib/javascript/progress.js"
    );

    const result = await setStatus("salad", COMPLETED);

    expect(result).toMatchObject({ lesson_slug: "salad", status: COMPLETED });
    expect(progressBuilder.upsert).toHaveBeenCalledTimes(1);

    const payload = progressBuilder.upsert.mock.calls[0][0];
    expect(payload.user_id).toBe("profile-1");
    expect(payload.lesson_slug).toBe("salad");
    expect(payload.status).toBe(COMPLETED);
    expect(payload.completed_at).toEqual(expect.any(String));
  });

  it("does not downgrade a lesson that is already completed or in progress", async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: "auth-1" } }, error: null });
    fromMock.mockImplementation(makeFromFactory({ profileId: "profile-1" }));

    const { markStarted, IN_PROGRESS, COMPLETED } = await import(
      "../../client/src/lib/javascript/progress.js"
    );

    await expect(markStarted("salad", COMPLETED)).resolves.toBeNull();
    await expect(markStarted("salad", IN_PROGRESS)).resolves.toBeNull();
  });

  it("deletes a lesson status when clearing it", async () => {
    authGetUser.mockResolvedValue({ data: { user: { id: "auth-1" } }, error: null });
    const progressBuilder = createQueryBuilder({ data: null, error: null });
    fromMock.mockImplementation((table) => {
      if (table === "users") {
        return createQueryBuilder({ data: { id: "profile-1" }, error: null });
      }
      if (table === "user_progress") {
        return progressBuilder;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const { clearStatus } = await import("../../client/src/lib/javascript/progress.js");

    await clearStatus("salad");

    expect(progressBuilder.delete).toHaveBeenCalledTimes(1);
  });
});