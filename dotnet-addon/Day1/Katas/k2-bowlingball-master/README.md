# The Bowling ball kata

This is the famous Bowling Ball kata, that you probably have tried before. But this time around I want you to use the paradigm and principles of Object Oriented programming to solve it.

## The Kata

I have stolen the [description from here]()

Create a program, which, given a valid sequence of rolls for one line of American Ten-Pin Bowling, produces the total score for the game. Here are some things that the program will not do:

* We will not check for valid rolls.
* We will not check for correct number of rolls and frames.
* We will not provide scores for intermediate frames.

Depending on the application, this might or might not be a valid way to define a complete story, but we do it here for purposes of keeping the kata light. I think you’ll see that improvements like those above would go in readily if they were needed for real.

We can briefly summarize the scoring for this form of bowling:

* Each game, or “line” of bowling, includes ten turns, or “frames” for the bowler.
* In each frame, the bowler gets up to two tries to knock down all the pins.
* If in two tries, he fails to knock them all down, his score for that frame is the total number of pins knocked down in his two tries.
* If in two tries he knocks them all down, this is called a “spare” and his score for the frame is ten plus the number of pins knocked down on his next throw (in his next turn).
* If on his first try in the frame he knocks down all the pins, this is called a “strike”. His turn is over, and his score for the frame is ten plus the simple total of the pins knocked down in his next two rolls.
* If he gets a spare or strike in the last (tenth) frame, the bowler gets to throw one or two more bonus balls, respectively. These bonus throws are taken as part of the same turn. If the bonus throws knock down all the pins, the process does not repeat: the bonus throws are only used to calculate the score of the final frame.
* The game score is the total of all frame scores.

More info on the rules at: [How to Score for Bowling](http://www.topendsports.com/sport/tenpin/scoring.htm)

### Clues

What makes this game interesting to score is the lookahead in the scoring for strike and spare. At the time we throw a strike or spare, we cannot calculate the frame score: we have to wait one or two frames to find out what the bonus is.

Suggested Test Cases
(When scoring `X` indicates a strike, `/` indicates a spare, `-` indicates a miss/gutter ball)

* `X X X X X X X X X X X X` (12 rolls: 12 strikes) = 10 frames * 30 points = 300
* `9- 9- 9- 9- 9- 9- 9- 9- 9- 9-` (20 rolls: 10 pairs of 9 and miss) = 10 frames * 9 points = 90
* `5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/5` (21 rolls: 10 pairs of 5 and spare, with a final 5) = 10 frames * 15 points = 150

## Some starting points and tips

This [amazing article](https://ronjeffries.com/xprog/articles/acsbowling/) was really a turning point for me in understanding the TDD process properly. I urge you to follow along, although there are better ways to write code now (an `ArrayList` could be `List<T>` for example)

Let's steal from this master TDD:er and use the following plan: 

* Have a class for the Game itself
* Define classes for each particular case; OpenFrame, SpareFrame and StrikeFrame... and more?
* Use strict TDD Rules:
  * You are not allowed to write any production code unless it is to make a failing unit test pass
  * You are not allowed to write any more of a unit test that is sufficient to fail, and compilation failures are failures
  * You are not allowed to write any more production code that is sufficient to pass the one failing the unit test

Good luck
