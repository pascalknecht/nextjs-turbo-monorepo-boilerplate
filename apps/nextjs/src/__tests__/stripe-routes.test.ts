import { beforeEach, describe, expect, it, vi } from "vitest";

const createCheckoutSessionMock = vi.fn();
const createPortalSessionMock = vi.fn();
const getSSRSessionMock = vi.fn();
const getBillingStateForUserMock = vi.fn();

vi.mock("@/env", () => ({
  env: {
    STRIPE_API_KEY: "sk_test_123",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  },
}));

vi.mock("@/lib/get-server-session", () => ({
  getSSRSession: getSSRSessionMock,
}));

vi.mock("@/use-cases/billing", () => ({
  getBillingStateForUser: getBillingStateForUserMock,
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: createCheckoutSessionMock,
      },
    },
    billingPortal: {
      sessions: {
        create: createPortalSessionMock,
      },
    },
  },
}));

describe("stripe route handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a checkout session for a first subscription", async () => {
    getSSRSessionMock.mockResolvedValue({
      user: { id: "user_1", email: "user@example.com" },
    });
    getBillingStateForUserMock.mockResolvedValue({
      customerId: null,
      plans: [
        {
          priceId: "price_basic",
        },
      ],
      activeSubscription: null,
    });
    createCheckoutSessionMock.mockResolvedValue({
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });

    const { POST } = await import("@/app/api/stripe/checkout/route");
    const response = await POST(
      new Request("http://localhost:3000/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_basic",
          intent: "create",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.stripe.com/pay/cs_test_123",
    });
    expect(createCheckoutSessionMock).toHaveBeenCalledTimes(1);
    expect(createCheckoutSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer_email: "user@example.com",
        metadata: expect.objectContaining({
          intent: "create",
        }),
      })
    );
  });

  it("requires an existing subscription when checkout intent is update", async () => {
    getSSRSessionMock.mockResolvedValue({
      user: { id: "user_1", email: "user@example.com" },
    });
    getBillingStateForUserMock.mockResolvedValue({
      customerId: "cus_123",
      plans: [
        {
          priceId: "price_pro",
        },
      ],
      activeSubscription: null,
    });

    const { POST } = await import("@/app/api/stripe/checkout/route");
    const response = await POST(
      new Request("http://localhost:3000/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_pro",
          intent: "update",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "No active subscription was found to update.",
    });
    expect(createCheckoutSessionMock).not.toHaveBeenCalled();
  });

  it("creates a customer portal session for an existing customer", async () => {
    getSSRSessionMock.mockResolvedValue({
      user: { id: "user_1", email: "user@example.com" },
    });
    getBillingStateForUserMock.mockResolvedValue({
      customerId: "cus_123",
    });
    createPortalSessionMock.mockResolvedValue({
      url: "https://billing.stripe.com/p/session_123",
    });

    const { POST } = await import("@/app/api/stripe/portal/route");
    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://billing.stripe.com/p/session_123",
    });
    expect(createPortalSessionMock).toHaveBeenCalledTimes(1);
    expect(createPortalSessionMock).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "http://localhost:3000/settings?billing=portal-return",
    });
  });
});
