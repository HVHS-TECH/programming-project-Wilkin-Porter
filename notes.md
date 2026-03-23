Features to add:
1. Art
1. Optimise 
3. Make sizes properly dynamic
4. Controls screen
5. Add an exit button for freeroam
6. hold space to boost dust move radius for a few seconds, decreases battery then slowly recharges, or battery indicator is replaced with fullness indicator
7. Player acceleration?

Optimisation order: 
a. rewrite the calculateDustLeft() function, and make it only have to be called once per frame and keep the output variable
b. make the array only have to be checked once per frame rather than the 4-5 it's being checked now

y = 1/x 
y is distance from player, must be positive, x is new position, or speed ig 

replace removal circle with a timer and movement