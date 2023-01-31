using System;


namespace SaltAddon.Day1.LectureNotes;
internal class LectureTwo
{
	internal LectureTwo() 
	{
		Console.WriteLine("Lecture 2:");
		dotNetCli();
	}

	internal void dotNetCli()
	{
		Console.WriteLine
		(
			"\ndotnet new: list available templates" +
			"\n\ndotnet start:" +
			"\ndotnet test:" +
			"\ndotnet build: builds assembly (JIT: C# => CLR)" +
			"\ndotnet restore: pulls down all dependecies needed" +
      "\n\ndotnet add <project> reference <another project>: Will build them both when one is run" +
			"\n\ndotnet add package <package name>: A bit like npm i"
		);
    Console.ReadKey();
    Console.WriteLine
    (
      "\nNuGet: package manager (like npmjs)" +
      "\nnot every packege will run on .Net (Core)"
    );
	}
}

