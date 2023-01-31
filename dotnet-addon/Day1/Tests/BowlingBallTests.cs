using System;
using System.Linq;
using FluentAssertions;

namespace SaltAddon.Day1.Tests;

[TestClass]
public class BowlingBallTests 
{
  internal BowlingBall.BowlingBall TestObject = new();

  [DataTestMethod]
  [DataRow("X X X X X X X X X X X X", 300)]
  [DataRow("9- 9- 9- 9- 9- 9- 9- 9- 9- 9-", 90)]
  [DataRow("5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/ 5/5", 150)]
  public void BasicIOTests (string input, int output) 
  {
    Assert.Equals(TestObject.GetScore(input), output);
  }
}