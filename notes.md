Features to add:


Hitbox ✅
Score ✅
Player acceleration
array for dust particles? ✅

Next: 
1. End screen
2. Remove dust gamemode optimisation (only update score box collision when initialising == true)
3. Art
4. Optimise 

Optimisation order: 
a. rewrite the calculateDustLeft() function, and make it only have to be called once per frame and keep the output variable
b. make the array only mave to be checked once per frame rather than the 4-5 it's being checked now