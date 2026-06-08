# Word Quest Roadmap

## Implemented: Mana and Initial Spell System

### Core Rules

- Player starts with 20 MP.
- Maximum and current mana increase by 5 on every level-up.
- The XP bar is replaced by a blue mana bar; XP remains as header text.
- Mana is restored by Mana Potions and the Mana Fountain random event.
- Mana Potions restore 20 MP.
- The `CAST SPELL` button unlocks at 3 streak and becomes disabled again when streak resets.
- Casting a spell resets streak.
- New spells will later be learned from the Town Mage's Guild.

### Starting Spell: Slow

- Mana cost: 15
- Adds 3 seconds to the current enemy's attack timer/speed.
- The effect lasts only for the current battle.
- Slow cannot stack.
- Slow does not permanently modify enemy definitions.

## Future Major Update: Town

### Core Flow

- Divide the adventure into biomes.
- After completing each biome, return the player to Town.
- Town acts as the safe hub between biomes.
- The player continues to the next biome after finishing their Town activities.

### Town Locations

- Blacksmith
- Inn
- Shop

### Decisions Needed Before Implementation

- Number of enemies and bosses in each biome.
- Which services and upgrades the Blacksmith provides.
- What resting at the Inn restores and how much it costs.
- How the Town Shop differs from shops encountered during a run.
- Whether Town progress, upgrades, and inventory are permanent.
- Whether returning to Town fully restores HP, mana, and equipment durability.
- How the player chooses and begins the next biome.

## Future Random Event: Wandering Blacksmith

- Add `Wandering Blacksmith` to the random event pool.
- Present blacksmith services during a run without requiring a Town visit.
- Give the event its own image, description, choices, result messages, and save/load-safe behavior.

### Decisions Needed Before Implementation

- Which equipment slots the Wandering Blacksmith can service.
- Whether the event repairs durability, upgrades equipment, sells items, or offers multiple choices.
- Gold costs and service limits.
- How its services differ from the Town Blacksmith.
- Whether refusing or being unable to pay has an alternate outcome.
