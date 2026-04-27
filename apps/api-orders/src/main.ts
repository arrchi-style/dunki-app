import express from 'express';
import cors from 'cors';
import axios from 'axios';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());
app.use(express.json());

const orders = [];

app.post('/api/orders', async (req, res) => {
  const order = req.body;

  try {
    // Викликаємо наш новий C# сервіс
    const billingResponse = await axios.post('http://127.0.0.1:5041/api/OrderValidation', {
      items: order.items,
      totalFromClient: order.total
    });

    const { isValid, tax, actualTotal } = billingResponse.data;

    if (!isValid) {
      console.error(`Security alert! User tried to pay ${order.total} instead of ${actualTotal}`);
      return res.status(400).json({ error: 'Invalid order total' });
    }

    // Якщо .NET дав добро — зберігаємо
    const finalizedOrder = {
      ...order,
      tax,
      id: `ORD-${Date.now()}`,
      status: 'confirmed'
    };

    orders.push(finalizedOrder);
    res.status(201).json(finalizedOrder);

  } catch (error) {
    console.error('Billing service is unavailable');
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
