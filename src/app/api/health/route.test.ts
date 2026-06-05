import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns an ok health response", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "ok",
      service: "tahfidzh-mj",
    });
  });
});
