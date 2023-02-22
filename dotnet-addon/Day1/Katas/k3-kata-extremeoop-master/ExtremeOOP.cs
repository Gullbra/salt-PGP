//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
using System.Text.RegularExpressions;
//using System.Threading.Tasks;
//using static System.Net.Mime.MediaTypeNames;

namespace SaltAddon.Day1.ExtremeOOP;

public class BasicTranslator
{
	public List<string> inputLines;
	public Translator translator;

	public BasicTranslator (string input)
	{
		inputLines = input.Split('\n').ToList();
		translator = new Translator(inputLines);
	}
	public List<string> InputLines() => inputLines;
	public List<string> OutputLines() => translator.outputLines;
	public List<KeyValuePair<string, string>> Variables() => translator.variableList;
}

public class Translator
{
	public List<string> outputLines;
	public List<KeyValuePair<string,string>> variableList;
	public Translator(List<string> inputLines)
	{
		variableList = new List<KeyValuePair<string,string>>();
		outputLines = inputLines.Select(LineHandler).ToList();
	}

	public string LineHandler(string line)
	{
		string trimmedLine = line.Trim();
		string translatedLine = string.Empty;

		if (new Regex("^PRINT($|\\s)").IsMatch(trimmedLine))
			translatedLine = PrintHandler.PrintSwitch(trimmedLine, variableList);
		else if (new Regex("=").IsMatch(trimmedLine))
			VariableIstantiater(trimmedLine);
		else if (new Regex("^variable ").IsMatch(trimmedLine))
			VariableIstantiater(trimmedLine);
		return translatedLine;
	}

	private void VariableIstantiater(string line)
	{
		if (new Regex("=").IsMatch(line))
		{
			string[] splitArr = line.Split('=');
			if (splitArr.Length != 2) throw new Exception("Variable declaration error");

			string varName = splitArr[0].Trim();
			if (varName.Length != 1) throw new Exception("Varible should only be letter");

			string varValue = splitArr[1].Trim();

			int varIndex = variableList.FindIndex(kwp => kwp.Key == varName);

			if (varIndex != -1)
				variableList[varIndex] = new KeyValuePair<string, string>(varName, varValue);
			else
				variableList.Add(new KeyValuePair<string, string>(varName, varValue));
		}
		else
		{
			string[] splitArr = line.Split("variable ");
			string varValue = splitArr[1].Trim();

			int varIndex = variableList.FindIndex(kwp => kwp.Key == "A");
			if (varIndex != -1)
				variableList[varIndex] = new KeyValuePair<string, string>("A", varValue);
			else
				variableList.Add(new KeyValuePair<string, string>("A", varValue));
		}
	}
}

internal class PrintHandler
{
	public static string PrintSwitch(string line, List<KeyValuePair<string, string>> variableList)
	{
		string translatedLine = string.Empty;

		if (new Regex("[\"].+[\"]").IsMatch(line))
			translatedLine = TranslatePrintString(line);
		else if (new Regex("[\\s](-|[+])[\\s]").IsMatch(line))
			translatedLine = Calculator.Calc(line[5..], variableList);
		else if (new Regex("[-\\d][0-9]+").IsMatch(line))
			translatedLine = TranslatePrintNumber(line);
		else if (new Regex("\\s[a-zA-Z]$").IsMatch(line))
			translatedLine = TranslatePrintVariable(line, variableList);
		return translatedLine + "\n";
	}

	private static string TranslatePrintVariable(string line, List<KeyValuePair<string, string>> variableList)
	{
		MatchCollection matches = new Regex("\\s[a-zA-Z]$").Matches(line);
		return matches.Count == 0
			? ""
			: variableList.Find(kwp => kwp.Key == matches[0].Value.Trim()).Value;
	}

	private static string TranslatePrintNumber(string line)
	{
		MatchCollection matches = new Regex("[-\\d][0-9]+").Matches(line);
		return matches.Count == 0 ? "" : matches[0].Value;
	}

	public static string TranslatePrintString(string line)
	{
		MatchCollection matches = new Regex("[\"].+[\"]").Matches(line);
		return matches.Count == 0 ? "" : matches[0].Value[1..^1];
	}
}

internal class Calculator
{
	internal static string Calc(string line, List<KeyValuePair<string, string>> variableList)
	{
		MatchCollection matches = new Regex("(^|\\s)([(].+[)]|[a-zA-Z]|-[a-zA-Z]|-\\d+|\\d+|[+]|-)").Matches(line);

		string operatorString = string.Empty;
		int currentValue = 0;

		foreach (Match match in matches)
		{
			string matchedString = match.Value.Trim();

			if (new Regex("^[(].+[)]$").IsMatch(matchedString))
				matchedString = Calc(matchedString[1..^1], variableList);

			if (new Regex("(^|^[-])[a-zA-Z]$").IsMatch(matchedString))
			{
				Match varToSearch = new Regex("[a-zA-Z]").Match(matchedString);
				matchedString = matchedString
					.Replace(
						varToSearch.Value, 
						variableList
							.Find(kvp => kvp.Key == varToSearch.Value)
							.Value
					);
			}

			if (new Regex("(^|^[-])\\d+$").IsMatch(matchedString))
			{
				if (operatorString == "+")
				{
					currentValue += Convert.ToInt32(matchedString);
					operatorString = string.Empty;
					continue;
				}
				else if (operatorString == "-")
				{
					currentValue -= Convert.ToInt32(matchedString);
					operatorString = string.Empty;
					continue;
				}
				currentValue = Convert.ToInt32(matchedString);
			}
			else if (new Regex("^(-|[+])$").IsMatch(matchedString))
			{
				operatorString = matchedString;
			}
		}
		return $"{currentValue}";
	}
}