// ---------------------------------------------------------------------------
// MOCK PRODUCT CATALOG — Joyau Brillant Batna
// This file simulates the data that will later come from the real backend.
// Every helper in `src/services/*` is written so that swapping the mock
// implementation for a real Axios call only requires uncommenting the
// `axiosClient` lines already left in place as comments.
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  {
    id: "mariage",
    fr: "Robes de Mariée",
    ar: "فساتين الزفاف",
    image:
      "https://images.pexels.com/photos/30277564/pexels-photo-30277564.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900",
  },
  {
    id: "caftan",
    fr: "Caftans",
    ar: "القفاطين",
    image:
      "https://images.pexels.com/photos/32107406/pexels-photo-32107406.png?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900",
  },
  {
    id: "soiree",
    fr: "Robes de Soirée",
    ar: "فساتين السهرة",
    image:
      "https://images.pexels.com/photos/18816319/pexels-photo-18816319.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900",
  },
  {
    id: "abaya",
    fr: "Abayas",
    ar: "العبايات",
    image:
      "https://images.pexels.com/photos/7249770/pexels-photo-7249770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900",
  },
  {
    id: "traditionnelle",
    fr: "Tenues Traditionnelles",
    ar: "الأزياء التقليدية",
    image:
      "https://images.pexels.com/photos/33743290/pexels-photo-33743290.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900",
  },
];

const img = {
  wedding1: "https://images.pexels.com/photos/30277564/pexels-photo-30277564.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  wedding2: "https://images.pexels.com/photos/32862202/pexels-photo-32862202.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  wedding3: "https://images.pexels.com/photos/5618793/pexels-photo-5618793.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  wedding4: "https://images.pexels.com/photos/19815532/pexels-photo-19815532.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  wedding5: "https://images.pexels.com/photos/36478467/pexels-photo-36478467.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  wedding6: "https://images.pexels.com/photos/8459351/pexels-photo-8459351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan1: "https://images.pexels.com/photos/32107406/pexels-photo-32107406.png?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan2: "https://images.pexels.com/photos/33743290/pexels-photo-33743290.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan3: "https://images.pexels.com/photos/7249445/pexels-photo-7249445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan4: "https://images.pexels.com/photos/19811731/pexels-photo-19811731.png?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan5: "https://images.pexels.com/photos/33846710/pexels-photo-33846710.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  caftan6: "https://images.pexels.com/photos/30772402/pexels-photo-30772402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree1: "https://images.pexels.com/photos/18816319/pexels-photo-18816319.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree2: "https://images.pexels.com/photos/28003315/pexels-photo-28003315.png?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree3: "https://images.pexels.com/photos/32244627/pexels-photo-32244627.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree4: "https://images.pexels.com/photos/31062315/pexels-photo-31062315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree5: "https://images.pexels.com/photos/14993779/pexels-photo-14993779.png?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  soiree6: "https://images.pexels.com/photos/31855554/pexels-photo-31855554.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  abaya1: "https://images.pexels.com/photos/1108601/pexels-photo-1108601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  abaya2: "https://images.pexels.com/photos/7249770/pexels-photo-7249770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  abaya3: "https://images.pexels.com/photos/5973765/pexels-photo-5973765.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  abaya4: "https://images.pexels.com/photos/7249445/pexels-photo-7249445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  trad1: "https://images.pexels.com/photos/33743290/pexels-photo-33743290.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  trad2: "https://images.pexels.com/photos/30772402/pexels-photo-30772402.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  trad3: "https://images.pexels.com/photos/33846710/pexels-photo-33846710.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
  atelier1: "https://images.pexels.com/photos/3984853/pexels-photo-3984853.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  atelier2: "https://images.pexels.com/photos/6461104/pexels-photo-6461104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  atelier3: "https://images.pexels.com/photos/6461069/pexels-photo-6461069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  atelier4: "https://images.pexels.com/photos/36731349/pexels-photo-36731349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  atelier5: "https://images.pexels.com/photos/2974110/pexels-photo-2974110.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  atelier6: "https://images.pexels.com/photos/4614258/pexels-photo-4614258.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  fabric1: "https://images.pexels.com/photos/20531147/pexels-photo-20531147.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  fabric2: "https://images.pexels.com/photos/36656908/pexels-photo-36656908.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  fabric3: "https://images.pexels.com/photos/37271028/pexels-photo-37271028.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
  heroWide: "https://images.pexels.com/photos/36478467/pexels-photo-36478467.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000",
};

