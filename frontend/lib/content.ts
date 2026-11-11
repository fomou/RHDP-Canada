export const pricing = [
  {
    title: "Adhésion",
    amount: "50,00 $",
    detail: "Une fois, à l'inscription.",
    tone: "light" as const,
  },
  {
    title: "Frais d'inscription",
    amount: "10,00 $",
    detail: "Une fois, frais de dossier.",
    tone: "light" as const,
  },
  {
    title: "Contribution événementielle",
    amount: "10,00 $",
    detail: "Seulement lorsqu'un événement est annoncé.",
    tone: "dark" as const,
  },
];

export const benefits = [
  {
    title: "Votre foyer protégé",
    body: "Partenaires, conjoint, enfants et parents à votre adhésion.",
    icon: "shield" as const,
  },
  {
    title: "Alertes claires",
    body: "Chaque appel de contribution apparaît en haut de votre tableau de bord.",
    icon: "bell" as const,
  },
  {
    title: "Entraide réelle",
    body: "Les fonds sont remis directement à la famille concernée.",
    icon: "hands" as const,
  },
];

export const news = [
  {
    category: "Vie associative",
    title: "Assemblée générale annuelle le 29 novembre",
    body: "Tous les membres sont conviés à Montréal et en ligne pour le bilan de l'année et l'élection du bureau.",
  },
  {
    category: "Solidarité",
    title: "Merci pour votre mobilisation",
    body: "Grâce à 312 membres, 3 120 $ ont été remis à la famille Traoré en moins de deux semaines.",
  },
  {
    category: "Communauté",
    title: "Nouvelle antenne à Ottawa-Gatineau",
    body: "Une équipe de bénévoles accueille désormais les membres de la région de la capitale.",
  },
];

export const questions = [
  {
    value: "initial",
    question: "Que comprennent les 60 $ initiaux ?",
    answer:
      "Les 60 $ réunissent l'adhésion de 50 $ et les frais de dossier de 10 $. Les deux montants sont versés une fois, à l'inscription.",
  },
  {
    value: "dix",
    question: "Quand dois-je verser 10 $ ?",
    answer:
      "La contribution de 10 $ n'est demandée que lorsqu'un événement est annoncé. Elle n'est pas un prélèvement mensuel.",
  },
  {
    value: "proches",
    question: "Mes proches paient-ils en plus ?",
    answer:
      "Non. Ajouter un conjoint, des enfants ou des parents ne crée pas de frais supplémentaires.",
  },
  {
    value: "donnees",
    question: "Mes données sont-elles protégées ?",
    answer:
      "Le formulaire de cette page valide les champs dans le navigateur et ne les envoie nulle part. L'API ne garde un mot de passe qu'après l'avoir haché, et aucun secret n'est enregistré dans le dépôt.",
  },
];
