using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace SaltAddon.Day1.LectureNotes;

class Program
{
  public static void Main(string[] args)
  {
		Console.WriteLine("Lecture 1 or 2:");
		switch (Console.ReadLine()?.ToLower())
		{
			case "1":
			case "lecture1":
			case "lecture 1":
				new LectureOne();
				break;
			case "2":
			case "lecture2":
			case "lecture 2":
				new LectureTwo();
				break;
			default:
				break;
		}
	}
}