export const ATELIER_GALLERY = [img.atelier1, img.atelier2, img.atelier3, img.atelier4, img.atelier5, img.atelier6];
// Fabric (tissu) pictures of "Notre univers en images". The dress photos of this strip
// are your own pictures: see UNIVERS_DRESSES in src/data/siteImages.js
export const FABRIC_STRIP = [img.fabric1, img.fabric2, img.fabric3];

let idCounter = 1;
function nextId() {
  return idCounter++;
}

function makeProduct({ category, nameFr, nameAr, price, prepDays, images, colors, isBestSeller, isNew, sizes }) {
  return {
    id: nextId(),
    category,
    name: { fr: nameFr, ar: nameAr },
    price,
    oldPrice: null,
    prepDays,
    images,
    video: "",
    sizes: sizes || ["36", "38", "40", "42", "44", "46"],
    colors: colors || ["Blanc", "Ivoire", "Rose poudré"],
    stock: true,
    isBestSeller: !!isBestSeller,
    isNew: !!isNew,
    createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 60),
    description: {
      fr: "Pièce confectionnée sur-mesure dans notre atelier avec des finitions haut de gamme. Tissu noble, broderies raffinées. Contactez-nous pour toute demande de personnalisation (longueur, coupe, retouche).",
      ar: "قطعة مُفصّلة حسب الطلب في ورشتنا بتشطيبات راقية. قماش فاخر وتطريز أنيق. تواصلي معنا لأي طلب تخصيص (الطول، القصة، التعديل).",
    },
  };
}

