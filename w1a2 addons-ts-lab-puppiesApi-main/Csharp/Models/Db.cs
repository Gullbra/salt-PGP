using System;
using System.Linq;

namespace Csharp.Models;


public class Db : IDb
{
	private List<Puppy> _db;

	public Db()
	{
		_db = new List<Puppy>()
		{
			new Puppy() { Id = 1, Name = "Dogmeat", Breed = "German Sheepherd", BirthDate="2016-10-22"}
		};
	}

	public List<Puppy> GetDb()
	{
		return _db;
	}

	public Puppy AddEntry(Puppy puppyToAdd)
	{
		puppyToAdd.Id = _db.Last().Id + 1;
		_db.Add(puppyToAdd);

		return puppyToAdd;
	}

	public Puppy GetEntryById(int id)
	{
		Puppy? puppyById = _db.Find(pup => pup.Id == id);
		if (puppyById == null) throw new Exception($"Puppy with id {id} not found");
		return puppyById;
	}

	public Puppy EditEntryById(int id, Puppy updatedInfo)
	{
		int dbIndex = _db.FindIndex(pup => pup.Id == id);
		// change from Puppy updated info to args array or something
	}
}
