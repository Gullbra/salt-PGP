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

	//[DataTestMethod]
	//[DataRow("", "")]
	//[DataRow("PRINT", "\n")]
	//[DataRow("PRINT \"Hello, World!\"", "Hello, World!\n")]
	//public void SimpelIOTests (string input, string output)
	//{
	//	IOhandler.Translate(input).Should().Be(output);
	//}
}