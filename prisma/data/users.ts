export const users = [
  {
    usuario: "admin",
    email: "admin@admin.com",
    nombre: "Admin",
    apellido: "Admin",
    telefono: "4444444444",
  },
  {
    usuario: "royeradames",
    email: "royeraadames@gmail.com",
    nombre: "Royer",
    apellido: "Adames",
    telefono: process.env.SEED_PHONE_USER || "5555555556",
  },
];
