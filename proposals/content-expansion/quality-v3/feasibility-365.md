# 365+ Day Feasibility

The scheduler already tracks all recipe, family, ingredient, solution, structure, rolling-window, and recent-day state needed to extend a schedule. It can accept prior-batch state conceptually, but this prototype does not yet serialize that state as a production API.

**Assessment:** Medium is suitable for a 365-day candidate-generation trial. Hard is not: the 100-day schedule still has a 41-use maximum and only 116/150 recipe coverage. Extending it would amplify the same central recipes.

Smallest next content step: curate 3–4 additional Hard overlap clusters (roughly 20–30 recipes total) around tomato/pasta/pizza, seafood/rice, breakfast/bread/potato, and noodles/stir-fries. Each adjustment needs culinary review and before/after measurement. Do not schedule 365 Hard days until the maximum frequency falls below the review threshold.