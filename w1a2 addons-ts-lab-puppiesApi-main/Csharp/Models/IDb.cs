using System;

namespace Csharp.Models;

interface IDb
{
	List<Puppy> GetDb();

	Puppy AddEntry(Puppy pupToAdd);

	Puppy GetEntryById(int Id);

	Puppy EditEntryById(int Id, Puppy updatedInfo);

	Puppy DeleteEntryById(int Id);
}
