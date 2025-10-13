// Generate payments for 100 users with at least 3 payments each
// Each user gets 3 payments: 1 monthly and 2 daily (or vice versa)
const generatePayments = () => {
  const payments = [];
  const membershipTypes = ["DAILY", "MONTHLY"] as const;

  // Generate 3 payments per user (102 users = 306 payments)
  for (let i = 0; i < 306; i++) {
    const membership =
      membershipTypes[Math.floor(Math.random() * membershipTypes.length)];

    // Different amount ranges for daily vs monthly
    const amount =
      membership === "DAILY"
        ? Math.floor(Math.random() * 200) + 50 // $50-$250 for daily
        : Math.floor(Math.random() * 500) + 300; // $300-$800 for monthly

    payments.push({
      amount,
      status: "PAID" as const,
      membership,
    });
  }

  return payments;
};

export const payments = generatePayments();
