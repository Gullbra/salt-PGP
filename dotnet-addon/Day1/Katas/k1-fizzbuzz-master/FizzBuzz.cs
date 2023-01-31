using System;
using System.Linq;

// namespace SaltAddon.Day1.k1_fizzbuzz_master;

namespace SaltAddon.Day1.FizzBuzz;
public class FizzBuzz
{
  public string[] _list = Enumerable
    .Range(1, 100)
    .Select(num => Convert.ToString(num))
    .ToArray();

  public string ConvertSingle(string element)
  {
		int intElement = Convert.ToInt32(element);
		if (intElement % 5 == 0 && intElement % 3 == 0) return "FizzBuzz";
		if (intElement % 5 == 0) return "Buzz";
		if (intElement % 3 == 0) return "Fizz";
		return element;
	}

  public string[] ReplaceWithFizzBuzz(string[] listToFizzBuzz)
  {
    return listToFizzBuzz.Select(element => {
      return ConvertSingle(element);
    }).ToArray();
  }
  public string[] ReplaceWithFizzBuzz() { return ReplaceWithFizzBuzz(this._list); }

	public void PrintAnswers (string[] answers)
  {
    foreach(var answer in answers)
    {
      Console.WriteLine(answer);
    }
  }
}
