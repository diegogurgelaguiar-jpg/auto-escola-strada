const signImages = {
  pare: {
    src: "/images/placas/pare.svg",
    alt: "Placa de parada obrigatória PARE",
  },
  velocidade: {
    src: "/images/placas/velocidade-maxima.svg",
    alt: "Exemplo de placa de velocidade máxima",
  },
  advertencia: {
    src: "/images/placas/advertencia.svg",
    alt: "Exemplo de placa de advertência",
  },
  indicacao: {
    src: "/images/placas/indicacao.svg",
    alt: "Exemplo de placa de indicação",
  },
  regulamentacao: {
    src: "/images/placas/regulamentacao.svg",
    alt: "Exemplos de placas de regulamentação",
  },
};

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getQuestionImage(question) {
  if (question.image_url) {
    return {
      src: question.image_url,
      alt: question.image_alt || "Imagem de apoio da questão",
    };
  }

  const text = normalize(question.question);
  const category = normalize(question.category);

  if (text.includes("pare") || text.includes("parada obrigatoria")) return signImages.pare;
  if (text.includes("velocidade maxima")) return signImages.velocidade;
  if (text.includes("advertencia")) return signImages.advertencia;
  if (text.includes("indicacao")) return signImages.indicacao;
  if (text.includes("regulamentacao")) return signImages.regulamentacao;
  if (category === "placas") return signImages.regulamentacao;

  return null;
}
