using System;
using Microsoft.AspNetCore.Mvc;
using Csharp.Models;

namespace Csharp.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class PuppiesController : ControllerBase
{
	private Db PuppyDb;

	public PuppiesController()
	{
		PuppyDb = new Db();
	}

	[HttpGet]
	public List<Puppy> GetAll()
	{
		return PuppyDb.GetDb();
	}

	[HttpPost]
	public Puppy? PostOne(Puppy puppyToAdd)
	{
		return PuppyDb.AddEntry(puppyToAdd);
	}

	[HttpGet("{id}")]
	public Puppy? GetOne(int id)
	{
		return PuppyDb.GetEntryById(id);
	}

	[HttpPut("{id}")]
	public Puppy? EditOne(int id, Puppy puppyToAdd)
	{
		return PuppyDb.EditEntryById(id, puppyToAdd);

		// data not stores => Improving our API
	}
}
