import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import OpenAI from "openai";


const app = express();
const PORT = 5000;

const API_KEY = 'be2afff8e7cb481e975045c6b33e1450';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) {
      throw new Error('Ошибка при получении новостей');
    }
    const data = await response.json();
    res.json(data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});



