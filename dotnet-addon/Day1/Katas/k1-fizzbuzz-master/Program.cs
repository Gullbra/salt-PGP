
namespace SaltAddon.Day1.FizzBuzz;
class Program {
  public static void Main(string[] args)
  {
    FizzBuzz TestInstance = new();
    string[] answers = TestInstance.ReplaceWithFizzBuzz(TestInstance._list);
    TestInstance.PrintAnswers(answers);
  }
}