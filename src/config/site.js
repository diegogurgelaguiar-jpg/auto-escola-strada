export const siteConfig = {
  name: "Auto Escola Strada",
  slogan: "Sua CNH começa aqui",
  description: "Autoescola com atendimento profissional, área do aluno e simulado teórico online.",
  address: "Endereço da autoescola",
  hours: "Segunda a sexta, das 8h às 18h",
  instagram: "#",
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "5599999999999",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://seudominio.com.br"
};

export const questionCategories = [
  "Legislação",
  "Placas",
  "Direção defensiva",
  "Primeiros socorros",
  "Meio ambiente",
  "Mecânica básica",
  "Infrações",
  "Sinalização"
];
