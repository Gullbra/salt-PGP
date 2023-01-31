using System;
using System.Linq;
using FluentAssertions;

namespace SaltAddon.Day1.Tests;
[TestClass]
public class FizzBuzzTests
{
  public FizzBuzz.FizzBuzz testFizzBuzz = new ();

  [TestMethod]
  public void ShouldGiveArrayOf100() => testFizzBuzz._list.Length.Should().Be(100);

  [TestMethod]
  public void ShouldConvertOne () => testFizzBuzz.ConvertSingle("1").Should().Be("1");

  [TestMethod]
  public void ShouldConvertThree () => testFizzBuzz.ConvertSingle("3").Should().Be("Fizz");

  [TestMethod]
  public void ShouldConvertFive () => testFizzBuzz.ConvertSingle("5").Should().Be("Buzz");

  [TestMethod]
  public void ShouldConvertFifteen () => testFizzBuzz.ConvertSingle("15").Should().Be("FizzBuzz");

	[TestMethod]
  public void ShouldGiveDefault () => testFizzBuzz.ReplaceWithFizzBuzz().Length.Should().Be(100);


  [DataTestMethod]
  [DataRow(1, "Fizz")]
  [DataRow(2, "22")]
  [DataRow(5, "Buzz")]
  [DataRow(10, "FizzBuzz")]
  public void ShouldConvertCustumRanges(int index, string answer)
  {
    testFizzBuzz
      .ReplaceWithFizzBuzz(Enumerable.Range(20, 30)
      .Select(i => i.ToString())
      .ToArray())[index]
      .Should().Be(answer);
  }
}