export const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    firstName: "Admin",
    lastName: "Admin",
    phone: "4444444444",
  },
  {
    username: "royeradames",
    email: "royeraadames@gmail.com",
    firstName: "Royer",
    lastName: "Adames",
    phone: process.env.SEED_PHONE_USER || "5555555556",
  },
];
