import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());
app.use(express.json());

const orders = [];

app.post('/api/orders', (req, res) => {
  const order = req.body;
  
  // Додаємо метадані
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date()
  };

  orders.push(newOrder);
  console.log('New Order Received:', newOrder);
  
  res.status(201).send(newOrder);
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
