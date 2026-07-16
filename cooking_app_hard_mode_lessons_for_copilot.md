# Cooking Learning App — Hard Mode Lessons for JSON Conversion

Use this file as the source material for converting the Hard Mode lessons into JSON.

## Hard Mode Rules

- Each category contains skills.
- Each skill has mode: "hard".
- Each Hard Mode skill must contain exactly 3 mini lessons.
- Each mini lesson must contain exactly 2 questions.
- Each skill has exactly 6 questions total.
- Questions should be harder application scenarios, but still multiple-choice for easier JSON conversion.
- Mini lesson text should provide enough context clues to support the questions underneath it.
- Correct answers are distributed evenly across A, B, C, and D in this file.

## Suggested JSON Shape

```json
{
  "categories": [
    {
      "name": "Ingredient Substitutions",
      "skills": [
        {
          "name": "Dairy Swaps",
          "mode": "hard",
          "miniLessons": [
            {
              "title": "Read the Recipe Before Replacing Dairy",
              "lessonText": "...",
              "questions": [
                {
                  "text": "...",
                  "choices": ["A...", "B...", "C...", "D..."],
                  "correctAnswer": "A",
                  "feedback": "..."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

# Category 1: Ingredient Substitutions

## Skill: Dairy Swaps

### Mini Lesson 1: Read the Recipe Before Replacing Dairy

Harder dairy swaps start by reading the recipe around the ingredient. If the recipe uses baking soda, a tangy dairy ingredient may be helping with rise and tenderness, not just adding liquid. If the recipe is creamy or rich, the dairy may also be adding fat and body. A strong swap should replace the main job of the original dairy ingredient instead of only matching the amount.

#### Question 1

A quick bread uses buttermilk and baking soda, but you only have milk, vinegar, butter, and water. Which swap best protects the recipe’s texture?

A. Milk mixed with a little vinegar, because it adds liquid and acidity  
B. Water, because it has the same volume as buttermilk  
C. Melted butter, because it is dairy fat  
D. Plain milk only, because all dairy works the same way  

Correct Answer: A

Feedback: Buttermilk adds moisture and acidity. Milk with a little vinegar is a closer functional match, especially when baking soda is involved.

#### Question 2

A potato soup recipe calls for whole milk near the end. You only have evaporated milk. Which choice is most likely to keep the soup creamy without making it too concentrated?

A. Use evaporated milk powder-dry without liquid  
B. Dilute evaporated milk with water before using it as a milk substitute  
C. Replace the milk with vinegar  
D. Use only butter and no liquid  

Correct Answer: B

Feedback: Evaporated milk is concentrated. Diluting it helps it behave more like regular milk while still adding creaminess.

### Mini Lesson 2: Match Thickness, Tang, and Use

Some dairy substitutes only need to taste similar, while others must also behave similarly. A topping needs thickness so it sits on the food. A filling needs body so it holds its shape. A tangy ingredient needs another mild acidic flavor if the tang matters. The best choice depends on how the dairy is being used in that specific dish.

#### Question 1

A lasagna filling calls for ricotta, but you only have cottage cheese, milk, butter, and plain yogurt. Which option is the best starting point?

A. Use milk because it is dairy  
B. Use butter because it is rich  
C. Drain or blend cottage cheese so it better matches ricotta’s soft texture  
D. Use plain yogurt because all thick dairy works in lasagna  

Correct Answer: C

Feedback: Cottage cheese is soft and mild like ricotta. Draining or blending it improves the texture for a filling.

#### Question 2

A dip needs cream cheese for thickness and spreadability. Which substitute is most likely to keep the dip close to the original texture?

A. Skim milk  
B. Melted butter  
C. Lemon juice  
D. Neufchâtel cheese  

Correct Answer: D

Feedback: Neufchâtel is close to cream cheese in texture and use, while thin liquids would make the dip loose.

### Mini Lesson 3: Expect Tradeoffs in Rich Dairy Swaps

Rich dairy ingredients can be difficult to replace because they add more than one thing at once. Cream, half-and-half, and whole milk all bring different amounts of fat, liquid, and body. When the recipe does not need whipping, you usually have more flexibility. The goal is to keep the finished dish from becoming thin, greasy, bland, or too heavy.

#### Question 1

A pasta sauce calls for half-and-half, but you only have milk and heavy cream. Which option best recreates half-and-half?

A. Use a mixture of milk and heavy cream  
B. Use only water  
C. Use only lemon juice  
D. Use dry flour instead of dairy  

Correct Answer: A

Feedback: Half-and-half is between milk and cream in richness, so combining milk and cream creates a closer substitute.

#### Question 2

A soup calls for heavy cream, but the cream is not being whipped. Which option best explains why milk plus butter can work better than milk alone?

A. The butter makes the soup acidic  
B. The butter helps replace some of the fat that heavy cream would have added  
C. The butter replaces all seasonings  
D. The butter makes the soup boil faster  

Correct Answer: B

Feedback: Heavy cream adds both liquid and fat. Milk supplies liquid, while butter helps replace some richness.

---

## Skill: Herb & Spice Alts

### Mini Lesson 1: Adjust for Concentration

Harder seasoning substitutions often come down to concentration. Dried herbs, ground spices, and powders can be stronger than their fresh versions because the flavor is more concentrated. That means a substitute may need a smaller amount even when it sounds like the same ingredient. Starting with less also gives you room to taste and adjust.

#### Question 1

A sauce calls for 2 tablespoons fresh oregano, but you only have dried oregano. What is the best first amount to try?

A. 2 tablespoons dried oregano  
B. 1/2 cup dried oregano  
C. About 2 teaspoons dried oregano  
D. No oregano because dried herbs cannot substitute for fresh herbs  

Correct Answer: C

Feedback: Dried herbs are often used at about one-third the fresh amount. Since 2 tablespoons equals 6 teaspoons, about 2 teaspoons is a reasonable starting point.

#### Question 2

A recipe calls for two fresh garlic cloves, but you only have garlic powder. Which approach is safest for flavor balance?

A. Use the same volume of garlic powder as chopped garlic  
B. Use a full tablespoon for each clove  
C. Skip measuring because garlic powder is weak  
D. Use a small measured amount of garlic powder because it is concentrated  

Correct Answer: D

Feedback: Garlic powder is concentrated. A small measured amount is safer than matching the volume of fresh garlic.

### Mini Lesson 2: Substitute by Flavor Family

When the exact herb or spice is missing, think about the flavor family. Some seasonings are earthy, some are bright and leafy, some are warm and sweet, and others are smoky or hot. A good substitute usually belongs to a similar family and fits the type of dish. This is more reliable than choosing an ingredient just because it is also an herb or spice.

#### Question 1

A roasted chicken recipe calls for rosemary, but you are out. Which substitute fits the savory, herbal direction best?

A. Thyme  
B. Cinnamon  
C. Vanilla extract  
D. Cocoa powder  

Correct Answer: A

Feedback: Thyme is savory and herbal, so it fits roasted chicken better than sweet baking spices.

#### Question 2

A recipe uses cumin for an earthy, warm flavor. Which substitute is most reasonable if cumin is missing?

A. Powdered sugar  
B. Ground coriander with a small amount of chili powder  
C. Dried mint candy  
D. Vanilla pudding mix  

Correct Answer: B

Feedback: Coriander and chili powder can move in a similar warm, savory direction, though the flavor will not be identical.

### Mini Lesson 3: Rebuild Blends From Their Purpose

Seasoning blends are shortcuts. If a blend is missing, the best substitute depends on what kind of blend it is. Warm baking blends often use spices like cinnamon, ginger, nutmeg, and cloves. Savory herb blends often use basil, oregano, thyme, rosemary, or parsley. The substitute does not need to be perfect, but it should point the dish in the same direction.

#### Question 1

You are out of pumpkin pie spice but have several individual spices. Which combination best matches its usual flavor role?

A. Basil, oregano, thyme, and rosemary  
B. Garlic powder, onion powder, and paprika  
C. Cinnamon, ginger, nutmeg, and cloves  
D. Salt, pepper, and vinegar  

Correct Answer: C

Feedback: Pumpkin pie spice is a warm baking blend. Cinnamon, ginger, nutmeg, and cloves create a similar profile.

#### Question 2

You are out of Italian seasoning for a tomato pasta sauce. Which blend is the best replacement?

A. Cinnamon, nutmeg, and cloves  
B. Sugar, cocoa powder, and vanilla  
C. Cayenne, sugar, and ginger  
D. Dried basil, oregano, thyme, and rosemary  

Correct Answer: D

Feedback: Italian seasoning is a savory herb blend, so dried basil, oregano, thyme, and rosemary are a better match.

---

## Skill: Baking Binders & Thickeners

### Mini Lesson 1: Choose a Binder for the Structure Needed

Harder binder questions ask what the ingredient is holding together. Eggs, flax mixtures, mashed fruit, breadcrumbs, oats, and starches can all help with structure in different situations. A good substitute should match the kind of food being made. Sweet baked goods can handle fruit-based binders more often than savory loaves, while savory foods often need neutral binders.

#### Question 1

A vegan muffin recipe needs one egg mostly for binding, not for rise. Which substitute best matches that job?

A. Ground flaxseed mixed with water  
B. Plain water only  
C. Extra baking powder only  
D. A full cup of oil  

Correct Answer: A

Feedback: A flaxseed-and-water mixture forms a gel that can help bind muffins when the egg is mainly for structure.

#### Question 2

A savory lentil loaf is falling apart and the recipe calls for bread crumbs as a binder. You are out. Which substitute is most useful?

A. Ice cubes  
B. Rolled oats or crushed crackers  
C. Lemon juice  
D. Vegetable broth only  

Correct Answer: B

Feedback: Rolled oats or crushed crackers can absorb moisture and help hold a savory loaf together.

### Mini Lesson 2: Match the Thickener to the Food

Thickeners do not all behave exactly the same way. Cornstarch, flour, arrowroot, and tapioca starch can thicken liquids, but they may change the look, strength, or texture of the final dish. Fruit fillings and glossy sauces often work well with starches like arrowroot. Creamy sauces may tolerate flour, but usually need more flour than cornstarch.

#### Question 1

A fruit filling needs cornstarch, but you are out. Which substitute is most likely to thicken clearly without changing the flavor much?

A. Baking soda  
B. Bread crumbs  
C. Arrowroot starch  
D. Table salt  

Correct Answer: C

Feedback: Arrowroot starch can thicken fruit fillings and is often a close substitute for cornstarch.

#### Question 2

A sauce calls for 1 tablespoon of cornstarch, but you only have flour. Which swap is most reasonable?

A. Use 1/8 teaspoon flour  
B. Use 1 cup flour  
C. Use no thickener because flour cannot thicken  
D. Use about 2 tablespoons of flour  

Correct Answer: D

Feedback: Flour has less thickening power than cornstarch, so using about twice as much flour is a common adjustment.

### Mini Lesson 3: Use the Correct Technique for Texture

The right thickener can still fail if it is added poorly. Dry starch added straight to hot liquid can form lumps. A slurry spreads the starch through cold liquid first, making it easier to mix smoothly into hot food. If lumps already formed, whisking or straining may rescue the texture before serving.

#### Question 1

You need to thicken hot gravy with starch. Which method gives you the best chance of avoiding lumps?

A. Mix the starch with cold liquid first, then whisk it into the hot gravy  
B. Sprinkle dry starch into the hottest spot without stirring  
C. Add the starch after the gravy is already frozen  
D. Mix starch with oil only and never stir  

Correct Answer: A

Feedback: A cold slurry helps the starch disperse before it reaches the hot liquid, which lowers the chance of lumps.

#### Question 2

A pudding has small starch lumps after cooking. Which fix is most likely to improve it before chilling?

A. Add more dry starch directly to the hot pudding  
B. Whisk well and strain the pudding through a fine mesh strainer  
C. Stir in raw eggs without tempering  
D. Freeze it with the lumps still inside  

Correct Answer: B

Feedback: Whisking may smooth some lumps, and straining can remove pieces that do not dissolve.

---

# Category 2: Recipe Adjustment

## Skill: Scaling Ratios

### Mini Lesson 1: Find the Scaling Factor First

Hard scaling problems are easier when you find the scaling factor before touching the ingredients. Compare the new yield to the old yield. If the new recipe is bigger, multiply. If it is smaller, divide. Once the factor is clear, use it on the ingredients that normally scale directly, like broth, flour, pasta, rice, or cheese.

#### Question 1

A chili recipe serves 6 and uses 3 cans of beans. You need to serve 10 people. What is the best way to scale the beans?

A. Use 3 cans because beans do not scale  
B. Use 6 cans because 10 is close to double 6  
C. Use 5 cans of beans  
D. Use 1 can because the serving size changed  

Correct Answer: C

Feedback: The scaling factor is 10/6, or 5/3. Three cans times 5/3 equals five cans.

#### Question 2

A recipe makes 18 meatballs with 1 1/2 cups of breadcrumbs. How much is needed for 30 meatballs?

A. 1 1/2 cups  
B. 3 cups  
C. 5 cups  
D. 2 1/2 cups  

Correct Answer: D

Feedback: Thirty meatballs is 30/18, or 5/3, of the original. 1 1/2 cups times 5/3 equals 2 1/2 cups.

### Mini Lesson 2: Handle Fractions Without Changing the Ratio

Fractions show up often in recipe scaling. The safest method is to scale the recipe size first, then apply the same multiplier to the ingredient amount. If the recipe is one-third as large, use one-third of the ingredient. If it is one-and-a-half times as large, multiply the ingredient by 1.5. The goal is not to make the numbers pretty; the goal is to keep the recipe balanced.

#### Question 1

A sauce recipe makes 4 cups and uses 2/3 cup cream. You only need 3 cups of sauce. How much cream should you use?

A. 1/2 cup  
B. 2/3 cup  
C. 3/4 cup  
D. 1 cup  

Correct Answer: A

Feedback: Three cups is 3/4 of the original recipe. 2/3 cup times 3/4 equals 1/2 cup.

#### Question 2

A recipe makes 8 servings and uses 3/4 teaspoon pepper. You want 12 servings. How much pepper keeps the same ratio?

A. 3/4 teaspoon  
B. 1 1/8 teaspoons  
C. 1/2 teaspoon  
D. 2 teaspoons  

Correct Answer: B

Feedback: Twelve servings is 1.5 times the original. 3/4 teaspoon times 1.5 equals 1 1/8 teaspoons.

### Mini Lesson 3: Know What Does Not Scale Perfectly

Most base ingredients scale mathematically, but cooking time, pan size, heat, and seasoning may need judgment. Doubling a soup does not always mean doubling the cooking time. Increasing salt or hot spices may be safer in stages because flavor can become too strong quickly. Hard scaling means using the math first, then checking whether the cooking method still makes sense.

#### Question 1

You double a soup recipe. Which adjustment is safest for salt?

A. Always quadruple the salt  
B. Never add salt to a doubled recipe  
C. Add less than the full doubled amount at first, taste, then adjust  
D. Add all the doubled salt before tasting  

Correct Answer: C

Feedback: Salt can become overpowering. Adding it in stages gives you control while still using the scaling math as a guide.

#### Question 2

You double a sheet-pan vegetable recipe but use the same pan. What is the most likely issue?

A. The oven will stop working  
B. The vegetables will automatically cook twice as fast  
C. The vegetables will not need oil  
D. The vegetables may crowd and steam instead of brown  

Correct Answer: D

Feedback: More food in the same pan can trap moisture and reduce browning. You may need another pan or a larger surface.

---

## Skill: Emergency Flavor Tuning

### Mini Lesson 1: Diagnose Before You Add More

Hard flavor fixes start with diagnosis. Bland food may need salt, but food can also taste flat because it lacks acidity, freshness, aroma, or contrast. If the dish is already salty enough, more salt is not the answer. Try to identify what is missing, then make a small adjustment and taste again before adding more.

#### Question 1

A finished bean soup tastes flat, but it is already salty enough. Which adjustment is most likely to help?

A. Add a small splash of vinegar or lemon juice  
B. Add another tablespoon of salt  
C. Add dry flour  
D. Boil until all liquid is gone  

Correct Answer: A

Feedback: If salt is already sufficient, acid can add brightness and make the flavor feel more complete.

#### Question 2

A rice bowl tastes heavy and one-dimensional, but not bland. Which addition is most likely to add contrast without increasing saltiness?

A. More soy sauce  
B. Fresh herbs and a squeeze of citrus  
C. A large amount of baking soda  
D. Plain cornstarch  

Correct Answer: B

Feedback: Fresh herbs and citrus add aroma and brightness without relying on more salt.

### Mini Lesson 2: Balance One Strong Flavor With Its Opposite

When one flavor is too strong, the goal is usually balance, not hiding the problem completely. Too acidic can sometimes be softened with a tiny amount of sweetness or fat. Too sweet can be balanced with acid, bitterness, salt, or dilution depending on the dish. Too rich can often be lifted with acidity or freshness. Make small changes because overcorrecting creates a new problem.

#### Question 1

A tomato sauce tastes sharp and acidic. Which first adjustment is most reasonable?

A. Add a full cup of sugar  
B. Add more vinegar  
C. Add a small pinch of sugar and taste again  
D. Add lemon juice until it tastes brighter  

Correct Answer: C

Feedback: A small pinch of sugar can soften acidity. A large amount would make the sauce too sweet.

#### Question 2

A glaze tastes too sweet. Which adjustment is most likely to rebalance it?

A. Add more sugar  
B. Add powdered sugar and honey  
C. Remove all liquid and keep cooking until burnt  
D. Add a small amount of acid, such as vinegar or lemon juice  

Correct Answer: D

Feedback: Acid can cut sweetness and make the flavor more balanced when used carefully.

### Mini Lesson 3: Rescue Heat, Salt, and Bitterness Carefully

Emergency fixes work best when they address the actual problem. Spicy heat can feel milder when creamy, fatty, starchy, or mild ingredients are added. Saltiness is usually reduced by dilution or adding unsalted ingredients. Bitterness from burned garlic or spices may not disappear, so the safest fix may be removing the burned pieces or starting that part over.

#### Question 1

A curry is too spicy, but the flavor is otherwise good. Which fix keeps the dish closest to the original?

A. Add coconut milk and extra mild ingredients gradually  
B. Add more chili flakes  
C. Boil it until the heat disappears  
D. Add dry flour directly to the curry  

Correct Answer: A

Feedback: Creamy and mild ingredients can reduce the perceived heat while keeping the curry’s flavor direction.

#### Question 2

Garlic burned in oil and tastes bitter before the rest of the sauce is added. What is the best immediate response?

A. Add sugar until the bitterness disappears  
B. Discard the burned garlic and oil, then restart that step  
C. Add more raw garlic to cover it  
D. Keep cooking because bitterness always fades  

Correct Answer: B

Feedback: Burned garlic can make a dish bitter. It is often better to restart that step than build a sauce on a bitter base.

---

## Skill: Texture Fixes

### Mini Lesson 1: Choose the Right Texture Direction

Texture fixes begin by naming the problem: too thin, too thick, lumpy, watery, dry, separated, or not crisp. Each problem needs a different response. Thickening requires starch, reduction, or an absorbing ingredient. Thinning requires liquid added slowly. Lumps need whisking or straining. The best fix depends on both the problem and the food.

#### Question 1

A cream soup is thin, but the flavor is already strong. Which fix thickens it without adding much extra flavor?

A. Add a cup of vinegar  
B. Add more salt  
C. Whisk in a cornstarch slurry and simmer briefly  
D. Add uncooked pasta and serve immediately  

Correct Answer: C

Feedback: A slurry can thicken the soup without dramatically changing the flavor when used carefully.

#### Question 2

A dip is too thick after chilling. Which fix gives the most control?

A. Pour in a full cup of liquid immediately  
B. Add dry flour  
C. Freeze it harder  
D. Stir in a small amount of milk or water at a time  

Correct Answer: D

Feedback: Small additions give control and prevent the dip from becoming too runny.

### Mini Lesson 2: Repair Broken or Uneven Textures

Some texture problems come from uneven mixing or too much heat. A grainy or separated sauce may need lower heat, gentle whisking, and a small splash of warm liquid. A lumpy sauce may need whisking or straining. The goal is to fix the texture without adding ingredients that make the problem worse.

#### Question 1

A cheese sauce becomes grainy after high heat. What should you try first?

A. Remove it from high heat and whisk gently with a splash of warm liquid  
B. Boil it harder  
C. Add ice cubes  
D. Add more dry cheese powder without stirring  

Correct Answer: A

Feedback: Lower heat and gentle whisking may help a grainy sauce smooth out. More high heat can make the problem worse.

#### Question 2

A custard is mostly smooth but has a few cooked egg bits. What is the best finishing step?

A. Add raw flour  
B. Strain it through a fine mesh strainer  
C. Blend in ice  
D. Cook it on high until it boils hard  

Correct Answer: B

Feedback: Straining removes small cooked bits and helps the custard feel smoother.

### Mini Lesson 3: Control Moisture and Crispness

Watery foods need moisture removed, absorbed, or balanced with more structure. Dry foods need careful moisture added back. Crisp foods need dry heat and space so steam can escape. Hard texture fixes often involve choosing whether to add, remove, or redistribute moisture.

#### Question 1

A casserole topping is soft near the end of cooking. What is the best way to improve it?

A. Cover it tightly to trap more steam  
B. Pour water over the topping  
C. Uncover it and use a little more dry oven heat, watching closely  
D. Put it in the refrigerator immediately  

Correct Answer: C

Feedback: Crisp toppings need moisture to escape. Uncovering and using dry heat can help, but it should be watched to prevent burning.

#### Question 2

Cookie dough is dry and crumbly after mixing. Which adjustment is safest?

A. Add a cup of water all at once  
B. Add more dry flour  
C. Bake it without changing anything  
D. Add a teaspoon of liquid or softened fat at a time until it holds together  

Correct Answer: D

Feedback: Small additions help restore moisture while avoiding dough that becomes too wet.

---

# Category 3: How to Cook

## Skill: Sautéing & Pan-Searing

### Mini Lesson 1: Use Heat for the Result You Want

Sautéing and searing both depend on heat control, but they aim for different results. Sautéing cooks smaller pieces quickly while they move in the pan. Pan-searing uses strong contact with the pan to create browning on the surface. Preheating matters because food that enters a cold pan may release moisture before browning can begin.

#### Question 1

You add sliced mushrooms to a barely warm pan and they release liquid instead of browning. What should you change next time?

A. Preheat the pan before adding the mushrooms  
B. Use a colder pan  
C. Add more water first  
D. Cover the pan tightly the whole time  

Correct Answer: A

Feedback: A preheated pan helps moisture evaporate faster and gives the mushrooms a better chance to brown.

#### Question 2

You want a browned crust on tofu slices. Which setup is most likely to help?

A. A cold pan full of water  
B. A hot pan, a little appropriate oil, and dry tofu surfaces  
C. A crowded pan with wet tofu  
D. A microwave-safe bowl with no oil  

Correct Answer: B

Feedback: Browning needs heat, surface contact, and less surface moisture.

### Mini Lesson 2: Manage Moisture, Space, and Movement

Browning gets harder when food is wet, crowded, or moved too soon. Crowding traps steam and lowers pan temperature. Wet surfaces delay browning because the pan must evaporate moisture first. Turning food too early can tear it or prevent crust formation. Give food enough space and time for the surface to brown.

#### Question 1

A pan of chicken strips is crowded and pale after several minutes. What is the most likely cause?

A. The chicken was cut too evenly  
B. The pan is too dry to cook food  
C. The food is steaming because there is too much in the pan  
D. The food has too much browned crust  

Correct Answer: C

Feedback: Crowding traps moisture and can make food steam instead of brown.

#### Question 2

A fish fillet sticks when you try to flip it right away. What should you usually do?

A. Force it loose immediately  
B. Add ice to the pan  
C. Turn off the heat and leave it raw  
D. Wait until the first side browns and releases more easily  

Correct Answer: D

Feedback: Searing food often releases more easily after browning develops.

### Mini Lesson 3: Finish Safely and Use the Pan Flavor

Harder pan cooking also includes what happens after browning. Brown bits left in the pan can become the base of a sauce through deglazing. Safety still matters: chicken and other meats should be checked reliably, and oil fires should never be handled with water. Good technique means better flavor and safer decisions.

#### Question 1

After searing chicken, brown bits remain on the skillet. What does deglazing mean?

A. Adding liquid to loosen the browned bits and build flavor  
B. Washing the pan with soap while still cooking  
C. Adding dry flour to remove all flavor  
D. Freezing the skillet before serving  

Correct Answer: A

Feedback: Deglazing uses liquid to lift browned bits from the pan, often creating the base for a sauce.

#### Question 2

Oil catches fire in a skillet. What is the safest response?

A. Pour water on the oil fire  
B. Turn off the heat if safe and cover the pan with a metal lid or baking sheet  
C. Carry the flaming pan outside  
D. Throw flour into the flames  

Correct Answer: B

Feedback: Water can spread a grease fire. Covering the pan and cutting heat removes oxygen and heat when it can be done safely.

---

## Skill: Boiling, Simmering, & Poaching

### Mini Lesson 1: Control Bubble Strength

The bubble level tells you a lot about the cooking method. A full boil has large, constant bubbles. A simmer has smaller, gentler bubbles. Poaching is even gentler, usually below a simmer. Harder questions ask you to choose the bubble level based on the food’s texture and how much movement it can handle.

#### Question 1

A pot for pasta has only a few small bubbles and the pasta is clumping. What should you do before adding more pasta?

A. Lower the heat until there are no bubbles  
B. Add ice to slow the cooking  
C. Return the water to a full boil and stir after adding pasta  
D. Cover the pasta with oil instead of water  

Correct Answer: C

Feedback: Pasta cooks best in plenty of actively boiling water, and stirring helps prevent sticking.

#### Question 2

You are cooking delicate fish in liquid and it keeps breaking apart. What is the likely problem?

A. The liquid is too gentle  
B. The fish needed a full rolling boil  
C. The fish should be stirred constantly  
D. The liquid is bubbling too aggressively  

Correct Answer: D

Feedback: Delicate foods can break apart in vigorous bubbles. Poaching uses gentler heat.

### Mini Lesson 2: Choose the Method for the Food

Sturdy foods can handle boiling because they are less likely to fall apart. Soups, stews, beans, and sauces often do better at a simmer because they need time and control. Delicate foods like eggs or fish often need poaching so the heat cooks gently without rough movement. Matching the method to the food protects texture.

#### Question 1

A stew is boiling hard and the vegetables are breaking apart. What adjustment makes the most sense?

A. Lower the heat to a gentle simmer  
B. Raise the heat higher  
C. Stir harder and faster  
D. Add ice and serve immediately  

Correct Answer: A

Feedback: A gentle simmer reduces rough movement and helps ingredients keep their texture.

#### Question 2

You want to cook an egg gently in hot water without a shell. Which method fits best?

A. Roasting  
B. Poaching  
C. Pan-searing  
D. Freezing  

Correct Answer: B

Feedback: Poaching uses gentle hot liquid and is commonly used for eggs.

### Mini Lesson 3: React Safely to Hot Liquid Problems

Hard liquid-cooking questions often involve safety and control. Large pots of boiling water are heavy and dangerous. Boil-overs happen when heat is too high, the pot is too full, or foam builds up. Draining should be done carefully, and lowering heat is usually the first response when liquid starts to boil over.

#### Question 1

A large pot of pasta is ready, but the pot is too heavy to pour safely. What is the safest option?

A. Pour quickly and hope the water misses you  
B. Hold the colander with one hand in midair  
C. Use tongs, a spider, or a slotted spoon to remove the pasta  
D. Scoop boiling water with a glass cup  

Correct Answer: C

Feedback: Removing pasta with a tool avoids lifting and pouring a heavy pot of boiling water.

#### Question 2

A starchy pot begins boiling over. What should you do first?

A. Add more heat  
B. Clamp the lid tighter  
C. Pour oil into the overflowing water  
D. Lower the heat or carefully move the pot off the burner  

Correct Answer: D

Feedback: Reducing heat helps calm the boil-over. Tight covering or more heat can make it worse.

---

## Skill: Oven Roasting vs. Baking

### Mini Lesson 1: Use the Oven Method Intentionally

Roasting and baking both use dry oven heat, but they usually prioritize different outcomes. Roasting often focuses on browning foods that already have structure, such as vegetables or meat. Baking often focuses on setting a batter or dough into a finished structure. Harder questions ask whether the food needs browning, setting, rising, crisping, or safe doneness.

#### Question 1

You want cauliflower pieces with browned edges and deeper flavor. Which method and setup fit best?

A. Roast them spread out on a sheet pan  
B. Bake them piled in a deep covered bowl  
C. Poach them in water  
D. Microwave them in a sealed plastic bag  

Correct Answer: A

Feedback: Roasting on a sheet pan gives the cauliflower dry heat and surface area for browning.

#### Question 2

Cookie dough spreads too much because it went into an oven that was still warming up. What likely happened?

A. The cookies roasted too quickly  
B. The cookies started melting before the oven reached the intended baking temperature  
C. The oven was too accurate  
D. The cookie dough had too much browning space  

Correct Answer: B

Feedback: Baking often depends on starting at the intended oven temperature so structure forms at the right time.

### Mini Lesson 2: Control Moisture and Browning in Roasting

Roasting depends on dry heat, space, and surface contact. If food is crowded, steam gets trapped and browning slows down. A moderate amount of oil helps transfer heat and support browning, but too much oil can make food greasy. Turning food partway through can expose more sides to the heat.

#### Question 1

Roasted vegetables are soft but not browned. Which change is most likely to help next time?

A. Pile them deeper in the same pan  
B. Cover the pan tightly with foil the whole time  
C. Use a larger sheet pan or cook in batches  
D. Add water to the pan  

Correct Answer: C

Feedback: More space lets moisture escape and helps vegetables brown instead of steam.

#### Question 2

Halfway through roasting potatoes, the bottoms are browned but the tops are pale. What should you do?

A. Add cold water  
B. Turn off the oven  
C. Cover them with a wet towel  
D. Turn or stir them so more sides contact the hot pan  

Correct Answer: D

Feedback: Turning exposes more sides to heat and helps browning happen more evenly.

### Mini Lesson 3: Respect Structure and Doneness in Baking

Baked goods need time for structure to form. Cakes, muffins, breads, and cookies depend on heat, ingredient balance, and timing. Opening the oven repeatedly releases heat, and removing a baked good too early can leave the center unset. For meats, visual browning is not enough; use a reliable doneness check.

#### Question 1

A cake looks browned outside but jiggles in the center. What is the best interpretation?

A. The center may not be set yet  
B. It is definitely overbaked  
C. It no longer needs heat  
D. It should be frozen immediately  

Correct Answer: A

Feedback: Browning outside does not always mean the center is set. Cakes need internal structure before removal.

#### Question 2

A roasted whole chicken is browned on the outside. What is the most reliable way to know it is safely cooked?

A. Guess based on the skin color only  
B. Check the internal temperature with a food thermometer  
C. Press the outside with a spoon  
D. Assume browning always means safe  

Correct Answer: B

Feedback: A thermometer is more reliable than color alone for checking doneness in poultry.

---

# Category 4: Utensil Handling

## Skill: Essential Knife Work

### Mini Lesson 1: Control the Knife and the Food

Hard knife questions usually involve stability. Your guiding hand should protect your fingertips, the food should not roll, and the cutting board should not slide. A claw grip, a flat side on round foods, and a stable board all give you more control. Good knife work is less about speed and more about reducing slipping.

#### Question 1

You need to slice a round potato, but it keeps rolling. What should you do first?

A. Hold it in the air while slicing  
B. Push harder with the knife  
C. Cut a flat side so the potato sits steadily  
D. Oil the potato so it moves freely  

Correct Answer: C

Feedback: A flat side keeps round food more stable and reduces the chance of the knife slipping.

#### Question 2

Your cutting board slides while chopping. What is the safest fix?

A. Hold the board down with the knife hand  
B. Cut faster so it has less time to move  
C. Put loose paper underneath it  
D. Place a damp towel or non-slip mat underneath it  

Correct Answer: D

Feedback: A damp towel or non-slip mat grips the counter and helps stabilize the cutting board.

### Mini Lesson 2: Choose the Right Knife Habit for the Situation

A chef’s knife is useful for many chopping tasks, but safety habits matter more than the knife name. Carry knives with the blade down and away. Wash them separately so nobody reaches into hidden blades. If a knife falls, step back. These habits prevent accidents during the moments around cutting, not just during cutting itself.

#### Question 1

You finish chopping and need to move the knife to another counter. What is the safest carry method?

A. Hold it at your side with the blade pointed down and away from others  
B. Carry it point-first at chest height  
C. Hide it under a towel while walking  
D. Toss it gently onto the next counter  

Correct Answer: A

Feedback: Keeping the blade down and away reduces the chance of cutting yourself or someone nearby.

#### Question 2

A sharp knife slips off the counter. What should you do?

A. Catch it by the handle if possible  
B. Step back and let it fall  
C. Catch it by the blade  
D. Kick it back onto the counter  

Correct Answer: B

Feedback: Trying to catch a falling knife is dangerous. Step back and let it fall.

### Mini Lesson 3: Use Clean, Safe Surfaces

Knife work also includes choosing a clean surface and cleaning tools safely afterward. Raw meat needs a surface that can be washed and sanitized. Sharp knives should not be hidden in sinks or loose piles of dishes. A sharp, clean knife on a stable, clean board is safer than a dull knife on an unstable or contaminated surface.

#### Question 1

You cut raw chicken and then need to chop lettuce. What should happen before using the board again?

A. Wipe it quickly with a dry towel only  
B. Use the same board because lettuce is cold  
C. Wash and sanitize the board, or use a separate clean board  
D. Flip the board without cleaning it  

Correct Answer: C

Feedback: Raw chicken can contaminate surfaces. The board should be cleaned and sanitized or replaced with a clean board before cutting ready-to-eat foods.

#### Question 2

Why is leaving a sharp knife hidden in a sink full of soapy water unsafe?

A. The knife becomes too clean  
B. The knife cannot cut in water  
C. The soap makes the blade disappear permanently  
D. Someone may reach in without seeing the blade  

Correct Answer: D

Feedback: A hidden blade can cut someone reaching into the sink. Wash sharp knives separately and keep them visible.

---

## Skill: Pan & Surface Matching

### Mini Lesson 1: Choose Heat-Holding Tools for Browning

Hard pan matching asks what the cooking surface needs to do. Searing and stir-frying need strong heat and enough space. A pan that holds heat well can help food brown when cold food hits the surface. A pan that is too thin, crowded, or not heat-safe can make food steam, scorch, or cook unevenly.

#### Question 1

You want a browned crust on steak, but your thin pan cools down quickly. Which pan would be a better match?

A. Cast iron or heavy stainless steel skillet  
B. Plastic mixing bowl  
C. Thin disposable tray  
D. Small glass cup  

Correct Answer: A

Feedback: Cast iron and heavy stainless steel hold heat better, which helps develop browning.

#### Question 2

You are stir-frying vegetables and they pile up in a small pan. What tool would better match the method?

A. A coffee mug  
B. A wok or large skillet  
C. A narrow saucepan filled to the top  
D. A plastic storage container  

Correct Answer: B

Feedback: Stir-frying needs high heat and space so food cooks quickly instead of steaming in a pile.

### Mini Lesson 2: Match Material to Food Chemistry

Some foods react with cookware. Acidic foods like tomato sauce are best in nonreactive cookware such as stainless steel or enameled pots. Delicate foods like eggs often need a surface that releases easily. The pan material can affect sticking, flavor, and cleanup, so the safest match depends on both the food and the method.

#### Question 1

You are simmering tomato sauce for an hour. Which cookware is the best match?

A. Uncoated reactive aluminum  
B. A plastic bowl on the stove  
C. Stainless steel or enameled cookware  
D. A cardboard container  

Correct Answer: C

Feedback: Tomato sauce is acidic, so nonreactive cookware such as stainless steel or enameled cookware is a better choice.

#### Question 2

You are cooking delicate scrambled eggs and want minimal sticking. Which pan is the best beginner choice?

A. Unlined stockpot  
B. Baking sheet  
C. Metal colander  
D. Nonstick skillet  

Correct Answer: D

Feedback: A nonstick skillet helps delicate eggs release more easily while cooking.

### Mini Lesson 3: Match the Surface to the Appliance

Pans also need to match the appliance. Glass stovetops need flat-bottom cookware so heat transfers evenly and the pan stays stable. Broilers use intense top heat, so cookware must be broiler-safe. Roasting needs a wide oven-safe surface, while boiling pasta needs a large pot with enough room and water.

#### Question 1

Why should cookware used on a glass stovetop have a flat bottom?

A. It improves contact, stability, and heat transfer  
B. It makes food cook without heat  
C. It prevents the pan from needing washing  
D. It turns the stovetop into an oven  

Correct Answer: A

Feedback: Flat-bottom cookware sits securely and transfers heat more evenly on a glass stovetop.

#### Question 2

You want to brown food under the oven broiler. Which choice is safest?

A. Plastic storage container  
B. Broiler-safe metal cookware or cast iron  
C. Regular drinking glass  
D. Paper plate  

Correct Answer: B

Feedback: Broilers use intense direct heat, so cookware must be safe for broiler use.

---

## Skill: Hack-it-With-What-You-Have

### Mini Lesson 1: Replace the Function, Not the Name

Hard tool substitutions work by identifying the tool’s job. A rolling pin rolls with a smooth cylinder. A meat mallet flattens with controlled pressure. A citrus juicer presses and twists to release juice. The substitute should safely copy the function without breaking, slipping, melting, or contaminating the food.

#### Question 1

You need to roll dough evenly but do not own a rolling pin. Which substitute best copies the tool’s function?

A. A fork with sharp tines  
B. A damp towel  
C. A clean smooth bottle or sturdy cup  
D. A flexible plastic bag full of air  

Correct Answer: C

Feedback: A smooth bottle or sturdy cup has a rolling shape similar to a rolling pin.

#### Question 2

You need to flatten chicken breasts without a meat mallet. Which workaround is safest?

A. Use a sharp knife blade to pound the chicken  
B. Use a glass cup that may shatter  
C. Use your bare fist on uncovered raw chicken  
D. Use the flat bottom of a heavy skillet or rolling pin over wrapped chicken  

Correct Answer: D

Feedback: A heavy flat tool can apply pressure evenly, and wrapping the chicken helps contain mess and contamination.

### Mini Lesson 2: Use Basic Utensils Creatively

Many specialty tools save time but are not required. A fork can mash soft foods or help juice citrus. A knife can mince garlic. A spoon can spread oil in a pinch. The substitute may be slower, but it should perform the same basic motion safely and cleanly.

#### Question 1

You need finely prepared garlic but do not own a garlic press. What should you do?

A. Mince the garlic finely with a knife  
B. Leave the cloves whole and raw in the finished dish  
C. Replace the garlic with flour  
D. Crush it with a dirty sponge  

Correct Answer: A

Feedback: A knife can mince garlic finely, even though it may take longer than a press.

#### Question 2

You need to spread a thin layer of oil but have no pastry brush. Which workaround is most reasonable?

A. Use raw chicken as a brush  
B. Use a clean spoon or clean fingers to spread it lightly  
C. Use a dirty towel  
D. Pour the whole bottle on the food  

Correct Answer: B

Feedback: A clean spoon or clean fingers can spread a small amount of oil safely when a brush is unavailable.

### Mini Lesson 3: Make Safe Setups for Heat and Liquid

Some hacks are less about replacing a hand tool and more about making a safe setup. A double boiler needs gentle indirect heat. Straining pasta requires avoiding burns from boiling water. Covering dough needs a clean barrier that protects the dough without sealing it dangerously tight. Good hacks solve the problem without creating a bigger safety issue.

#### Question 1

You need to melt chocolate gently without a double boiler. Which setup is best?

A. A plastic bowl directly on a burner  
B. Chocolate in a dry pan over high heat  
C. A heat-safe bowl set over a pot of gently simmering water, with the bowl above the water  
D. A paper plate over boiling water  

Correct Answer: C

Feedback: A heat-safe bowl over simmering water creates gentle indirect heat, which helps prevent scorching.

#### Question 2

You need to drain pasta but do not have a colander, and the pot is heavy. What is the safest workaround?

A. Pour boiling water through your fingers  
B. Balance the lid loosely and pour quickly  
C. Use a paper towel as a strainer  
D. Lift the pasta out with tongs, a spider, or a slotted spoon  

Correct Answer: D

Feedback: Removing pasta with a tool avoids pouring a heavy pot of boiling water without proper equipment.

---
