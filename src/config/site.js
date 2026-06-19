export const siteConfig = {
  name: "Auto Escola Strada",
  slogan: "Qualidade, segurança e confiança",
  description: "Formação completa para categorias A, B, C, D e E, com pista própria para motos e acompanhamento em cada etapa da sua CNH.",
  address: "Av. Padre Pedro Pinto, 2244 - Venda Nova, Belo Horizonte/MG",
  phone: "(31) 3451-3969",
  hours: "Consulte nossos horários pelo WhatsApp",
  instagram: "#",
  whatsapp: "553134513969",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.%20Padre%20Pedro%20Pinto%2C%202244%2C%20Venda%20Nova%2C%20Belo%20Horizonte%2FMG",
  siteUrl: import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")
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
