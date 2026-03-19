export type CountryRecipe = {
  slug: string
  title: string
  description: string
  timeMinutes: number
  servings: number
  difficulty: "Fácil" | "Media" | "Difícil"
  image: string
  ingredients: string[]
  steps: string[]
}

export type CuisineCountry = {
  slug: string
  name: string
  flag: string
  intro: string
  image: string
  recipes: CountryRecipe[]
}

export const cuisineCountries: CuisineCountry[] = [
  {
    slug: "estados-unidos",
    name: "Estados Unidos",
    flag: "US",
    intro: "Recetas clásicas americanas, rápidas y con mucho sabor.",
    image: "/flags/us.svg",
    recipes: [
      {
        slug: "mac-and-cheese-horneado",
        title: "Mac and Cheese Horneado",
        description: "Pasta cremosa con mezcla de quesos y costra dorada al horno.",
        timeMinutes: 40,
        servings: 4,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=1200&auto=format&fit=crop",
        ingredients: [
          "400 g de pasta corta",
          "2 cucharadas de mantequilla",
          "2 cucharadas de harina",
          "500 ml de leche",
          "250 g de cheddar rallado",
          "80 g de parmesano",
          "Sal, pimienta y pimentón",
          "Pan rallado para gratinar",
        ],
        steps: [
          "Hierve la pasta en agua con sal hasta que quede al dente y resérvala.",
          "En una olla, derrite la mantequilla, añade la harina y cocina 1 minuto mezclando.",
          "Incorpora la leche poco a poco sin dejar de batir para evitar grumos.",
          "Cuando la salsa espese, agrega cheddar y la mitad del parmesano hasta fundir.",
          "Ajusta sal, pimienta y pimentón; luego mezcla con la pasta cocida.",
          "Pasa a una fuente, cubre con pan rallado y el parmesano restante.",
          "Hornea a 200°C por 12 a 15 minutos hasta que se dore la superficie.",
          "Deja reposar 5 minutos y sirve caliente.",
        ],
      },
      {
        slug: "pancakes-clasicos",
        title: "Pancakes Clásicos",
        description: "Panqueques esponjosos para desayuno con miel o frutas.",
        timeMinutes: 20,
        servings: 3,
        difficulty: "Fácil",
        image:
          "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=1200&auto=format&fit=crop",
        ingredients: [
          "1 taza de harina",
          "1 cucharada de azúcar",
          "1 cucharadita de polvo de hornear",
          "1 huevo",
          "3/4 taza de leche",
          "1 cucharada de mantequilla derretida",
          "Pizca de sal",
        ],
        steps: [
          "Mezcla en un bowl harina, azúcar, polvo de hornear y sal.",
          "En otro bowl bate huevo, leche y mantequilla derretida.",
          "Une ambas mezclas hasta obtener una masa homogénea sin sobrebatir.",
          "Calienta sartén antiadherente a fuego medio y engrasa ligeramente.",
          "Vierte porciones pequeñas y cocina hasta ver burbujas en la superficie.",
          "Voltea y cocina 1 minuto adicional hasta dorar ambos lados.",
          "Sirve en torre con frutas, miel o mantequilla.",
        ],
      },
    ],
  },
  {
    slug: "colombia",
    name: "Colombia",
    flag: "CO",
    intro: "Sabores tradicionales colombianos, caseros y reconfortantes.",
    image: "/flags/co.svg",
    recipes: [
      {
        slug: "ajiaco-bogotano",
        title: "Ajiaco Bogotano",
        description: "Sopa típica con pollo, papas y guascas.",
        timeMinutes: 70,
        servings: 6,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&auto=format&fit=crop",
        ingredients: [
          "1 pechuga de pollo",
          "3 tipos de papa (criolla, pastusa, sabanera)",
          "1 mazorca en trozos",
          "Guascas secas",
          "1 cebolla larga",
          "Ajo y sal",
          "Crema de leche, alcaparras y aguacate para servir",
        ],
        steps: [
          "Cocina el pollo con agua, cebolla y ajo para obtener un caldo base.",
          "Retira el pollo, desmenúzalo y reserva.",
          "Agrega las papas y la mazorca al caldo y cocina a fuego medio.",
          "Cuando parte de la papa se deshaga, incorpora las guascas.",
          "Devuelve el pollo desmechado y ajusta sal al gusto.",
          "Cocina 10 minutos más para integrar sabores.",
          "Sirve con crema de leche, alcaparras y aguacate al lado.",
        ],
      },
      {
        slug: "arepa-rellena-pollo",
        title: "Arepa Rellena de Pollo",
        description: "Arepa dorada con relleno cremoso de pollo desmechado.",
        timeMinutes: 35,
        servings: 4,
        difficulty: "Fácil",
        image:
          "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop",
        ingredients: [
          "4 arepas blancas",
          "2 tazas de pollo cocido desmechado",
          "1/2 taza de maíz dulce",
          "2 cucharadas de mayonesa",
          "1 cucharada de cilantro picado",
          "Sal y pimienta",
        ],
        steps: [
          "Tuesta las arepas en sartén hasta que estén doradas y crujientes.",
          "Mezcla el pollo desmechado con maíz, mayonesa, cilantro, sal y pimienta.",
          "Abre las arepas por un costado sin separarlas totalmente.",
          "Rellena generosamente con la mezcla de pollo.",
          "Lleva 2 minutos más al sartén para calentar el relleno.",
          "Sirve de inmediato.",
        ],
      },
    ],
  },
  {
    slug: "inglaterra",
    name: "Inglaterra",
    flag: "GB",
    intro: "Platos británicos clásicos, sencillos y perfectos para compartir.",
    image: "/flags/gb.svg",
    recipes: [
      {
        slug: "fish-and-chips",
        title: "Fish and Chips",
        description: "Filete de pescado crujiente con papas fritas doradas.",
        timeMinutes: 45,
        servings: 4,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=1200&auto=format&fit=crop",
        ingredients: [
          "4 filetes de pescado blanco",
          "4 papas grandes",
          "1 taza de harina",
          "1 taza de cerveza fría o agua con gas",
          "Sal, pimienta y limón",
          "Aceite para freír",
        ],
        steps: [
          "Pela y corta las papas en bastones gruesos.",
          "Fríe las papas a fuego medio hasta cocerlas y retíralas.",
          "Mezcla harina, sal y cerveza fría para crear un batido espeso.",
          "Salpimienta el pescado, pásalo por harina y luego por el batido.",
          "Fríe el pescado hasta dorar y quedar crujiente.",
          "Da una segunda fritura rápida a las papas para que queden más crocantes.",
          "Sirve con limón y salsa tártara.",
        ],
      },
      {
        slug: "shepherd-pie",
        title: "Shepherd's Pie",
        description: "Pastel de carne con cobertura de puré de papa gratinado.",
        timeMinutes: 55,
        servings: 5,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1604908176997-4311b7a6f785?w=1200&auto=format&fit=crop",
        ingredients: [
          "500 g de carne molida",
          "1 cebolla picada",
          "1 zanahoria picada",
          "2 cucharadas de pasta de tomate",
          "4 papas grandes cocidas",
          "2 cucharadas de mantequilla",
          "Leche, sal y pimienta",
        ],
        steps: [
          "Sofríe cebolla y zanahoria hasta ablandar.",
          "Añade la carne molida y cocina hasta dorar.",
          "Incorpora pasta de tomate, sal, pimienta y un poco de agua; cocina 10 minutos.",
          "Prepara puré con las papas, mantequilla, leche, sal y pimienta.",
          "Coloca la carne en una fuente y cubre con puré.",
          "Dora con tenedor la superficie para textura.",
          "Hornea a 200°C por 20 minutos hasta gratinar.",
        ],
      },
    ],
  },
  {
    slug: "francia",
    name: "Francia",
    flag: "FR",
    intro: "Recetas francesas elegantes y llenas de técnica.",
    image: "/flags/fr.svg",
    recipes: [
      {
        slug: "ratatouille-clasico",
        title: "Ratatouille Clásico",
        description: "Guiso de vegetales provenzal, aromático y ligero.",
        timeMinutes: 50,
        servings: 4,
        difficulty: "Fácil",
        image:
          "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=1200&auto=format&fit=crop",
        ingredients: [
          "1 berenjena",
          "1 zucchini",
          "1 pimentón rojo",
          "2 tomates",
          "1 cebolla",
          "Ajo, tomillo y aceite de oliva",
          "Sal y pimienta",
        ],
        steps: [
          "Corta todos los vegetales en cubos similares.",
          "Sofríe cebolla y ajo con aceite de oliva.",
          "Añade berenjena y cocina 5 minutos.",
          "Incorpora zucchini, pimentón y tomate.",
          "Agrega tomillo, sal y pimienta.",
          "Cocina tapado a fuego bajo 25 minutos, removiendo ocasionalmente.",
          "Sirve caliente con pan rústico.",
        ],
      },
      {
        slug: "quiche-lorraine",
        title: "Quiche Lorraine",
        description: "Tarta salada de tocino, huevo y crema.",
        timeMinutes: 60,
        servings: 6,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?w=1200&auto=format&fit=crop",
        ingredients: [
          "1 base de masa quebrada",
          "200 g de tocino",
          "3 huevos",
          "250 ml de crema de leche",
          "120 g de queso rallado",
          "Sal, pimienta y nuez moscada",
        ],
        steps: [
          "Prehornea la masa 10 minutos a 180°C.",
          "Dora el tocino en sartén y escurre grasa.",
          "Bate huevos, crema, sal, pimienta y nuez moscada.",
          "Distribuye el tocino sobre la base y añade queso.",
          "Vierte la mezcla líquida encima.",
          "Hornea 30 a 35 minutos hasta cuajar y dorar.",
          "Deja reposar 10 minutos antes de cortar.",
        ],
      },
    ],
  },
  {
    slug: "argentina",
    name: "Argentina",
    flag: "AR",
    intro: "Sabores argentinos tradicionales, carne y masas irresistibles.",
    image: "/flags/ar.svg",
    recipes: [
      {
        slug: "empanadas-carne",
        title: "Empanadas de Carne",
        description: "Empanadas jugosas al horno con relleno clásico criollo.",
        timeMinutes: 55,
        servings: 6,
        difficulty: "Media",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop",
        ingredients: [
          "12 discos de empanada",
          "500 g de carne molida",
          "1 cebolla",
          "1 pimentón",
          "2 huevos cocidos",
          "Aceitunas verdes",
          "Comino, pimentón, sal y pimienta",
        ],
        steps: [
          "Sofríe cebolla y pimentón picados.",
          "Añade carne y cocina hasta dorar.",
          "Condimenta con comino, pimentón, sal y pimienta.",
          "Incorpora huevo cocido picado y aceitunas.",
          "Rellena cada disco, cierra y haz repulgue.",
          "Pinta con huevo batido.",
          "Hornea a 200°C por 20 minutos hasta dorar.",
        ],
      },
      {
        slug: "chimichurri-casero",
        title: "Chimichurri Casero",
        description: "Salsa argentina ideal para carnes y asados.",
        timeMinutes: 15,
        servings: 8,
        difficulty: "Fácil",
        image:
          "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&auto=format&fit=crop",
        ingredients: [
          "1 taza de perejil fresco",
          "3 dientes de ajo",
          "1 cucharada de orégano",
          "1/2 cucharadita de ají molido",
          "1/3 taza de vinagre",
          "1/2 taza de aceite de oliva",
          "Sal y pimienta",
        ],
        steps: [
          "Pica finamente perejil y ajo.",
          "Mezcla con orégano y ají molido en un bowl.",
          "Agrega vinagre y aceite de oliva.",
          "Sazona con sal y pimienta.",
          "Deja reposar al menos 20 minutos antes de servir.",
        ],
      },
    ],
  },
  {
    slug: "brasil",
    name: "Brazil",
    flag: "BR",
    intro: "Cocina brasileña vibrante, ideal para compartir en familia.",
    image: "/flags/br.svg",
    recipes: [
      {
        slug: "feijoada-tradicional",
        title: "Feijoada Tradicional",
        description: "Guiso de frijoles negros con carnes, típico de Brasil.",
        timeMinutes: 90,
        servings: 8,
        difficulty: "Difícil",
        image:
          "https://images.unsplash.com/photo-1598514982841-5f3cf7f28ab6?w=1200&auto=format&fit=crop",
        ingredients: [
          "500 g de frijol negro",
          "300 g de costilla de cerdo",
          "200 g de chorizo",
          "1 cebolla",
          "3 dientes de ajo",
          "Hojas de laurel",
          "Sal y pimienta",
        ],
        steps: [
          "Remoja los frijoles durante la noche.",
          "Cocina los frijoles con laurel hasta ablandar.",
          "Dora costilla y chorizo en olla aparte.",
          "Añade cebolla y ajo picados, cocina hasta transparentar.",
          "Integra frijoles cocidos con parte de su caldo.",
          "Cocina a fuego bajo 35 a 40 minutos para concentrar sabor.",
          "Ajusta sal y pimienta y sirve con arroz blanco.",
        ],
      },
      {
        slug: "pao-de-queijo",
        title: "Pão de Queijo",
        description: "Panecillos de queso brasileños suaves por dentro y dorados fuera.",
        timeMinutes: 35,
        servings: 5,
        difficulty: "Fácil",
        image:
          "https://images.unsplash.com/photo-1613145993488-809fdad5f904?w=1200&auto=format&fit=crop",
        ingredients: [
          "2 tazas de almidón de yuca",
          "1 taza de queso rallado",
          "1/2 taza de leche",
          "1/4 taza de aceite",
          "1 huevo",
          "Sal",
        ],
        steps: [
          "Calienta leche, aceite y sal sin hervir.",
          "Vierte sobre el almidón de yuca y mezcla.",
          "Agrega huevo y queso rallado.",
          "Amasa hasta lograr una mezcla uniforme.",
          "Forma bolitas pequeñas y ponlas en bandeja.",
          "Hornea a 190°C por 20 minutos hasta dorar.",
          "Sirve tibios.",
        ],
      },
    ],
  },
]

export function getCountryBySlug(countrySlug: string) {
  return cuisineCountries.find((country) => country.slug === countrySlug)
}

export function getRecipeBySlugs(countrySlug: string, recipeSlug: string) {
  const country = getCountryBySlug(countrySlug)
  if (!country) return null

  const recipe = country.recipes.find((item) => item.slug === recipeSlug)
  if (!recipe) return null

  return { country, recipe }
}
