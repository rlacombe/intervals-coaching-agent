---
description: "Post-run nutrition analysis — compute water, carbs, sodium, and caffeine intake"
user-invocable: true
---

# /nutrition — Post-Run Nutrition Analysis

Computes total and per-hour intake of water, carbohydrates, sodium, and caffeine from the athlete's reported fueling, then adds a summary note to the Intervals.icu event.

## Step 1: Read knowledge base

Read `knowledge/nutrition.md` to inform the analysis with fueling targets and expert recommendations.

## Step 2: Collect inputs

Ask the athlete (if not already provided) for:
- **What they consumed** — products, quantities, and how they were carried (e.g., "2 gels, 1 waffle, Tailwind in a flask")
- **Water volume** — total liters carried/consumed, and what was mixed into it (electrolyte tabs, drink mix, etc.)

Also identify the activity. If not specified, fetch the most recent activity from the last 3 days using the activities endpoint. You need the **elapsed time** (not moving time) to compute per-hour rates, since the athlete fuels during stops too.

## Step 3: Look up nutritional data

Use the reference table below for common products. For products not listed, use your best knowledge of the product's nutrition facts — state your assumptions and invite corrections.

### Common Products Reference

#### Gels (~1 oz / 32g packets)
| Product | CHO (g) | Sodium (mg) | Caffeine (mg) |
|---|---|---|---|
| Honey Stinger Honey Gel | 24 | 50 | 0 |
| Honey Stinger Ginsting Gel (caffeinated) | 24 | 60 | 32 |
| Honey Stinger Salted Caramel Gel (caffeinated) | 24 | 50 | 32 |
| GU Energy Gel (non-caffeinated) | 22 | 125 | 0 |
| GU Roctane Gel (caffeinated, varies) | 21 | 125 | 35 |
| SiS GO Isotonic Gel | 22 | 20 | 0 |
| SiS GO + Caffeine Gel (Double Espresso, etc.) | 22 | 20 | 75 |
| Spring Energy Awesome Sauce | 45 | 115 | 0 |
| Maurten Gel 100 | 25 | 30 | 0 |
| Maurten Gel 100 CAF 100 | 25 | 30 | 100 |

#### Waffles / Chews / Bars
| Product | CHO (g) | Sodium (mg) | Caffeine (mg) |
|---|---|---|---|
| Honey Stinger Honey Waffle | 21 | 50 | 0 |
| Honey Stinger Salted Caramel Waffle | 21 | 85 | 0 |
| GU Energy Chews (1 packet) | 34 | 70 | 0 |
| Clif Blok (1 packet, 6 chews) | 24 | 70 | 0 |
| Muir Energy Bar (varies) | 28 | 40 | 0 |

#### Drink Mixes (per serving as labeled)
| Product | Serving | CHO (g) | Sodium (mg) | Caffeine (mg) |
|---|---|---|---|---|
| Tailwind Endurance Fuel | 1 scoop (27g) | 25 | 150 | 0 |
| Tailwind Endurance Fuel (caffeinated) | 1 scoop (27g) | 25 | 150 | 35 |
| Tailwind High Carb | see note | see note | see note | 0 |
| Skratch Labs Exercise Mix | 1 scoop (22g) | 20 | 190 | 0 |
| Maurten Drink Mix 320 | 1 packet (80g) | 79 | 180 | 0 |

> **Tailwind note:** Athletes often describe Tailwind by total CHO rather than scoops (e.g., "90g CHO of Tailwind"). To compute sodium: ~150mg per 25g CHO (i.e., multiply CHO grams by 6 to get sodium in mg). Caffeinated flavors add 35mg caffeine per 25g CHO.

#### Electrolyte Tablets / Capsules (no/minimal calories)
| Product | CHO (g) | Sodium (mg) | Caffeine (mg) |
|---|---|---|---|
| Nuun Sport (1 tab / 500mL) | 1 | 300 | 0 |
| Nuun Energy (1 tab / 500mL) | 2 | 300 | 40 |
| LMNT (1 packet) | 0 | 1000 | 0 |
| SaltStick Cap (1 capsule) | 0 | 215 | 0 |
| Precision Fuel & Hydration PH 1500 (1 tab) | 0 | 500 | 0 |

## Step 4: Compute totals

Build a table showing each item, its quantity, and its contribution:

```
| Item | CHO (g) | Sodium (mg) | Caffeine (mg) |
|---|---|---|---|
| [Product] x [qty] | ... | ... | ... |
| ...  | ... | ... | ... |
| **Total** | **XXXg** | **X,XXXmg** | **XXmg** |
```

Add total water consumed as a separate line.

## Step 5: Compute per-hour rates

Divide totals by **elapsed time in hours** (not moving time — the athlete fuels during stops too).

```
| Water | Carbs | Sodium | Caffeine |
|---|---|---|---|
| X.X L/hr | XX g/hr | XXX mg/hr | XX mg/hr |
```

## Step 6: Compare to targets

Reference targets from `knowledge/nutrition.md` and the athlete's profile:

| Metric | Target Range | Source |
|---|---|---|
| Water | 0.5-1.0 L/hr (heat/effort dependent) | Athlete profile, conditions |
| Carbs | 60-90 g/hr (trained gut) | Koop: 30-60g, modern research: up to 90g+ |
| Sodium | 500-700 mg/hr | Standard electrolyte guidance |
| Caffeine | 0-50 mg/hr (save for back half in ultras) | Strategic use, ~3-6mg/kg total |

Flag anything notably above or below target. Note any GI issues the athlete reported. If carbs are above 60g/hr with no GI issues, acknowledge that the gut is well-trained.

## Step 7: Add note to Intervals.icu event

Find the matching planned event for the activity date using the events endpoint. Update its description to append a nutrition summary line:

```
💧 X.XL (X.XL/h) | 🍪 XXg/h | 🧂 XXX mg/h | ☕ XX mg/h
```

Round values to whole numbers for carbs/sodium/caffeine, one decimal for water. Use the update event endpoint to append this line to the existing description (do not overwrite it — read the current description first and append).

## Step 8: Coaching note

Offer one brief observation:
- Is the athlete hitting their targets?
- Any changes to consider for race day?
- Caffeine timing strategy (save for back half of long races)
- Hydration vs conditions (was it hot? did they drink enough?)
- GI tolerance — is the gut trained for this intake rate?
