// Generate payments for 100 users with at least 3 payments each
// Each user gets 3 payments: 1 mensual and 2 diario (or vice versa)
const generatePayments = () => {
  const payments = [];
  const membershipTypes = ["DIARIO", "MENSUAL"] as const;

  // Generate 3 payments per user (102 users = 306 payments)
  for (let i = 0; i < 306; i++) {
    const membresia =
      membershipTypes[Math.floor(Math.random() * membershipTypes.length)];

    // Different amount ranges for daily vs monthly
    const monto =
      membresia === "DIARIO"
        ? Math.floor(Math.random() * 200) + 50 // $50-$250 para diario
        : Math.floor(Math.random() * 500) + 300; // $300-$800 para mensual

    payments.push({
      monto,
      estado: "PAGADO" as const,
      membresia,
    });
  }

  return payments;
};

export const payments = generatePayments();
