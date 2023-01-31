using System;
using System.Linq;

namespace SaltAddon.Day1.LectureNotes;
internal class LectureOne
{
	internal LectureOne()
	{
		Console.WriteLine("\nLecture Notes, part 1 (choose \"info\", \"ClassExamples\", \"OOP\", \"async\" ): ");

		switch (Console.ReadLine()?.ToLower())
		{
			case "info":
				Info();
				break;
			case "classexamples":
				ClassExamples();
				break;
			case "async":
				//AsyncExamples();
        System.Console.WriteLine("Not fully implemented!");
				break;
			case "OOP":
				OopExamples();
				break;
			default:
				break;
		}
	}

	private static void Info()
	{
		string[] infoArray = {
			"\t.NET Framework | .NET CORE => .NET" +
			"\n\tWin only     |   Cross-platform" +
			"\n.NET core can be compiled to work in on .NET, but not other way around",

			"C-based: simular to JS" +
			"\nCompiles to CIL on build, CIL => Machine code when run"
		};

		foreach (var slide in infoArray)
		{
			System.Console.WriteLine(slide);
			System.Console.WriteLine("\nPress any key to continue. \"Q\" to quit");
			if (Console.ReadKey().Key == ConsoleKey.Q) break;
			System.Console.WriteLine();
		}
	}
	private static void ClassExamples()
	{
		Person PersonMartin = new("Martin");
		Console.WriteLine($"PersonMartin.name: {PersonMartin.name}");

		Person PersonUnknown = new();
		Console.WriteLine($"PersonMartin.name: {PersonMartin.name}");

	}
	private static void OopExamples()
	{
		Console.WriteLine
		(
			"data: fields and properties" +
			"methods: functions\n" +
			"encapsulation: protecting data and access through encapsulation\n" +
			"Inheriting code\n" +
			"Polymorphism"
		);

		Console.WriteLine
		(
			"\nPublic: seen outside class" +
			"\nprotected: seen inside class and subclasses" +
			"\ninternal: seen inside same assenbly files (namespace)" +
			"\nprivate: seen only in same class" +
			"\n" +
			"\nreadonly: field can only be set in constructor"
		);
	}
  /*
	private async static void AsyncExamples()
	{
		Console.WriteLine
		(
			"JavaScript \"Promise\" = C# \"Task\"" +
			"\nMethod naming: async Task<IEnumerable<Person>> GetCollectionOfPersons()"
		);

		Db PeopleDb = new();
	  var people = await PeopleDb.GetCollectionOfPersons();
	}
  */
}

internal class Person
{
	public readonly string name;

	public Person() : this("Unknown name")
	{
		Console.WriteLine("If instatiated with no parameters, \"Person()\", the constructor will now call \"Person(\"Unknown name\")\"");
	}
	public Person(string name)
	{
		this.name = name;
	}
}

internal class Db
{
	private List<Person> _db;

	public Db() : this(new List<Person> { new Person("Martin"), new Person("Oscar") }) { }

	public Db(List<Person> db)
	{
		_db = db.ToList();
	}

	public List<Person> GetCollectionOfPersons() { return _db; }

	/*
  public async Task<List<Person>> asyncTest()
  {
    return await this.GetCollectionOfPersons();
  }
  */
}