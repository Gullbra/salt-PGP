using System;

namespace SaltAddon.Day1.BowlingBall;

/*
  1 "game" or "line"
    10 "turns" or "frames"
      "2 tries"
        not all down: "normal"
          score: pins down
        All down on second try: "spare"
          score: pins down(10) + pins down next try
        All down on first try: "strike"
          score: pins down(10) + pins down two next tries
*/

public class BowlingBall
{
  public int GetScore(string resultString) 
  {
    return 0;
  }
}

internal class Line{}

internal class Frame{}

internal class Try{}