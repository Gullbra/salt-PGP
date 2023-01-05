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
			new Puppy() { Id = 1, Name = "Dogmeat", Breed = "German Sheepherd", BirthDate="2016-10-22"},
			new Puppy() { Id = 2, Name = "Tova", Breed = "Poodle", BirthDate="2018-03-01"},
			new Puppy() { Id = 3, Name = "Muyumi", Breed = "Akita", BirthDate="2017-04-12"},
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
		if (dbIndex == -1) throw new Exception($"Puppy with id {id} not found");

		if (updatedInfo.Name != null) _db[dbIndex].Name = updatedInfo.Name;
		if (updatedInfo.Breed != null) _db[dbIndex].Breed = updatedInfo.Breed;
		if (updatedInfo.BirthDate != null) _db[dbIndex].BirthDate = updatedInfo.BirthDate;

		return _db[dbIndex];
	}

	public Puppy DeleteEntryById(int id)
	{
		int dbIndex = _db.FindIndex(pup => pup.Id == id);
		if (dbIndex == -1) throw new Exception($"Puppy with id {id} not found");

		Puppy puppyToRemove = _db[dbIndex];
		_db.RemoveAt(dbIndex);

		return puppyToRemove;
	}
}
