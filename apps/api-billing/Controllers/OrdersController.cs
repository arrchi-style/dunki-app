using ApiBilling.Models;
using Microsoft.AspNetCore.Mvc;
namespace ApiBilling.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateOrder([FromBody] OrderDto data)
    {
        if (data == null) return BadRequest("Data is null");

        // Твоя логіка
        return Ok(data);
    }
}