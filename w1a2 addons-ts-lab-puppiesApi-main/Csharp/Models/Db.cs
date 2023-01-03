using System;

namespace Csharp.Models;


public class Db
{
	private List<Puppy> _db;

	public Db()
	{
		_db = new List<Puppy>()
		{
			new Puppy() { Id = 1, Name = "Dogmeat", Breed = "German Sheepherd", BirthDate="2016-10-22"}
		};
	}

	public List<Puppy> GetList()
	{
		return _db;
	}
}
