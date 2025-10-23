import UserModel from '../models/User.js';

export const addFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const university = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    const alreadyFavorited = user.favorites.some(
      (fav) => fav.name === university.name && fav.country === university.country
    );
    if (alreadyFavorited) {
      console.log("LOL")
      return res.status(400).json({ message: 'Университет уже добавлен в избранное' });
    }

    user.favorites.push(university);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось добавить в избранные' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user.favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не удалось получить избранные' });
  }
};


export const removeFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const universityId = req.params.id; 

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.favorites = user.favorites.filter(fav => fav._id.toString() !== universityId);
    
    await user.save(); // Сохраняем изменения в базе данных
    res.status(200).json({ message: 'Университет удален из избранного' });
  } catch (error) {
    console.error('Ошибка при удалении из избранного:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении из избранного' });
  }
};
