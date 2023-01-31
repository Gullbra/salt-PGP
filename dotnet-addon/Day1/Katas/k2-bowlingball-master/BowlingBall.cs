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
	public int testingScore;
	public BowlingBall() 
	{
		testingScore = 5;
	}
  public int GetScore(string resultString) 
  {
    return 0;
  }
}

public class Line
{
	public readonly List<Frame> ListOfFrames;
	public readonly List<Try> ListOfTries;

	public Line(string input)
	{
		ListOfFrames = input
			.Split(" ")
			.Select(frameInput => new Frame(frameInput))
			.ToList();

		ListOfTries = new();
		foreach (var frame in ListOfFrames)
		{
			ListOfTries.AddRange(frame.ListOfTries);
		}
	}

	public int GetScore()
	{

		int sum = 0;
		for (int i = 0; i < ListOfTries.Count; i++)
		{
			sum += ListOfTries[i].Score;
			if (ListOfTries[i].IsSpare)
			{
				sum += 10 - ListOfTries[i-1].Score;
			}

			if (ListOfTries[i].IsSpare || ListOfTries[i].IsStrike)
			{
				if (i + 1 < ListOfTries.Count - 1)
					sum += ListOfTries[i + 1].Score;
			}
			if (ListOfTries[i].IsStrike)
			{
				if (i + 2 < ListOfTries.Count - 2)
					sum += ListOfTries[i + 2].Score;
			}
		}
		return sum;
	}
}

public class Frame
{
	public readonly List<Try> ListOfTries;

	public Frame(string input)
	{
    ListOfTries = new List<Try>(
			input.Select(cha => new Try(cha.ToString()))){};
	}
}

public class Try
{
	public Try(string result)
	{
    if (result == "X") 
    {
  		Score = 10;
      IsStrike = true;
      IsSpare = false;
    }
    else if (result == "/") 
    {
			Score = 0;
			IsStrike = false;
			IsSpare = true;
		}
		else if (result == "-")
		{
			Score = 0;
			IsStrike = false;
			IsSpare = false;
		}
		else
    {
			Score = Convert.ToInt32(result);
			IsStrike = false;
			IsSpare = false;
		}
	}

	public int Score { get; }
	public bool IsStrike { get; }
	public bool IsSpare { get; }
}