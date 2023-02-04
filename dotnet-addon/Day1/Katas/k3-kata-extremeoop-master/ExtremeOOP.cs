using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SaltAddon.Day1.ExtremeOOP;


/*
 Class Iohandler 
 
 */


public class IOhandler
{
	public List<string> inputLines = new();
	public List<string> outputLines = new();

	public IOhandler (string input) 
	{
		inputLines = input.Split('\n').ToList();
	}


	public string returnOutPut(string input)
	{
		

		return input;
	}
}

internal class PrintHandler
{
	// public check
}
