using System;
using System.Linq;
using FluentAssertions;
using Microsoft.VisualStudio.TestPlatform.Utilities;
using SaltAddon.Day1.ExtremeOOP;

namespace SaltAddon.Day1.Tests;

[TestClass]
public class ExtremeOOPTests
{

	[DataTestMethod]
	[DataRow("", 1)]
	[DataRow("\n", 2)]
	[DataRow("PRINT \"Hello\"\nPRINT \"World\"", 2)]
	public void ShouldSequnceInputLines(string input, int expected)
	{
		BasicTranslator TestTranslator = new(input);
		TestTranslator.InputLines().Count.Should().Be(expected);
	}

	[DataTestMethod]
	[DataRow("", "")]
	[DataRow("PRINT", "\n")]
	[DataRow("PRINT \"Hello, World!\"", "Hello, World!\n")]
	[DataRow("PRINT \"Hi\"\nPRINT \"There\"\nPRINT \"!\"", "Hi\nThere\n!\n")]
	[DataRow("PRINT 123", "123\n")]
	[DataRow("PRINT -3", "-3\n")]
	public void SimpelPrintTests(string input, string output)
	{
		BasicTranslator TestTranslator = new(input);
		string.Join("", TestTranslator.OutputLines()).Should().Be(output);
	}

	[DataTestMethod]
	[DataRow("variable 0", "A", "0")]
	[DataRow("B=1", "B", "1")]
	[DataRow("B =1", "B", "1")]
	[DataRow("variable 0\nB=1", "B", "1")]
	public void VariableTests(string input, string varName, string varValue)
	{
		BasicTranslator TestTranslator = new(input);
		TestTranslator.Variables()
			.Find(kwp => kwp.Key == varName).Value
			.Should().Be(varValue);
	}

	[DataTestMethod]
	[DataRow("A=12\nPRINT A", "12\n")]

	public void PrintVariableTests(string input, string output)
	{
		BasicTranslator TestTranslator = new(input);
		string.Join("", TestTranslator.OutputLines()).Should().Be(output);
	}

	[DataTestMethod]
	[DataRow("PRINT 1 + 2 - 3", "0\n")]
	[DataRow("PRINT 4 + -3", "1\n")]
	[DataRow("PRINT 4 - (2 + 2)", "0\n")]
	[DataRow("A=12\nPRINT A + 1", "13\n")]

	public void PrintCalculationsTests(string input, string output)
	{
		BasicTranslator TestTranslator = new(input);
		string.Join("", TestTranslator.OutputLines()).Should().Be(output);
	}
}