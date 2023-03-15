using System;
using System.Text.Json;
using Week11.ClassLibrary;

namespace Week11.JsonRead;


internal class Program
{
	private static void Main(string[] args)
	{

		/* Without stream
		 
		string text = File.ReadAllText(@"./Test.json");
		var testPerson = JsonSerializer.Deserialize<TestPerson>(text);

		if (testPerson != null)
			Console.WriteLine(testPerson.FirstName);			
		 */



		var filePath = System.IO.Path.Combine(
			AppDomain.CurrentDomain.BaseDirectory, @"../../../Test.json"
			);
		Console.WriteLine(Path.GetFullPath(filePath));
		

		TestPerson? source;

		using (StreamReader reader = new(@"./Test.json"))
		{
			string json = reader.ReadToEnd();
			source = JsonSerializer.Deserialize<TestPerson>(json);
		}

		Console.WriteLine(source?.FirstName);
	


				//List<RawRoute>? source = new();

				//Console.WriteLine("Hey");
				//  Console.WriteLine(source);

				//Console.ReadKey();

				// Console.WriteLine(source[0].ToString());

				//foreach (var route in source)
				//{
				//	Console.WriteLine(route.route_id);
				//}
		}
}

public class TestPerson 
{
	public string? FirstName { get; set; }
	public string? LastName { get; set; }
	public string? JobTitle { get; set; }


}