export const PRODUCTS = [
  // ---- Robes de mariée ----
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Impériale", nameAr: "فستان زفاف إمبراطوري", price: 45000, prepDays: 20, images: [img.wedding1, img.wedding3, img.wedding5], isBestSeller: true, colors: ["Blanc", "Ivoire"] }),
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Sirène Dentelle", nameAr: "فستان زفاف حورية بالدانتيل", price: 52000, prepDays: 25, images: [img.wedding2, img.wedding4], isNew: true, colors: ["Blanc", "Champagne"] }),
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Princesse", nameAr: "فستان زفاف أميرة", price: 48000, prepDays: 22, images: [img.wedding3, img.wedding1, img.wedding6], colors: ["Blanc", "Ivoire", "Perle"] }),
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Bohème", nameAr: "فستان زفاف بوهيمي", price: 39000, prepDays: 18, images: [img.wedding4, img.wedding2], colors: ["Blanc cassé"] }),
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Haute Couture", nameAr: "فستان زفاف أوت كوتور", price: 65000, prepDays: 30, images: [img.wedding5, img.wedding6, img.wedding1], isBestSeller: true, colors: ["Blanc", "Ivoire"] }),
  makeProduct({ category: "mariage", nameFr: "Robe de Mariée Satin Élégance", nameAr: "فستان زفاف ساتان أنيق", price: 42000, prepDays: 20, images: [img.wedding6, img.wedding3], isNew: true, colors: ["Blanc", "Rose poudré"] }),

  // ---- Caftans ----
  makeProduct({ category: "caftan", nameFr: "Caftan Royal Brodé Or", nameAr: "قفطان ملكي مطرز بالذهبي", price: 28000, prepDays: 15, images: [img.caftan1, img.caftan3], isBestSeller: true, colors: ["Or", "Bordeaux", "Vert émeraude"], sizes: ["38", "40", "42", "44", "46", "48"] }),
  makeProduct({ category: "caftan", nameFr: "Caftan Takchita Deux Pièces", nameAr: "تكشيطة قفطان جزأين", price: 32000, prepDays: 18, images: [img.caftan2, img.caftan5], isNew: true, colors: ["Fuchsia", "Turquoise"] }),
  makeProduct({ category: "caftan", nameFr: "Caftan Satin Perlé", nameAr: "قفطان ساتان مرصع باللؤلؤ", price: 25000, prepDays: 14, images: [img.caftan3, img.caftan1], colors: ["Bleu nuit", "Argent"] }),
  makeProduct({ category: "caftan", nameFr: "Caftan Velours Impérial", nameAr: "قفطان مخمل إمبراطوري", price: 30000, prepDays: 16, images: [img.caftan4, img.caftan6], colors: ["Bordeaux", "Noir doré"] }),
  makeProduct({ category: "caftan", nameFr: "Caftan Moderne Minimaliste", nameAr: "قفطان عصري بسيط", price: 22000, prepDays: 12, images: [img.caftan5, img.caftan2], isBestSeller: true, colors: ["Poudré", "Beige"] }),
  makeProduct({ category: "caftan", nameFr: "Caftan Traditionnel Fassi", nameAr: "قفطان فاسي تقليدي", price: 35000, prepDays: 20, images: [img.caftan6, img.caftan4], colors: ["Vert", "Or"] }),

  // ---- Robes de soirée ----
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Rouge Passion", nameAr: "فستان سهرة أحمر عاطفي", price: 24000, prepDays: 10, images: [img.soiree1, img.soiree4], isBestSeller: true, colors: ["Rouge", "Noir"] }),
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Dorée Glamour", nameAr: "فستان سهرة ذهبي فاخر", price: 27000, prepDays: 12, images: [img.soiree3, img.soiree6], isNew: true, colors: ["Or", "Champagne"] }),
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Longue Fluide", nameAr: "فستان سهرة طويل انسيابي", price: 21000, prepDays: 9, images: [img.soiree2, img.soiree5], colors: ["Jaune", "Vert d'eau"] }),
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Sirène Paillettes", nameAr: "فستان سهرة حورية بالترتر", price: 26000, prepDays: 11, images: [img.soiree5, img.soiree1], colors: ["Argent", "Bleu nuit"] }),
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Courte Chic", nameAr: "فستان سهرة قصير أنيق", price: 18000, prepDays: 8, images: [img.soiree6, img.soiree2], colors: ["Noir", "Bordeaux"] }),
  makeProduct({ category: "soiree", nameFr: "Robe de Soirée Duo Élégance", nameAr: "فستان سهرة أناقة مزدوجة", price: 23000, prepDays: 10, images: [img.soiree4, img.soiree3], colors: ["Rose", "Gris perle"] }),

  // ---- Abayas ----
  makeProduct({ category: "abaya", nameFr: "Abaya Noire Brodée Or", nameAr: "عباية سوداء مطرزة بالذهبي", price: 16000, prepDays: 10, images: [img.abaya1, img.abaya4], isBestSeller: true, colors: ["Noir"], sizes: ["S", "M", "L", "XL", "XXL"] }),
  makeProduct({ category: "abaya", nameFr: "Abaya Dubaï Luxe", nameAr: "عباية دبي فاخرة", price: 19000, prepDays: 12, images: [img.abaya2, img.abaya3], isNew: true, colors: ["Noir", "Marine"], sizes: ["S", "M", "L", "XL"] }),
  makeProduct({ category: "abaya", nameFr: "Abaya Rouge et Or Cérémonie", nameAr: "عباية حمراء وذهبية للمناسبات", price: 21000, prepDays: 14, images: [img.abaya4, img.abaya2], colors: ["Rouge", "Or"], sizes: ["S", "M", "L", "XL"] }),
  makeProduct({ category: "abaya", nameFr: "Abaya Simple Quotidienne", nameAr: "عباية يومية بسيطة", price: 9000, prepDays: 6, images: [img.abaya3, img.abaya1], colors: ["Noir", "Gris"], sizes: ["S", "M", "L", "XL", "XXL"] }),

  // ---- Tenues traditionnelles ----
  makeProduct({ category: "traditionnelle", nameFr: "Robe Kabyle Brodée", nameAr: "فستان قبائلي مطرز", price: 20000, prepDays: 14, images: [img.trad1, img.trad3], isBestSeller: true, colors: ["Rouge", "Multicolore"] }),
  makeProduct({ category: "traditionnelle", nameFr: "Gandoura Chaoui Authentique", nameAr: "قندورة شاوية أصيلة", price: 18000, prepDays: 12, images: [img.trad2, img.trad1], isNew: true, colors: ["Noir", "Bordeaux"] }),
  makeProduct({ category: "traditionnelle", nameFr: "Karakou Algérois", nameAr: "كاراكو جزائري", price: 33000, prepDays: 18, images: [img.trad3, img.trad2], colors: ["Noir", "Grenat"] }),
];

export function getCategoryLabel(id, lang) {
  const c = CATEGORIES.find((cat) => cat.id === id);
  return c ? c[lang] : id;
}
