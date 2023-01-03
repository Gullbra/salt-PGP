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
		_db = new Db();
	}

	[HttpGet]
	public List<Puppy> GetAll()
	{
		return PuppyDb.GetList();
	}
}
