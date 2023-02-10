//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
using System.Text.RegularExpressions;
//using System.Threading.Tasks;
//using static System.Net.Mime.MediaTypeNames;

namespace SaltAddon.Day1.ExtremeOOP;

public class IOhandler
{
	public List<string> inputLines = new();
	public List<string> outputLines = new();

	public IOhandler (string input) 
	{
		inputLines = input.Split('\n').ToList();
		outputLines = inputLines.Select(LineHandler.LineTranslator).ToList();
	}
}

internal class LineHandler
{
	public static string LineTranslator(string line)
	{
		string trimmedLine = line.Trim();
		string translatedLine = string.Empty;

		if (new Regex("^PRINT").IsMatch(trimmedLine))
		{
			translatedLine = PrintHandler.PrintSwitch(trimmedLine);
		}

		return translatedLine;
	}
}

internal class PrintHandler
{
	public static string PrintSwitch(string line) 
	{
		string translatedLine = string.Empty;

		if (new Regex("[\"].+[\"]").IsMatch(line))
		{
			translatedLine = TranslatePrintString(line);
		}
		else if (new Regex("[-\\d][0-9]+").IsMatch(line))
		{
			translatedLine = TranslatePrintNumber(line);
		}

		return translatedLine + "\n";
	}

	private static string TranslatePrintNumber(string line)
	{
		MatchCollection matches = new Regex("[-\\d][0-9]+").Matches(line);
		return matches.Count == 0 ? "" : matches[0].Value;
	}

	public static string TranslatePrintString(string line)
	{
		MatchCollection matches = new Regex("[\"].+[\"]").Matches(line);
		return matches.Count == 0 ? "" : matches[0].Value.Substring(1, matches[0].Value.Length - 2);
	}
}
