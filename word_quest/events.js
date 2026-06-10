// ============================================================
// EVENTS.JS - Random events shown between defeated enemies
//
// effect.type:
//   heal_percent : restores a percentage of max HP
//   gold         : grants a random amount in [min, max]
//   xp           : grants a random amount in [min, max]
//   potion       : grants the specified number of health potions
//   mana_restore : restores mana, or all mana when full is true
//   blacksmith   : opens the wandering blacksmith Trade/Repair interface
//   hp_loss      : removes a percentage of max HP, but cannot kill
//   nothing      : no gameplay effect
//
// imagePath: event illustration shown in the random event overlay
// choices: optional list of player choices; each choice has label and effect
// ============================================================

const RANDOM_EVENTS = [
  {
    id: 'healing_spring',
    title: 'HEALING SPRING',
    icon: '\u2726',
    imagePath: 'images/events/healing_spring.webp',
    description: 'You discover a peaceful spring glowing between the ruins. Some of your wounds have healed.',
    effect: { type: 'heal_percent', value: 0.30 },
  },
  {
    id: 'mana_fountain',
    title: 'MANA FOUNTAIN',
    icon: '\u2727',
    imagePath: 'images/events/mana_fountain.webp',
    description: 'Arcane water flows from an ancient fountain. You drink from it and it restores your mana.',
    effect: { type: 'mana_restore', full: true },
  },
  {
    id: 'forgotten_purse',
    title: 'FORGOTTEN PURSE',
    icon: '\u25C6',
    imagePath: 'images/events/forgotten_purse.webp',
    description: 'A weathered purse lies abandoned beside the road. You found some gold inside.',
    effect: { type: 'gold', min: 15, max: 35 },
  },
  {
    id: 'ancient_shrine',
    title: 'ANCIENT SHRINE',
    icon: '\u2605',
    imagePath: 'images/events/ancient_shrine.webp',
    description: 'Ancient runes briefly reveal the secrets of past warriors. You gained XP!',
    effect: { type: 'xp', min: 20, max: 45 },
  },
  {
    id: 'travellers_cache',
    title: "TRAVELLER'S CACHE",
    icon: '+',
    imagePath: 'images/events/travellers_cache.webp',
    description: 'You found a Potion of Healing in a supply cache hidden off the path.',
    effect: { type: 'potion', value: 1 },
  },
  {
    id: 'mysterious_altar',
    title: 'MYSTERIOUS ALTAR',
    icon: '?',
    imagePath: 'images/events/mysterious_altar.webp',
    description: 'A dark altar hums with unstable power. What will you do?',
    choices: [
      { label: 'PUT GOLD ON ALTAR', cost: { type: 'gold', value: 20 }, reward: { type: 'xp', min: 45, max: 70 } },
      { label: 'LEAVE', effect: { type: 'nothing' } },
    ],
  },
  {
    id: 'wandering_merchant',
    title: 'WANDERING MERCHANT',
    icon: '$',
    imagePath: 'images/events/wandering_merchant.webp',
    description: 'A travelling merchant offers you a sealed healing potion.',
    choices: [
      { label: 'BUY FOR 30 GOLD', cost: { type: 'gold', value: 30 }, effect: { type: 'potion', value: 1 } },
      { label: 'REFUSE AND WALK AWAY', effect: { type: 'nothing' } },
    ],
  },
  {
    id: 'wandering_blacksmith',
    title: 'WANDERING BLACKSMITH',
    icon: '\u2692',
    imagePath: 'images/events/wandering_blacksmith.webp',
    description: 'The ringing of a hammer echoes along the road. A wandering blacksmith offers to trade and repair your equipment.',
    choices: [
      { label: 'VISIT BLACKSMITH', effect: { type: 'blacksmith' } },
      { label: 'CONTINUE JOURNEY', effect: { type: 'nothing' } },
    ],
  },
];
