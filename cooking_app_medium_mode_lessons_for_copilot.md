# Cooking Learning App — Medium Mode Lessons for JSON Conversion

Use this file as the revised source material for converting the Medium Mode lessons into JSON.

## Revision Notes

- Medium Mode keeps the same lesson titles and structure as Easy Mode.
- Medium Mode mini lesson text is rewritten to fit the two questions underneath it and give stronger context clues.
- Each Medium Mode skill has exactly 3 mini lessons.
- Each mini lesson has exactly 2 questions.
- Each skill has exactly 6 questions total.
- Exact duplicate questions from Easy Mode have been replaced.
- Correct answers are intentionally rotated between A, B, C, and D. Do not assume the correct answer is always A.

## Suggested JSON Shape

```json
{
  "categories": [
    {
      "name": "Ingredient Substitutions",
      "skills": [
        {
          "name": "Dairy Swaps",
          "lessons": [
            {
              "title": "Dairy Does More Than Add Liquid",
              "lessonText": "...",
              "questionsByDifficulty": {
                "easy": [
                  {
                    "text": "...",
                    "choices": ["A...", "B...", "C...", "D..."],
                    "correctAnswer": "D",
                    "feedback": "..."
                  }
                ],
                "medium": [
                  {
                    "text": "...",
                    "choices": ["A...", "B...", "C...", "D..."],
                    "correctAnswer": "C",
                    "feedback": "..."
                  },
                  {
                    "text": "...",
                    "choices": ["A...", "B...", "C...", "D..."],
                    "correctAnswer": "B",
                    "feedback": "..."
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

# Category: Ingredient Substitutions

## Skill: Dairy Swaps

### Mini Lesson 1: Dairy Does More Than Add Liquid

Dairy swaps work best when you think about the job of the ingredient first. In baked goods, dairy might add moisture, tang, fat, or tenderness. A substitute should replace the most important job, not just look similar.

For medium questions, pay attention to clues like “moisture and tang” or “richness.” Yogurt and sour cream are both thick and tangy, while whole milk has more fat than skim milk. If a substitute is missing fat, a small amount of butter can sometimes help.

#### Question 1

A muffin batter uses plain yogurt to add moisture and tang. Which substitute is closest?

A. Water  
B. Sour cream  
C. Melted butter  
D. Bread crumbs  

Correct Answer: B

Feedback: Sour cream is thick and tangy, so it can replace plain yogurt better than a thin or dry ingredient.

#### Question 2

You need whole milk for quick bread, but you only have skim milk. Which change best restores some richness?

A. Use plain water  
B. Use vinegar only  
C. Use skim milk with a small amount of melted butter  
D. Use dry flour  

Correct Answer: C

Feedback: Skim milk has less fat than whole milk. Adding a little melted butter helps replace some richness.

---

### Mini Lesson 2: Match Texture and Flavor

Some dairy ingredients matter because of their texture. Dips, spreads, casseroles, and fillings often need dairy that is thick, soft, or spoonable instead of thin and pourable.

For medium questions, compare the way the ingredient behaves. Cream cheese needs another smooth, spreadable cheese. Ricotta needs something soft and mild that can work in a baked dish. Thin liquids usually will not replace thick dairy very well.

#### Question 3

A cheesecake-style dip needs cream cheese. Which option will give the closest creamy texture?

A. Skim milk  
B. Lemon juice  
C. Dry oats  
D. Neufchâtel cheese  

Correct Answer: D

Feedback: Neufchâtel cheese has a texture similar to cream cheese, so it works well in creamy dips.

#### Question 4

A baked pasta dish calls for ricotta, but you do not have any. Which substitute is most reasonable?

A. Cottage cheese  
B. Orange juice  
C. Vegetable oil  
D. Cornstarch  

Correct Answer: A

Feedback: Cottage cheese is soft and mild, making it a reasonable substitute for ricotta in many casseroles.

---

### Mini Lesson 3: Some Swaps Change the Final Dish

Rich dairy ingredients can affect both texture and flavor. Half-and-half, cream, evaporated milk, and whole milk are not identical because they have different amounts of fat, water, and concentration.

For medium questions, look for whether the substitute needs to be diluted, enriched, or combined with another ingredient. Evaporated milk is concentrated, while half-and-half is between milk and cream in richness.

#### Question 5

A pasta sauce calls for half-and-half. Which substitute best matches its balance of milkiness and richness?

A. Water and lemon juice  
B. Equal parts milk and heavy cream  
C. Bread crumbs and oil  
D. Plain broth only  

Correct Answer: B

Feedback: Half-and-half is made from milk and cream, so combining milk and cream gives a similar richness.

#### Question 6

A soup recipe uses whole milk, but you only have evaporated milk. What should you do before using it?

A. Add vinegar until it curdles  
B. Use it as a dry powder  
C. Dilute it with water  
D. Replace it with oil  

Correct Answer: C

Feedback: Evaporated milk is concentrated, so diluting it with water makes it closer to regular milk.

---

## Skill: Herb & Spice Alts

### Mini Lesson 1: Fresh and Dried Herbs Are Different

Fresh herbs, dried herbs, and powdered seasonings can all add flavor, but they are not used in the same amounts. Dried herbs and powders are usually more concentrated because much of the water has been removed.

For medium questions, watch for measurement clues. A common starting point is about one-third as much dried herb as fresh herb. Garlic powder is also much stronger by volume than fresh garlic, so only a small amount is needed.

#### Question 1

A soup calls for 2 tablespoons of fresh parsley, but you only have dried parsley. What is a reasonable starting amount?

A. 2 tablespoons dried parsley  
B. 1/2 cup dried parsley  
C. No parsley at all  
D. 2 teaspoons dried parsley  

Correct Answer: D

Feedback: Dried herbs are stronger than fresh herbs, so about one-third as much dried herb is a good starting point.

#### Question 2

A recipe uses one fresh garlic clove, but you only have garlic powder. Which amount is most appropriate?

A. About 1/8 teaspoon garlic powder  
B. 1 tablespoon garlic powder  
C. 1 cup garlic powder  
D. 1 teaspoon cinnamon  

Correct Answer: A

Feedback: Garlic powder is concentrated, so a small amount can replace one fresh garlic clove.

---

### Mini Lesson 2: Think About the Herb’s Job

Herb substitutes should match the flavor role of the original herb. Some herbs are earthy and savory, some are bright and fresh, and some are better for roasted foods than delicate garnishes.

For medium questions, use the food as a clue. Thyme, marjoram, and rosemary are savory herbs often used in cooked dishes. Warm baking spices or sweet ingredients are usually not good replacements for savory herbs.

#### Question 3

A savory recipe calls for thyme, but none is available. Which herb is the most suitable substitute?

A. Cinnamon  
B. Marjoram  
C. Vanilla extract  
D. Sugar  

Correct Answer: B

Feedback: Marjoram has a mild herbal flavor that can work in many savory recipes that use thyme.

#### Question 4

You are roasting chicken and are out of rosemary. Which herb would be the best substitute?

A. Mint candy  
B. Cocoa powder  
C. Thyme  
D. Powdered sugar  

Correct Answer: C

Feedback: Thyme is savory and herbal, so it can work well in many roasted chicken recipes.

---

### Mini Lesson 3: Some Seasonings Are Blends

Seasoning blends are made from smaller ingredients. If you know the flavor family of the blend, you can often make a close substitute with individual herbs or spices.

For medium questions, separate warm baking blends from savory herb blends. Allspice has a warm flavor similar to cinnamon, nutmeg, and cloves. Italian seasoning usually points toward dried herbs like basil, oregano, thyme, and rosemary.

#### Question 5

A spice mix needs the warm flavor of allspice. Which blend is the best substitute?

A. Basil, parsley, and oregano  
B. Salt, pepper, and garlic powder  
C. Flour, sugar, and baking soda  
D. Cinnamon, nutmeg, and cloves  

Correct Answer: D

Feedback: Allspice has warm baking-spice flavors, so cinnamon, nutmeg, and cloves can create a similar effect.

#### Question 6

You are out of Italian seasoning. Which homemade mix is the closest match?

A. Dried basil, oregano, thyme, and rosemary  
B. Cinnamon, nutmeg, and cloves  
C. Sugar and cocoa powder  
D. Vinegar and oil  

Correct Answer: A

Feedback: Italian seasoning is usually an herbal blend, so basil, oregano, thyme, and rosemary are a close match.

---

## Skill: Baking Binders & Thickeners

### Mini Lesson 1: Binders Hold Ingredients Together

Binders help a mixture stay together instead of crumbling apart. Eggs are common binders, but fruit purees and seed mixtures can also help in some baked goods.

For medium questions, look at the type of recipe. Applesauce can work well in brownies because it adds moisture and binding. Mashed banana is especially reasonable in banana bread because its flavor already fits the recipe.

#### Question 1

A brownie recipe needs one egg mainly to help hold the batter together. Which fruit-based substitute makes sense?

A. 1 cup water  
B. 1/4 cup applesauce  
C. 1 tablespoon salt  
D. 1 cup uncooked rice  

Correct Answer: B

Feedback: Applesauce can help bind and add moisture when the egg is mainly used for binding.

#### Question 2

A banana bread recipe is missing one egg used for binding. Which substitute fits the recipe best?

A. 1 cup lemon juice  
B. 1 tablespoon black pepper  
C. 1/4 cup mashed banana  
D. 1 cup dry pasta  

Correct Answer: C

Feedback: Mashed banana can help bind ingredients and adds moisture, especially in banana bread.

---

### Mini Lesson 2: Thickeners Make Mixtures Less Runny

Thickeners help liquids become thicker, but different starches work better in different situations. Cornstarch, arrowroot, and tapioca starch can all thicken, but the best choice depends on the food.

For medium questions, notice whether the recipe is a fruit filling, pudding, sauce, or gravy. Arrowroot is often a good cornstarch substitute in fruit fillings, while tapioca starch can help thicken soft mixtures like pudding.

#### Question 3

A fruit filling needs cornstarch, but you only have arrowroot starch. What should you do?

A. Use four times as much sugar  
B. Use baking powder instead  
C. Use bread crumbs only  
D. Use an equal amount of arrowroot starch  

Correct Answer: D

Feedback: Arrowroot starch can often replace cornstarch in equal amounts, especially in fruit fillings.

#### Question 4

A pudding needs a starch thickener, but cornstarch is unavailable. Which substitute is most suitable?

A. Tapioca starch  
B. Whole peppercorns  
C. Shredded lettuce  
D. Vegetable oil  

Correct Answer: A

Feedback: Tapioca starch can help thicken puddings and other soft mixtures when cornstarch is not available.

---

### Mini Lesson 3: Technique Matters With Thickeners

The right substitute can still fail if the texture is handled poorly. Lumps need smoothing or straining, while savory binders need something that can absorb moisture and hold ingredients together.

For medium questions, think about the problem you are fixing. Lumpy gravy needs whisking or straining. A savory loaf that is missing bread crumbs needs another dry binder, such as oats or crushed crackers.

#### Question 5

Your gravy has small lumps after thickening. What is the best way to improve it?

A. Add more dry flour without mixing  
B. Whisk it well and strain it if needed  
C. Freeze it immediately  
D. Add whole eggs directly to the hot gravy  

Correct Answer: B

Feedback: Whisking can break up small lumps, and straining can remove lumps that do not smooth out.

#### Question 6

A savory baked loaf needs bread crumbs for binding, but you are out. Which substitute is reasonable?

A. Ice cubes  
B. Lemonade  
C. Rolled oats or crushed crackers  
D. Whole cinnamon sticks  

Correct Answer: C

Feedback: Rolled oats or crushed crackers can absorb moisture and help hold a savory loaf together.

---

# Category: Recipe Adjustment

## Skill: Scaling Ratios

### Mini Lesson 1: Doubling a Recipe

Scaling up means finding how much larger the new batch is and multiplying the ingredients by that amount. When the number of servings doubles, the basic ingredient amounts usually double too.

For medium questions, compare the original amount to the new amount. If pancakes go from 10 to 20, that is double. If servings go from 6 to 12, that is also double, even when the ingredient amount is a fraction.

#### Question 1

A pancake recipe makes 10 pancakes with 2 eggs. How many eggs are needed for 20 pancakes?

A. 3 eggs  
B. 2 eggs  
C. 1 egg  
D. 4 eggs  

Correct Answer: D

Feedback: The recipe is doubled from 10 pancakes to 20 pancakes, so the eggs double from 2 to 4.

#### Question 2

A recipe serves 6 and uses 1 1/2 teaspoons of salt. How much salt is needed to serve 12?

A. 3 teaspoons  
B. 1 1/2 teaspoons  
C. 1 teaspoon  
D. 6 teaspoons  

Correct Answer: A

Feedback: The recipe is doubled from 6 servings to 12 servings, so the salt doubles to 3 teaspoons.

---

### Mini Lesson 2: Cutting a Recipe in Half

Scaling down uses the same idea as scaling up, but the multiplier is less than 1. If the new batch is half the size, divide the ingredient amounts in half.

For medium questions, look for recipes being reduced from 8 servings to 4, or from 16 pieces to 8. Fractions can be divided too: half of 3/4 cup is 3/8 cup.

#### Question 3

A pasta recipe serves 8 and uses 2 pounds of pasta. How much pasta is needed for 4 servings?

A. 1/2 pound  
B. 1 pound  
C. 2 pounds  
D. 4 pounds  

Correct Answer: B

Feedback: Four servings is half of eight servings, so the pasta is cut in half from 2 pounds to 1 pound.

#### Question 4

A brownie recipe makes 16 squares and uses 3/4 cup cocoa powder. How much cocoa is needed for 8 squares?

A. 3/4 cup  
B. 1 1/2 cups  
C. 3/8 cup  
D. 1/8 cup  

Correct Answer: C

Feedback: Eight squares is half the recipe, so 3/4 cup is cut in half to 3/8 cup.

---

### Mini Lesson 3: Keep the Same Ratio

Some recipes depend on ingredients staying in the same balance. Dressings, sauces, bread, and batters can change texture or flavor if the ratio shifts too much.

For medium questions, identify the relationship between ingredients or batch size. A 3-to-1 dressing ratio means the larger ingredient stays three times the smaller one. A sauce reduced to one-third needs one-third of each ingredient.

#### Question 5

A salad dressing uses 3 tablespoons oil for every 1 tablespoon vinegar. How much oil is needed for 4 tablespoons vinegar?

A. 6 tablespoons  
B. 4 tablespoons  
C. 1 tablespoon  
D. 12 tablespoons  

Correct Answer: D

Feedback: The ratio is 3 parts oil to 1 part vinegar. Four tablespoons of vinegar need 12 tablespoons of oil.

#### Question 6

A sauce recipe makes 3 cups and uses 3/4 cup tomato paste. How much tomato paste is needed for 1 cup of sauce?

A. 1/4 cup  
B. 1/2 cup  
C. 3/4 cup  
D. 1 cup  

Correct Answer: A

Feedback: One cup of sauce is one-third of the recipe, so 3/4 cup divided by 3 equals 1/4 cup.

---

## Skill: Emergency Flavor Tuning

### Mini Lesson 1: Start With the Most Likely Fix

Flat or bland food does not always need more salt. If a dish is already salty enough but still tastes dull, it may need brightness, freshness, or acidity.

For medium questions, pay attention to phrases like “already salty enough.” That clue means more salt is probably the wrong move. A small squeeze of citrus, vinegar, or fresh herbs can make flavors feel more awake without increasing saltiness.

#### Question 1

A bean chili tastes flat, but it already has enough salt. What could add needed brightness?

A. More salt  
B. A squeeze of lime juice  
C. Plain flour  
D. Ice cubes  

Correct Answer: B

Feedback: If the dish is salty enough but still tastes flat, a small amount of acid can brighten the flavor.

#### Question 2

A finished rice dish tastes one-dimensional but is already salty. Which addition is most likely to help?

A. More salt  
B. A large amount of flour  
C. Fresh herbs or a little lemon  
D. Plain water only  

Correct Answer: C

Feedback: Fresh herbs or a little acid can add brightness without making the rice saltier.

---

### Mini Lesson 2: Calm Down Spicy Heat

When food is too spicy, the goal is to make the heat feel less intense without ruining the dish. Creamy, fatty, or mild ingredients can soften spicy heat.

For medium questions, notice whether the dish should stay thick. Yogurt, sour cream, coconut milk, or cream can reduce perceived heat better than water because they add richness instead of simply thinning the food.

#### Question 3

A pot of chili is too spicy, but you do not want to make it watery. What is the best adjustment?

A. Add more chili powder  
B. Add black pepper  
C. Boil until the heat disappears  
D. Stir in sour cream or plain yogurt  

Correct Answer: D

Feedback: Creamy ingredients can soften perceived heat without thinning the chili as much as water would.

#### Question 4

A spicy soup is too intense for your roommate. Which add-in would most likely make it taste milder?

A. Coconut milk or cream  
B. Extra hot sauce  
C. More cayenne  
D. Dry rice added after serving  

Correct Answer: A

Feedback: Creamy or fatty ingredients can make spicy heat feel less harsh.

---

### Mini Lesson 3: Fix Saltiness by Spreading It Out

Saltiness is a concentration problem. The most reliable fix is to spread the salt through more unsalted food or liquid so each bite tastes less salty.

For medium questions, choose an unsalted version of something that already belongs in the dish. Soup can be stretched with unsalted broth and vegetables. Salty rice can be mixed with plain cooked rice instead of adding sugar or more seasoning.

#### Question 5

A soup tastes too salty and there is room in the pot. Which fix is most reliable?

A. Add more salt  
B. Add unsalted broth and extra vegetables  
C. Add hot sauce  
D. Add baking powder  

Correct Answer: B

Feedback: Adding unsalted liquid and ingredients spreads the salt through more food.

#### Question 6

A rice dish is too salty, but the texture is good. What is the best way to make it easier to eat?

A. Add more soy sauce  
B. Add salt on top  
C. Mix in unsalted cooked rice  
D. Cook it until dry and crunchy  

Correct Answer: C

Feedback: Unsalted rice increases the total amount of food and lowers the salty concentration.

---

## Skill: Texture Fixes

### Mini Lesson 1: Thickening Food That Is Too Thin

Thin sauces, soups, and fillings often need a thickener, but adding dry starch straight into hot liquid can create lumps. A slurry helps the thickener spread evenly.

For medium questions, look for words like “smooth,” “without clumps,” or “runny.” Mixing starch with cold liquid first is usually safer. If lumps have already formed, whisking and straining can improve the texture.

#### Question 1

A pan sauce looks watery. What is the best way to thicken it without clumps?

A. Dump in dry flour  
B. Add ice cubes  
C. Turn off the heat and add sugar  
D. Stir in a smooth slurry made with cold liquid  

Correct Answer: D

Feedback: A slurry spreads the thickener evenly before it goes into the hot sauce.

#### Question 2

A fruit filling is runny while cooking. Which method gives the smoothest thickening?

A. Mix starch with cold water first, then stir it in  
B. Sprinkle dry starch over the top and leave it  
C. Add oil  
D. Add uncooked pasta  

Correct Answer: A

Feedback: Mixing starch with cold liquid first helps prevent lumps.

---

### Mini Lesson 2: Thinning Food That Is Too Thick

Thick sauces can usually be loosened by adding liquid slowly. Separated or grainy sauces need gentler handling because harsh heat can make the texture worse.

For medium questions, decide whether the food is simply too thick or starting to break. Too thick means add a little liquid and stir. Grainy or separated often means lower the heat, whisk gently, and add a small splash of warm liquid.

#### Question 3

A cheese sauce becomes too thick after sitting for a few minutes. What should you do?

A. Add dry flour  
B. Whisk in a small splash of warm milk  
C. Boil it hard without stirring  
D. Add ice cubes  

Correct Answer: B

Feedback: Adding warm liquid slowly helps loosen the sauce while keeping control of the texture.

#### Question 4

A gravy is thicker than you wanted right before serving. What is the safest fix?

A. Add a full cup of broth all at once  
B. Add more dry flour  
C. Whisk in small splashes of broth  
D. Cook it longer  

Correct Answer: C

Feedback: Small additions of liquid help thin the gravy without overshooting.

---

### Mini Lesson 3: Fixing Watery Foods

Texture problems can come from too much moisture or not enough moisture. Wet foods may need extra moisture cooked off, while dry mixtures may need a small amount of liquid or fat.

For medium questions, match the fix to the direction of the problem. Wet rice can often be uncovered so steam escapes. Dry, crumbly cookie dough needs a controlled addition of moisture or softened fat, not more dry flour.

#### Question 5

A batch of cooked rice is slightly too wet. What is the best immediate fix?

A. Add more water  
B. Add ice  
C. Stir in dry flour  
D. Uncover it and let extra moisture steam off over low heat  

Correct Answer: D

Feedback: Letting extra moisture steam off can help wet rice become less soggy.

#### Question 6

Cookie dough is dry and crumbly and will not hold together. What is the best adjustment?

A. Add a small amount of liquid or softened fat  
B. Add more dry flour  
C. Bake it immediately without changing anything  
D. Add ice cubes  

Correct Answer: A

Feedback: Dry, crumbly dough usually needs a small amount of moisture or fat to help it come together.

---

# Category: How to Cook

## Skill: Sautéing & Pan-Searing

### Mini Lesson 1: Sautéing vs. Pan-Searing

Sautéing and pan-searing both use a pan, heat, and some fat, but the movement and goal are different. Sautéing usually uses smaller pieces that move often. Pan-searing usually keeps larger pieces in place long enough to brown.

For medium questions, use the food size and movement as clues. Small diced onions stirred often point to sautéing. Larger tofu slabs or pieces of meat left mostly still are more likely being pan-seared.

#### Question 1

You are cooking small diced onions while stirring them often in a little oil. Which method are you most likely using?

A. Poaching  
B. Sautéing  
C. Freezing  
D. Baking a cake  

Correct Answer: B

Feedback: Sautéing usually cooks smaller pieces of food while they are moved around in a pan.

#### Question 2

You want browned tofu slabs with a crust on the outside and little movement in the pan. Which method fits best?

A. Boiling  
B. Steaming  
C. Pan-searing  
D. Microwaving in water  

Correct Answer: C

Feedback: Pan-searing focuses on browning the outside of food against a hot pan.

---

### Mini Lesson 2: Do Not Overcrowd the Pan

Browning needs heat, space, and moisture control. If a pan is crowded, food releases steam and has a harder time browning. If pieces are different sizes, they may cook unevenly.

For medium questions, look for clues about liquid collecting in the pan or uneven cooking. Smaller batches help crowded food brown. Similar-sized pieces help vegetables finish cooking at about the same time.

#### Question 3

Vegetables in a crowded skillet are releasing liquid and not browning. What should you do next time?

A. Add more vegetables at once  
B. Cover the pan tightly from the start  
C. Add ice  
D. Cook them in smaller batches  

Correct Answer: D

Feedback: Cooking in smaller batches gives moisture room to escape and helps browning happen.

#### Question 4

Why are vegetables often cut into similar-sized pieces before sautéing?

A. So they cook more evenly  
B. So they become raw again  
C. So they do not need heat  
D. So they all taste like sugar  

Correct Answer: A

Feedback: Similar-sized pieces cook at similar rates, which helps avoid undercooked or overcooked pieces.

---

### Mini Lesson 3: Dry Food Browns Better

Surface moisture slows browning because the pan must evaporate water before a crust can form. This matters for meat, tofu, and foods that have been sitting in marinade.

For medium questions, notice whether the food is wet from packaging or marinade. Patting or blotting the surface dry helps the food sear instead of steam, especially when you want a browned crust.

#### Question 5

Chicken breasts are wet from the package before searing. What should you do first?

A. Add extra water to the pan  
B. Pat the surface dry with a paper towel  
C. Coat them in sugar only  
D. Freeze them immediately  

Correct Answer: B

Feedback: Drying the surface helps the chicken brown instead of steaming.

#### Question 6

A tofu slice has extra marinade on the outside before searing. Why might blotting it help?

A. It makes the tofu raw  
B. It removes the need for heat  
C. Less surface moisture makes browning easier  
D. It makes the pan colder  

Correct Answer: C

Feedback: Extra moisture has to evaporate before browning can happen, so blotting helps searing.

---

## Skill: Boiling, Simmering, & Poaching

### Mini Lesson 1: Recognizing a Full Boil

Boiling uses strong, active bubbles. Pasta usually needs water that is fully boiling, plus enough movement and stirring to keep pieces from sticking.

For medium questions, check what the bubbles are doing. A few bubbles around the edge is not a full boil yet. After pasta is added, stirring helps separate the pieces while the water returns to a boil.

#### Question 1

Your pasta water has only a few small bubbles around the edge. What should you do before adding pasta?

A. Add pasta immediately and turn off the heat  
B. Add ice  
C. Remove all the water  
D. Wait for a stronger boil  

Correct Answer: D

Feedback: Pasta usually cooks best when added to water that has reached a full boil.

#### Question 2

After pasta is added, the boiling slows down and pieces start sticking. What should you do?

A. Stir and let the water return to a boil  
B. Add flour  
C. Freeze the pot  
D. Stop cooking immediately  

Correct Answer: A

Feedback: Stirring helps prevent sticking while the water returns to a boil.

---

### Mini Lesson 2: Simmering Is Gentler Than Boiling

Simmering is controlled, gentle bubbling. It is useful when food needs time to cook, soften, or develop flavor without being tossed around by aggressive boiling.

For medium questions, think about control. Soups and stews often simmer because hard boiling can make textures rough. If a pot boils over, lowering the heat or moving it off the burner is the first safe response.

#### Question 3

Why are soups and stews often simmered instead of boiled hard?

A. Simmering makes food raw again  
B. Gentler bubbles help texture and flavor develop  
C. Simmering only works in the freezer  
D. Simmering removes all liquid instantly  

Correct Answer: B

Feedback: Simmering cooks steadily without tossing ingredients around as much as a hard boil.

#### Question 4

A pot starts boiling over. What should you do first?

A. Turn the heat higher  
B. Cover it tighter and walk away  
C. Lower the heat or carefully move it off the burner  
D. Pour oil into the water  

Correct Answer: C

Feedback: Reducing the heat source helps stop the boil-over safely.

---

### Mini Lesson 3: Poaching Uses Very Gentle Heat

Poaching uses hot liquid below a strong simmer. It is gentle enough for delicate foods that could break apart or become tough in rapidly boiling water.

For medium questions, look for foods like eggs, fish, or tender chicken. If the liquid boils too hard, delicate foods can fall apart, toughen, or cook unevenly.

#### Question 5

Which food is commonly cooked with gentle poaching?

A. Dry cereal  
B. Raw flour by itself  
C. Potato chips  
D. Eggs or fish  

Correct Answer: D

Feedback: Eggs and fish are delicate enough that gentle poaching can cook them without rough bubbling.

#### Question 6

Why should poaching liquid stay below a vigorous boil?

A. Strong boiling can break delicate foods apart or make them tough  
B. Boiling makes food invisible  
C. Boiling turns the liquid into ice  
D. Boiling removes the need for cooking  

Correct Answer: A

Feedback: Poaching should stay gentle so delicate foods keep their shape and texture.

---

## Skill: Oven Roasting vs. Baking

### Mini Lesson 1: Roasting and Baking Use the Oven Differently

Roasting and baking both use dry oven heat, but they often aim for different results. Roasting usually focuses on browning structured foods, while baking depends on a recipe setting, rising, or spreading correctly.

For medium questions, use the food goal as the clue. Potato pieces that should get browned and crisp point to roasting. Cookies need the oven preheated so they start baking at the intended temperature.

#### Question 1

Which oven method is best for seasoned potato pieces that should become browned and crisp?

A. Poaching  
B. Roasting  
C. Freezing  
D. Blending  

Correct Answer: B

Feedback: Roasting uses dry oven heat and is a good method for browning potatoes.

#### Question 2

Why should an oven usually be preheated before baking cookies?

A. So the cookies stay raw  
B. So the oven becomes cold  
C. So the cookies begin baking at the intended temperature  
D. So measuring is unnecessary  

Correct Answer: C

Feedback: Preheating helps cookies bake at the temperature the recipe was designed for.

---

### Mini Lesson 2: Roasting Needs Space

Roasting works best when hot air can reach the food and surface moisture can escape. Oil and occasional turning can help more surfaces brown.

For medium questions, watch for clues about browning. A moderate amount of oil helps roasted vegetables brown and avoid drying out. Stirring or turning halfway through helps expose different sides to oven heat.

#### Question 3

Why should roasted vegetables usually be tossed with a moderate amount of oil?

A. Oil makes vegetables freeze  
B. Oil replaces the oven  
C. Oil makes measuring impossible  
D. Oil helps browning and prevents too much drying  

Correct Answer: D

Feedback: A moderate amount of oil helps vegetables brown and develop better texture.

#### Question 4

Why are roasted vegetables sometimes stirred halfway through cooking?

A. To help them brown more evenly  
B. To make them raw again  
C. To stop the oven from heating  
D. To remove all seasoning  

Correct Answer: A

Feedback: Turning or stirring exposes more sides to heat, which helps vegetables brown more evenly.

---

### Mini Lesson 3: Baking Needs Accuracy

Baking depends on timing, structure, and steady oven heat. Cakes, cookies, muffins, and breads can change if they lose heat or come out before they finish setting.

For medium questions, look for clues about the center, rise, and oven door. A cake removed too early may sink or stay undercooked. Opening the oven repeatedly can lower the temperature and affect structure.

#### Question 5

What can happen if a cake is removed before the center has set?

A. The cake becomes fully frozen  
B. The center may sink or stay undercooked  
C. The cake turns into soup instantly  
D. The cake becomes raw flour again  

Correct Answer: B

Feedback: If the center has not set, the cake may collapse, sink, or remain undercooked.

#### Question 6

Why should an oven door not be opened repeatedly while a cake is baking?

A. Opening the door makes the cake cook without heat  
B. Opening the door adds sugar  
C. Heat loss can affect how the cake rises and sets  
D. Opening the door sharpens knives  

Correct Answer: C

Feedback: Repeatedly opening the oven door can lower the temperature and affect the cake’s structure.

---

# Category: Utensil Handling

## Skill: Essential Knife Work

### Mini Lesson 1: Protect Your Fingers

Knife safety starts before the cut. Food should be stable, and your guiding hand should protect your fingertips while helping control the cut.

For medium questions, pay attention to shape and hand position. Round foods like potatoes and onions are safer after you create a flat side. In a claw grip, the knuckles guide the knife while the fingertips stay tucked back.

#### Question 1

Before slicing a round potato, what should you do to make it safer?

A. Balance it on the roundest side  
B. Cover it in oil  
C. Hold it in the air while cutting  
D. Cut a flat side so it sits steadily  

Correct Answer: D

Feedback: Creating a flat side helps keep round foods from rolling while you cut them.

#### Question 2

When using a claw grip, what part of your hand should guide the knife?

A. Your knuckles  
B. Your fingertips stretched flat  
C. Your palm under the blade  
D. Your wrist against the cutting edge  

Correct Answer: A

Feedback: With a claw grip, curled fingers stay back while the knuckles help guide the side of the knife.

---

### Mini Lesson 2: Keep the Cutting Board Stable

A safe cutting setup keeps both the board and the food under control. The board should not slide, and surfaces that touch raw meat should be easy to clean and sanitize.

For medium questions, think about what makes the station stable and clean. A damp towel can grip under a cutting board. Raw chicken belongs on a clean nonporous cutting board, not on absorbent or hard-to-clean surfaces.

#### Question 3

Why is a damp towel useful under a cutting board?

A. It makes the knife dull  
B. It helps stop the board from sliding  
C. It replaces the food  
D. It makes the counter hotter  

Correct Answer: B

Feedback: A damp towel adds grip between the board and the counter.

#### Question 4

Which surface is safest for cutting raw chicken?

A. A couch cushion  
B. A stack of paper towels  
C. A clean nonporous cutting board  
D. A carpeted floor  

Correct Answer: C

Feedback: A nonporous cutting board can be cleaned and sanitized after touching raw chicken.

---

### Mini Lesson 3: Sharp Knives Are Safer Than Dull Knives

The right knife and safe cleaning habits both reduce risk. A chef’s knife handles many common chopping tasks, but sharp knives should be kept visible and controlled when washing.

For medium questions, match the tool to the task and avoid hidden blades. A chef’s knife is useful for onions, herbs, and vegetables. A sharp knife should be washed separately by hand, not left hidden in soapy water.

#### Question 5

Which knife is generally best for chopping onions, herbs, and vegetables?

A. Butter knife  
B. Plastic spoon  
C. Rolling pin  
D. Chef’s knife  

Correct Answer: D

Feedback: A chef’s knife is versatile and well-suited for chopping many vegetables and herbs.

#### Question 6

What is the safest way to wash a sharp kitchen knife?

A. Wash it separately by hand with the blade pointed away  
B. Hide it in a sink full of soapy water  
C. Toss it loosely into the dishwasher with the blade up  
D. Hold the blade edge directly in your palm  

Correct Answer: A

Feedback: Washing a knife separately keeps it visible and helps prevent accidental cuts.

---

## Skill: Pan & Surface Matching

### Mini Lesson 1: Use Heavy Pans for Browning

Different pans handle heat differently. Heavy pans spread and hold heat well, which helps with browning, high-heat cooking, and gentle control for thick sauces.

For medium questions, match the pan to the heat need. A heavy-bottomed saucepan can reduce scorching in custards or thick sauces. A wok or large skillet gives stir-fry ingredients room over high heat.

#### Question 1

Why is a heavy-bottomed saucepan useful for custard or thick sauces?

A. It makes sauce freeze  
B. It spreads heat more evenly and helps reduce scorching  
C. It removes the need to stir  
D. It turns sauce into bread  

Correct Answer: B

Feedback: A heavy-bottomed pan distributes heat more evenly, which helps prevent scorching.

#### Question 2

Which pan is best for making a stir-fry over high heat?

A. A plastic bowl  
B. A glass measuring cup  
C. A wok or large skillet  
D. A paper plate  

Correct Answer: C

Feedback: A wok or large skillet gives food room and can handle the high heat used for stir-frying.

---

### Mini Lesson 2: Use Nonstick for Delicate Foods

The cooking surface should match the food. Delicate foods need easy release, while acidic foods need cookware that will not react with the acid.

For medium questions, separate sticking problems from reaction problems. Eggs often do best in nonstick. Tomato sauce is acidic, so stainless steel or enameled cookware is safer than reactive uncoated metal.

#### Question 3

You are making an omelet and want it to release easily. Which pan is the best choice?

A. Stockpot  
B. Baking sheet  
C. Colander  
D. Nonstick skillet  

Correct Answer: D

Feedback: A nonstick skillet helps delicate egg dishes release with less sticking.

#### Question 4

Which cookware is most appropriate for simmering an acidic tomato sauce?

A. Stainless steel or enameled cookware  
B. Uncoated reactive aluminum  
C. A cardboard box  
D. A plastic storage bag on the stove  

Correct Answer: A

Feedback: Stainless steel or enameled cookware is nonreactive and works well for acidic tomato sauce.

---

### Mini Lesson 3: Use a Sheet Pan for Roasting

Some cooking methods need the right vessel size or material. Boiling needs enough space for liquid and food. Broiling needs cookware that can handle very high direct heat.

For medium questions, look at the cooking method. A large stockpot fits a large batch of pasta with enough water. Broiler-safe metal cookware or cast iron is better under a broiler than plastic, paper, or regular glass.

#### Question 5

Which vessel is best for boiling a large batch of pasta?

A. A small mug  
B. A large stockpot  
C. A shallow plate  
D. A plastic bag  

Correct Answer: B

Feedback: A large stockpot gives pasta enough water and space to cook evenly.

#### Question 6

Which cookware should be used under an oven broiler?

A. Thin plastic containers  
B. Paper plates  
C. Broiler-safe metal cookware or cast iron  
D. Regular drinking glasses  

Correct Answer: C

Feedback: Broilers use very high direct heat, so the cookware must be broiler-safe.

---

## Skill: Hack-it-With-What-You-Have

### Mini Lesson 1: Match the Shape and Job

When replacing a tool, first identify the job: rolling, pressing, brushing, straining, covering, or heating gently. A safe substitute should copy the shape or pressure without adding danger.

For medium questions, think about what the missing tool does physically. A meat mallet flattens with pressure, so a heavy skillet or rolling pin can work carefully. A pastry brush spreads a thin layer, which can also be done with a clean spoon or clean fingers.

#### Question 1

You need to flatten chicken breasts but do not own a meat mallet. What can you use?

A. A paper towel  
B. A plastic straw  
C. A measuring cup full of water with no lid  
D. A heavy skillet or rolling pin  

Correct Answer: D

Feedback: A heavy skillet or rolling pin can apply even pressure to flatten chicken when used carefully.

#### Question 2

You do not have a pastry brush. What can you use to spread oil lightly over bread or vegetables?

A. A clean spoon or clean fingers  
B. A dirty sponge  
C. A knife blade edge  
D. A piece of raw chicken  

Correct Answer: A

Feedback: A clean spoon or clean fingers can spread a light layer of oil when a pastry brush is not available.

---

### Mini Lesson 2: Match the Action

Many specialty tools save time, but basic kitchen tools can often perform the same action. The substitute may be slower, but it should still be clean, safe, and effective.

For medium questions, focus on the action. A garlic press crushes garlic finely, but a knife can mince it. A citrus juicer squeezes and releases juice, but rolling the lemon and using a fork can help do the same job.

#### Question 3

You do not have a garlic press. What is the best alternative for finely preparing garlic?

A. Leave the clove whole and uncooked  
B. Mince it finely with a knife  
C. Freeze it in the peel  
D. Replace it with sugar  

Correct Answer: B

Feedback: A knife can mince garlic finely, even without a garlic press.

#### Question 4

You need to juice a lemon but do not have a citrus juicer. What is the best method?

A. Put the whole lemon into the dish uncut  
B. Freeze the lemon and never cut it  
C. Roll it, cut it, and squeeze while using a fork to help release juice  
D. Replace the lemon with flour  

Correct Answer: C

Feedback: Rolling and squeezing the lemon with a fork helps release more juice without a juicer.

---

### Mini Lesson 3: Make Safe Setup Swaps

Some swaps involve hot water, rising dough, or other situations where safety matters more than speed. The best workaround should reduce risk while still doing the job.

For medium questions, avoid dangerous shortcuts. Pasta can be lifted with tongs or a slotted spoon if there is no colander. Rising dough can be covered with a clean damp towel or loose lid instead of something dirty, heavy, or unsafe.

#### Question 5

You need to strain pasta but do not have a colander. What is the safest substitute?

A. Pour boiling water through your fingers  
B. Use a paper towel as a strainer  
C. Dump the pot quickly without holding it securely  
D. Use tongs or a slotted spoon to remove the pasta  

Correct Answer: D

Feedback: Tongs or a slotted spoon let you remove pasta without pouring a large pot of boiling water.

#### Question 6

You need to cover a bowl of rising dough but do not have plastic wrap. What is the best substitute?

A. A clean damp towel or loose-fitting lid  
B. A dirty cutting board  
C. A hot skillet directly on the dough  
D. A pile of raw meat  

Correct Answer: A

Feedback: A clean damp towel or loose lid can protect dough while still giving it room to rise.

---
