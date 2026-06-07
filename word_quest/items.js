// ============================================================
// ITEMS.JS - Word Quest equipment definitions
//
// slot: sword | helmet | torso | gloves | foot
// rarity: 1 = Common | 2 = Uncommon | 3 = Rare | 4 = Epic | 5 = Legendary
// droprate: relative drop weight; each slot currently totals 100.
// ============================================================

const ITEMS = [
  // SWORDS
  { id: 'iron_shortsword',       name: 'Iron Shortsword',       slot: 'sword',  dur: 5,  att: 5,  def: 0,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'steel_longsword',       name: 'Steel Longsword',       slot: 'sword',  dur: 8,  att: 8,  def: 0,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_blade',         name: "Knight's Blade",        slot: 'sword',  dur: 12, att: 12, def: 0,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runeblade',             name: 'Runeblade',             slot: 'sword',  dur: 18, att: 18, def: 0,  value: 55,  rarity: 4, droprate: 8  },
  { id: 'celestial_greatsword',  name: 'Celestial Greatsword',  slot: 'sword',  dur: 25, att: 25, def: 0,  value: 120, rarity: 5, droprate: 2  },

  // HELMETS
  { id: 'iron_helmet',           name: 'Iron Helmet',           slot: 'helmet', dur: 5,  att: 0,  def: 2,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'steel_helmet',          name: 'Steel Helmet',          slot: 'helmet', dur: 8,  att: 0,  def: 4,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_helmet',        name: "Knight's Helmet",       slot: 'helmet', dur: 12, att: 0,  def: 7,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_helmet',          name: 'Runed Helmet',          slot: 'helmet', dur: 18, att: 0,  def: 11, value: 55,  rarity: 4, droprate: 8  },
  { id: 'celestial_crown',       name: 'Celestial Crown',       slot: 'helmet', dur: 25, att: 0,  def: 16, value: 120, rarity: 5, droprate: 2  },

  // TORSO ARMOR
  { id: 'leather_armor',         name: 'Leather Armor',         slot: 'torso',  dur: 5,  att: 0,  def: 3,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'chainmail_armor',       name: 'Chainmail Armor',       slot: 'torso',  dur: 8,  att: 0,  def: 6,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_plate',         name: "Knight's Plate",        slot: 'torso',  dur: 12, att: 0,  def: 10, value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_breastplate',     name: 'Runed Breastplate',     slot: 'torso',  dur: 18, att: 0,  def: 15, value: 55,  rarity: 4, droprate: 8  },
  { id: 'celestial_armor',       name: 'Celestial Armor',       slot: 'torso',  dur: 25, att: 0,  def: 22, value: 120, rarity: 5, droprate: 2  },

  // GLOVES
  { id: 'leather_gloves',        name: 'Leather Gloves',        slot: 'gloves', dur: 5,  att: 1,  def: 1,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'iron_gauntlets',        name: 'Iron Gauntlets',        slot: 'gloves', dur: 8,  att: 2,  def: 2,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_gauntlets',     name: "Knight's Gauntlets",    slot: 'gloves', dur: 12, att: 3,  def: 4,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_gauntlets',       name: 'Runed Gauntlets',       slot: 'gloves', dur: 18, att: 5,  def: 6,  value: 55,  rarity: 4, droprate: 8  },
  { id: 'celestial_gauntlets',   name: 'Celestial Gauntlets',   slot: 'gloves', dur: 25, att: 8,  def: 9,  value: 120, rarity: 5, droprate: 2  },

  // FOOT ARMOR
  { id: 'leather_boots',         name: 'Leather Boots',         slot: 'foot',   dur: 5,  att: 0,  def: 1,  value: 5,   rarity: 1, droprate: 50 },
  { id: 'iron_greaves',          name: 'Iron Greaves',          slot: 'foot',   dur: 8,  att: 0,  def: 3,  value: 12,  rarity: 2, droprate: 25 },
  { id: 'knights_greaves',       name: "Knight's Greaves",      slot: 'foot',   dur: 12, att: 0,  def: 5,  value: 25,  rarity: 3, droprate: 15 },
  { id: 'runed_greaves',         name: 'Runed Greaves',         slot: 'foot',   dur: 18, att: 0,  def: 8,  value: 55,  rarity: 4, droprate: 8  },
  { id: 'celestial_greaves',     name: 'Celestial Greaves',     slot: 'foot',   dur: 25, att: 0,  def: 12, value: 120, rarity: 5, droprate: 2  },
];
