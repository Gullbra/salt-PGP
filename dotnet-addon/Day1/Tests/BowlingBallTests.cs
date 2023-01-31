using System;
using System.Linq;
using FluentAssertions;
using SaltAddon.Day1.BowlingBall;

namespace SaltAddon.Day1.Tests;

[TestClass]
public class BowlingBallTests 
{
	/*
  1 "game" or "line"
    10 "turns" or "frames"
      "2 tries"
        not all down: "normal"
          score: pins down
        All down on second try: "spare"
          score: pins down(10-last) + pins down next try
        All down on first try: "strike"
          score: pins down(10) + pins down two next tries
  */

	[DataTestMethod]
	[DataRow("X X X X X X X X X X X X", 300)]
	[DataRow("9- 9- 9- 9- 9- 9- 9- 9- 9- 9-", 90)]
	[DataRow("5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/5", 150)]
	public void TestingLinesGetScore(string input, int totalScore)
	{
		Line TestLine = new(input);

		Assert.AreEqual(totalScore, TestLine.GetScore());
	}

	[DataTestMethod]
	[DataRow("X X X X X X X X X X X X", 12, 12)]
	[DataRow("9- 9- 9- 9- 9- 9- 9- 9- 9- 9-", 10, 20)]
	[DataRow("5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/5", 10, 21)]
	public void TestingLinesProperty(string input, int nuberOfFrames, int nuberOfTries)
	{
		Line TestLine = new(input);

		Assert.AreEqual(nuberOfFrames, TestLine.ListOfFrames.Count);
		Assert.AreEqual(nuberOfTries, TestLine.ListOfTries.Count);
	}

	[DataTestMethod]
	[DataRow("X")]
	[DataRow("6/")]
	[DataRow("5-")]
	public void TestingFrames(string input)
	{
		Frame TestFrame = new(input);

		List<Try> TestList = new();
		foreach (char cha in input)
			TestList.Add(new Try(Convert.ToString(cha)));

		TestList.Should().BeEquivalentTo(TestFrame.ListOfTries);
	}

	[DataTestMethod]
	[DataRow("X", 10, false, true)]
	[DataRow("/", 0, true, false)]
	[DataRow("5", 5, false, false)]
  [DataRow("-", 0, false, false)]
	public void TestingTries(string input, int score, bool isSpare, bool isStrike)
  {
		Try TestTry = new(input);

    Assert.AreEqual(score, TestTry.Score);
    Assert.AreEqual(isSpare, TestTry.IsSpare);
    Assert.AreEqual(isStrike, TestTry.IsStrike);
  }
}