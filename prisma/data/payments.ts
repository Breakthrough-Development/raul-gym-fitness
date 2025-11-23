// Generate payments for 100 users with at least 3 payments each
// Each user gets 3 payments: 1 mensual and 2 diario (or vice versa)
const generatePayments = () => {
  const payments = [];
  const membershipTypes = ["DAILY", "MONTHLY"] as const;

  // Calculate date range: 5 years back from today
  const today = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  const timeRange = today.getTime() - fiveYearsAgo.getTime();

  // Generate 3 payments per user (102 users = 306 payments)
  for (let i = 0; i < 306; i++) {
    const membership =
      membershipTypes[Math.floor(Math.random() * membershipTypes.length)];

    // Different amount ranges for daily vs monthly
    const amount =
      membership === "DAILY"
        ? Math.floor(Math.random() * 200) + 50 // $50-$250 para diario
        : Math.floor(Math.random() * 500) + 300; // $300-$800 para mensual

    // Generate random date within the past 5 years
    // Use squared random to weight towards more recent dates
    // This creates more payments in recent years and fewer as we go back
    const randomFactor = Math.random(); // 0 to 1
    const weightedFactor = randomFactor * randomFactor; // Square it to weight towards 0 (recent)
    const randomTime = weightedFactor * timeRange;
    const paymentDate = new Date(today.getTime() - randomTime); // Subtract from today

    payments.push({
      amount,
      status: "PAID" as const,
      membership,
      paymentDate,
    });
  }

  return payments;
};

export const payments = generatePayments();
