// ============================================================
// ITEMS.JS - Word Quest equipment definitions
//
// slot: sword | helmet | torso | gloves | foot
// rarity: 1 = Common | 2 = Uncommon | 3 = Rare | 4 = Epic | 5 = Legendary
// droprate: relative drop weight; each slot currently totals 100.
// ============================================================

const POTIONS = [
  { id: 'health_potion',         name: 'Health Potion',         imagePath: 'items/potions/health.png',        effect: 'heal',    amount: 30,  value: 10, rarity: 1, droprate: 50 },
  { id: 'greater_health_potion', name: 'Greater Health Potion', imagePath: 'items/potions/greaterhealth.png', effect: 'heal',    amount: 60,  value: 50, rarity: 2, droprate: 25 },
  { id: 'mega_health_potion',    name: 'Mega Health Potion',    imagePath: 'items/potions/megahealth.png',    effect: 'heal',    amount: 100, value: 100, rarity: 3, droprate: 15 },
  { id: 'mana_potion',           name: 'Mana Potion',           imagePath: 'items/potions/mana.png',          effect: 'mana',    amount: 20,  value: 25, rarity: 3, droprate: 8  },
  { id: 'stamina_potion',        name: 'Stamina Potion',        imagePath: 'items/potions/stamina.png',       effect: 'stamina', amount: 50,  value: 50, rarity: 3, droprate: 8  },
];

const ITEMS = [
  // SWORDS
  { id: 'iron_shortsword',       name: 'Iron Shortsword',       slot: 'sword',  imagePath: 'items/sword/iron_shortsword.png',      dur: 3,  att: 3,  def: 0,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'steel_longsword',       name: 'Steel Longsword',       slot: 'sword',  imagePath: 'items/sword/steel_longsword.png',      dur: 5,  att: 5,  def: 0,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_blade',         name: "Knight's Blade",        slot: 'sword',  imagePath: 'items/sword/knights_blade.png',        dur: 8, att: 8, def: 0,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runeblade',             name: 'Runeblade',             slot: 'sword',  imagePath: 'items/sword/runeblade.png',            dur: 12, att: 12, def: 0,  value: 255,  rarity: 4, droprate: 3  },
  { id: 'celestial_greatsword',  name: 'Celestial Greatsword',  slot: 'sword',  imagePath: 'items/sword/celestial_greatsword.png', dur: 15, att: 15, def: 0,  value: 520, rarity: 5, droprate: 0.1, indestructible: 1 },

  // HELMETS
  { id: 'iron_helmet',           name: 'Iron Helmet',           slot: 'helmet', imagePath: 'items/helmet/iron_helmet.png',     dur: 3,  att: 0,  def: 2,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'steel_helmet',          name: 'Steel Helmet',          slot: 'helmet', imagePath: 'items/helmet/steel_helmet.png',    dur: 5,  att: 0,  def: 4,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_helmet',        name: "Knight's Helmet",       slot: 'helmet', imagePath: 'items/helmet/knights_helmet.png',  dur: 8,  att: 0,  def: 7,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_helmet',          name: 'Runed Helmet',          slot: 'helmet', imagePath: 'items/helmet/runed_helmet.png',    dur: 12, att: 0,  def: 11, value: 55,  rarity: 4, droprate: 3  },
  { id: 'celestial_crown',       name: 'Celestial Crown',       slot: 'helmet', imagePath: 'items/helmet/celestial_crown.png', dur: 15, att: 0,  def: 16, value: 520, rarity: 5, droprate: 0.1, indestructible: 1 },

  // TORSO ARMOR
  { id: 'leather_armor',         name: 'Leather Armor',         slot: 'torso',  imagePath: 'items/torso/leather_armor.png',     dur: 3,  att: 0,  def: 3,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'chainmail_armor',       name: 'Chainmail Armor',       slot: 'torso',  imagePath: 'items/torso/chainmail_armor.png',   dur: 5,  att: 0,  def: 6,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_plate',         name: "Knight's Plate",        slot: 'torso',  imagePath: 'items/torso/knights_plate.png',     dur: 8, att: 0,  def: 10, value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_breastplate',     name: 'Runed Breastplate',     slot: 'torso',  imagePath: 'items/torso/runed_breastplate.png', dur: 12, att: 0,  def: 15, value: 55,  rarity: 4, droprate: 3  },
  { id: 'celestial_armor',       name: 'Celestial Armor',       slot: 'torso',  imagePath: 'items/torso/celestial_armor.png',   dur: 15, att: 0,  def: 22, value: 520, rarity: 5, droprate: 0.1, indestructible: 1 },

  // GLOVES
  { id: 'leather_gloves',        name: 'Leather Gloves',        slot: 'gloves', imagePath: 'items/gloves/leather_gloves.png',      dur: 3,  att: 0,  def: 2,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'iron_gauntlets',        name: 'Iron Gauntlets',        slot: 'gloves', imagePath: 'items/gloves/iron_gauntlets.png',      dur: 5,  att: 1,  def: 3,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_gauntlets',     name: "Knight's Gauntlets",    slot: 'gloves', imagePath: 'items/gloves/knights_gauntlets.png',   dur: 8, att: 2,  def: 5,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_gauntlets',       name: 'Runed Gauntlets',       slot: 'gloves', imagePath: 'items/gloves/runed_gauntlets.png',     dur: 12, att: 3,  def: 7,  value: 55,  rarity: 4, droprate: 3  },
  { id: 'celestial_gauntlets',   name: 'Celestial Gauntlets',   slot: 'gloves', imagePath: 'items/gloves/celestial_gauntlets.png', dur: 15, att: 5,  def: 11, value: 520, rarity: 5, droprate: 0.1, indestructible: 1 },

  // FOOT ARMOR
  { id: 'leather_boots',         name: 'Leather Boots',         slot: 'foot',   imagePath: 'items/foot/leather_boots.png',       dur: 3,  att: 0,  def: 1,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'iron_greaves',          name: 'Iron Greaves',          slot: 'foot',   imagePath: 'items/foot/iron_greaves.png',        dur: 5,  att: 0,  def: 3,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_greaves',       name: "Knight's Greaves",      slot: 'foot',   imagePath: 'items/foot/knights_greaves.png',     dur: 8,  att: 0,  def: 5,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_greaves',         name: 'Runed Greaves',         slot: 'foot',   imagePath: 'items/foot/runed_greaves.png',       dur: 12, att: 0,  def: 8,  value: 55,  rarity: 4, droprate: 3  },
  { id: 'celestial_greaves',     name: 'Celestial Greaves',     slot: 'foot',   imagePath: 'items/foot/celestial_greaves.png',   dur: 15, att: 0,  def: 12, value: 520, rarity: 5, droprate: 0.1, indestructible: 1 },
];
