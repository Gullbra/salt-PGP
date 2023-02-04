using System;

namespace SaltAddon.Day1.BowlingBall;
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
		switch (result)
		{
			case "X":
				Score = 10;
				IsStrike = true;
				IsSpare = false;
				break;
			case "/":
				Score = 0;
				IsStrike = false;
				IsSpare = true;
				break;
			case "-":
				Score = 0;
				IsStrike = false;
				IsSpare = false;
				break;
			default:
				if (!int.TryParse(result, out int intResult))
					throw new ArgumentException("Invalid args for new BowlingBall.Try(args): non-valid string");
				if (intResult < 0 || intResult > 10)
					throw new ArgumentException("Invalid args for new BowlingBall.Try(args): outside range");

				Score = intResult;
				IsStrike = false;
				IsSpare = false;					
				break;
		}
	}

	public int Score { get; }
	public bool IsStrike { get; }
	public bool IsSpare { get; }
}