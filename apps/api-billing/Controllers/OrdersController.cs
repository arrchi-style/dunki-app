using ApiBilling.Models;
using Microsoft.AspNetCore.Mvc;
namespace ApiBilling.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateOrder([FromBody] OrderDto order)
    {
        // Тут буде твоя логіка збереження замовлення
        // Поки що просто повертаємо успіх для тесту фронтенду
        return Ok(order);
    }
}