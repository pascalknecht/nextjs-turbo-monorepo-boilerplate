import { prisma } from "@/lib/prisma";

const ACTIVE_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "incomplete",
] as const;

type ActiveSubscriptionStatus = (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number];

export type BillingPlan = {
  priceId: string;
  productId: string | null;
  productName: string;
  productDescription: string | null;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
};

export type BillingSubscription = {
  id: string;
  status: string | null;
  customerId: string;
  priceId: string | null;
  productName: string | null;
  currentPeriodEnd: number | null;
};

export type BillingState = {
  customerId: string | null;
  customerEmail: string | null;
  activeSubscription: BillingSubscription | null;
  hasActiveSubscription: boolean;
  plans: BillingPlan[];
};

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getCurrentPriceIdFromSubscriptionItems(items: unknown): string | null {
  if (!isJsonRecord(items)) {
    return null;
  }

  const data = items.data;
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const firstItem = data[0];
  if (!isJsonRecord(firstItem)) {
    return null;
  }

  const rawPrice = firstItem.price;
  if (typeof rawPrice === "string") {
    return rawPrice;
  }

  if (!isJsonRecord(rawPrice)) {
    return null;
  }

  return typeof rawPrice.id === "string" ? rawPrice.id : null;
}

function getIntervalFromRecurring(recurring: unknown): {
  interval: string;
  intervalCount: number;
} {
  if (!isJsonRecord(recurring)) {
    return { interval: "month", intervalCount: 1 };
  }

  const interval =
    typeof recurring.interval === "string" ? recurring.interval : "month";
  const intervalCount =
    typeof recurring.interval_count === "number" ? recurring.interval_count : 1;

  return { interval, intervalCount };
}

function isActiveStatus(
  status: string | null | undefined
): status is ActiveSubscriptionStatus {
  if (!status) {
    return false;
  }

  return (ACTIVE_SUBSCRIPTION_STATUSES as readonly string[]).includes(status);
}

export async function getBillingStateForUser(
  userEmail: string
): Promise<BillingState> {
  const customer = await prisma.stripeCustomer.findFirst({
    where: {
      email: userEmail,
      deleted: false,
    },
    orderBy: [{ created: "desc" }, { id: "desc" }],
  });

  let activeSubscription: BillingSubscription | null = null;
  let activeSubscriptionPriceId: string | null = null;

  if (customer) {
    const subscriptions = await prisma.stripeSubscription.findMany({
      where: {
        customer: customer.id,
      },
      orderBy: [{ created: "desc" }, { id: "desc" }],
      take: 10,
    });

    const currentSubscription =
      subscriptions.find((subscription) => isActiveStatus(subscription.status)) ??
      subscriptions[0] ??
      null;

    if (currentSubscription) {
      activeSubscriptionPriceId = getCurrentPriceIdFromSubscriptionItems(
        currentSubscription.items
      );

      activeSubscription = {
        id: currentSubscription.id,
        status: currentSubscription.status,
        customerId: customer.id,
        priceId: activeSubscriptionPriceId,
        productName: null,
        currentPeriodEnd: currentSubscription.current_period_end ?? null,
      };
    }
  }

  const prices = await prisma.stripePrice.findMany({
    where: {
      active: true,
      type: "recurring",
      unit_amount: {
        not: null,
      },
      currency: {
        not: null,
      },
    },
    orderBy: [{ unit_amount: "asc" }, { id: "asc" }],
  });

  const productIds = prices
    .map((price) => price.product)
    .filter((productId): productId is string => typeof productId === "string");

  const products = productIds.length
    ? await prisma.stripeProduct.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      })
    : [];

  const productById = new Map(products.map((product) => [product.id, product]));

  const plans = prices.map((price) => {
    const product =
      typeof price.product === "string"
        ? productById.get(price.product) ?? null
        : null;
    const recurring = getIntervalFromRecurring(price.recurring);

    return {
      priceId: price.id,
      productId: typeof price.product === "string" ? price.product : null,
      productName: product?.name ?? price.nickname ?? "Subscription",
      productDescription: product?.description ?? null,
      amount: price.unit_amount ?? 0,
      currency: price.currency ?? "usd",
      interval: recurring.interval,
      intervalCount: recurring.intervalCount,
    };
  });

  if (activeSubscription?.priceId) {
    const currentPlan = plans.find(
      (plan) => plan.priceId === activeSubscription?.priceId
    );
    if (currentPlan) {
      activeSubscription.productName = currentPlan.productName;
    }
  }

  const hasActiveSubscription = isActiveStatus(activeSubscription?.status);

  return {
    customerId: customer?.id ?? null,
    customerEmail: customer?.email ?? null,
    activeSubscription,
    hasActiveSubscription,
    plans,
  };
}
