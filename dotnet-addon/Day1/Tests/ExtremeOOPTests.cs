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
	public void ShouldSequnceLines(string input, int expected)
	{
		IOhandler TestTranslator = new (input);
		TestTranslator.inputLines.Count.Should().Be(expected);
	}

	[DataTestMethod]
	[DataRow("", "")]
	[DataRow("PRINT", "\n")]
	[DataRow("PRINT \"Hello, World!\"", "Hello, World!\n")]
	[DataRow("PRINT \"Hi\"\nPRINT \"There\"\nPRINT \"!\"", "Hi\nThere\n!\n")]
	public void SimpelPrintStringTests(string input, string output)
	{
		IOhandler TestTranslator = new(input);
		string.Join("", TestTranslator.outputLines).Should().Be(output);
	}

	[DataTestMethod]
	[DataRow("PRINT 123", "123\n")]
	[DataRow("PRINT -3", "-3\n")]
	public void SimpelPrintNumberTests(string input, string output)
	{
		IOhandler TestTranslator = new(input);
		string.Join("", TestTranslator.outputLines).Should().Be(output);
	}
}