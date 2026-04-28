using Microsoft.AspNetCore.Mvc;

namespace ApiBilling.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderValidationController : ControllerBase
{
    [HttpPost]
    public IActionResult ValidateOrder([FromBody] OrderRequest request)
    {
        // В реальному проекті тут був би запит до БД для перевірки цін страв
        decimal calculatedTotal = 0;
        foreach (var item in request.Items)
        {
            calculatedTotal += item.Price * item.Quantity;
        }

        // Додаємо вартість доставки, якщо сума менша за 500
        decimal deliveryFee = calculatedTotal > 500 ? 0 : 50;
        calculatedTotal += deliveryFee;

        bool isValid = Math.Abs(calculatedTotal - request.TotalFromClient) < 0.01m;

        return Ok(new 
        {
            isValid = isValid,
            actualTotal = calculatedTotal,
            tax = calculatedTotal * 0.2m, // ПДВ 20%
            message = isValid ? "Validation successful" : "Price mismatch!"
        });
    }
}

public class OrderRequest
{
    public List<OrderItem> Items { get; set; } = new();
    public decimal TotalFromClient { get; set; }
}

public class OrderItem
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}