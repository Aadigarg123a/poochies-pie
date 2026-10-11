/**
 * Hard-coded copy of the owner's printed menu. DO NOT import from src/data here.
 * If a price changes, update BOTH this file and src/data/menu.ts.
 */

export const EXPECTED_HALF_KG_CAKES: Record<string, { diet: 'veg' | 'non-veg'; price: number }> = {
  'Going Bananas': { diet: 'veg', price: 1100 },
  'Carrot Twist': { diet: 'veg', price: 1100 },
  'Pumpkin Lava': { diet: 'veg', price: 1100 },
  'Apple of my Pie': { diet: 'veg', price: 1150 },
  'Mango Masti': { diet: 'veg', price: 1150 },
  'Chicken Overloaded': { diet: 'non-veg', price: 1200 },
  'Chicken Farmhouse': { diet: 'non-veg', price: 1200 },
  'Mutton Delight': { diet: 'non-veg', price: 1250 },
  "Something's Fishy": { diet: 'non-veg', price: 1250 },
}

export const EXPECTED_HALF_KG_ADD_ONS: Record<string, number> = {
  Cheese: 50,
  Coconut: 50,
  'Paw Design': 60,
  'Mini Face': 100,
  'Full Face Cake': 150,
  'Name Banner': 100,
}

export const EXPECTED_ONE_KG_SURCHARGE = 800
export const EXPECTED_BONE_SURCHARGE = 900

export const EXPECTED_MINI_CAKES: Record<string, number> = {
  'Going Bananas': 700,
  'Carrot Twist': 700,
  'Pumpkin Lava': 700,
  'Apple of my Pie': 750,
  'Mango Masti': 750,
  'Chicken Overloaded': 800,
  'Chicken Farmhouse': 800,
  'Mutton Delight': 850,
  "Something's Fishy": 850,
}

export const EXPECTED_MINI_ADD_ONS: Record<string, number> = {
  Cheese: 50,
  Coconut: 50,
  'Paw Design': 60,
  'Mini Face': 50,
  'Full Face Cake': 100,
  'Name Banner': 50,
}

export const EXPECTED_SHARED_FLAVOURS = {
  veg: ['Apple of my Pie', 'Going Bananas', 'Carrot Twist', 'Pumpkin Lava'],
  nonVeg: ['Chicken Overloaded', 'Chicken Farmhouse'],
}

export const EXPECTED_DOGNUTS = [
  { count: 2, veg: 500, nonVeg: 550 },
  { count: 4, veg: 700, nonVeg: 750 },
  { count: 6, veg: 900, nonVeg: 950 },
]

export const EXPECTED_CUPCAKES = [
  { count: 4, veg: 750, nonVeg: 800 },
  { count: 6, veg: 1050, nonVeg: 1100 },
]
export const EXPECTED_CUPCAKE_FACE_EACH = 50

/** slug → [variant name, price][] */
export const EXPECTED_SIMPLE_ITEMS: Record<string, [string, number][]> = {
  'protein-idlis': [
    ['Pack of 4', 500],
    ['Pack of 8', 800],
  ],
  'pup-icecream': [
    ['250 ml', 300],
    ['500 ml', 500],
  ],
  'coconut-ladoos': [
    ['250 g', 400],
    ['500 g', 700],
  ],
  'pet-friendly-beer': [['Chicken-based Beer', 350]],
  'gluten-free-cookies': [['Pumpkin-carrot face-shaped cookies', 350]],
  'happy-birthday-cap': [['Happy Birthday Cap', 50]],
  'tuxedo-bandana': [
    ['Small-Medium', 450],
    ['Large', 500],
  ],
  'sailor-bow': [
    ['without Neck Band', 350],
    ['with Neck Band', 400],
  ],
  'bow-with-neck-band': [
    ['Small Breeds', 350],
    ['Big Breeds', 400],
  ],
  'happy-birthday-bandana': [
    ['Small', 350],
    ['Medium-Large', 400],
  ],
  'ethnic-bow': [
    ['Small', 300],
    ['Medium-Large', 350],
  ],
  'cat-bow-tie': [['Bow-tie for cats', 150]],
}

export const EXPECTED_ICECREAM_FLAVOURS = ['Mango', 'Banana-peanutbutter']
