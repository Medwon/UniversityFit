
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from "../models/User.js"


export const register = async (req,res) => {
    try{
        
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
    });

    const user = await doc.save()

    const token = jwt.sign({
        _id: user._id,
    }, 'Topsecret',
    {
        expiresIn: '30d',
    })
    const {passwordHash, ...userData} = user._doc

    res.json({
        ...userData,
        token
    })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"User exists "
        })
    }
}

export const login = async(req, res) =>{
    try{
        const user = await UserModel.findOne({email: req.body.email})

        if(!user){
            return res.status(404).json({
                message: "User is not found "
            })
        }

        const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValid){
            return res.status(404).json({
                message: "Login or Email is not valid "
            })
        }
        const token = jwt.sign({
            _id: user._id,
        }, 'Topsecret',
        {
            expiresIn: '30d',
        })

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"не удалось zalogin"
        })
    }
}

export const getMe = async(req,res) =>{
    try{
        const user = await UserModel.findById(req.userId)

        if(!user){
            return res.status(404).json({
                message: "user is not found",
            })
        }
        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    }
    catch(err){
        return res.status(500).json({
            message: "нет доступа",
        })
    }
}

export const getProfile = async (req, res) => {
    try {
      const userId = req.userId; 
      const user = await UserModel.findById(userId).select('fullName email favorites');
      
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      res.status(500).json({ message: 'Ошибка сервера при получении профиля' });
    }
  };

export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.userId;
        const avatarUrl = `/uploads/${req.file.originalname}`;

        // Обновляем поле avatarUrl у пользователя
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { avatarUrl },
            { new: true }
        ).select('avatarUrl');

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ avatarUrl });
    } catch (error) {
        console.error('Ошибка при загрузке аватара:', error);
        res.status(500).json({ message: 'Ошибка при загрузке аватара' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { gpa, ielts, sat } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { gpa, ielts, sat },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        res.status(500).json({ message: "Не удалось обновить профиль" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { sortBy, gpaMin, gpaMax, ieltsMin, ieltsMax, satMin, satMax } = req.query;

        let filterCriteria = {};
        
        if (gpaMin || gpaMax) {
            filterCriteria.gpa = {};
            if (gpaMin) filterCriteria.gpa.$gte = parseFloat(gpaMin);
            if (gpaMax) filterCriteria.gpa.$lte = parseFloat(gpaMax);
        }

        if (ieltsMin || ieltsMax) {
            filterCriteria.ielts = {};
            if (ieltsMin) filterCriteria.ielts.$gte = parseFloat(ieltsMin);
            if (ieltsMax) filterCriteria.ielts.$lte = parseFloat(ieltsMax);
        }

        if (satMin || satMax) {
            filterCriteria.sat = {};
            if (satMin) filterCriteria.sat.$gte = parseFloat(satMin);
            if (satMax) filterCriteria.sat.$lte = parseFloat(satMax);
        }

        let sortCriteria = {};
        if (sortBy) sortCriteria[sortBy] = -1;

        // Поиск пользователей с учетом фильтрации и сортировки
        const users = await UserModel.find(filterCriteria, 'fullName gpa ielts sat avatarUrl email').sort(sortCriteria);

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Не удалось получить список пользователей' });
    }
};

export const getAverageScores = async (req, res) => {
    try {
      const users = await UserModel.find();
      const totalUsers = users.length;
  
      if (totalUsers === 0) {
        return res.status(200).json({ gpa: 0, ielts: 0, sat: 0 });
      }
    const usersWithGpa = users.filter(user => user.gpa > 0);
    const totalGpa = usersWithGpa.reduce((acc, user) => acc + user.gpa, 0);
    const averageGpa = usersWithGpa.length ? totalGpa / usersWithGpa.length : 0;

    const usersWithIelts = users.filter(user => user.ielts > 0);
    const totalIelts = usersWithIelts.reduce((acc, user) => acc + user.ielts, 0);
    const averageIelts = usersWithIelts.length ? totalIelts / usersWithIelts.length : 0;

    const usersWithSat = users.filter(user => user.sat > 0);
    const totalSat = usersWithSat.reduce((acc, user) => acc + user.sat, 0);
    const averageSat = usersWithSat.length ? totalSat / usersWithSat.length : 0;
      res.status(200).json({
        gpa: parseFloat(averageGpa.toFixed(2)),
        ielts: parseFloat(averageIelts.toFixed(2)),
        sat: Math.round(averageSat),
      });
    } catch (error) {
      console.error("Ошибка получения средних значений:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  };

export const getCurrencyBalance = async (req, res) => {
  try {
    const userId = req.userId; 
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ currencyBalance: user.currencyBalance });
  } catch (error) {
    console.error("Ошибка получения баланса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateCurrencyBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    user.currencyBalance += amount;
    await user.save();

    res.status(200).json({ currencyBalance: user.currencyBalance });
  } catch (error) {
    console.error("Ошибка обновления баланса:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


export const updateBalanceforNotes = async (req, res) => {
    try {
      const userId = req.userId;
      const { gpa, ielts, sat } = req.body;
  
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const hadNoScores = !user.gpa && !user.ielts && !user.sat;

      user.gpa = gpa || user.gpa;
      user.ielts = ielts || user.ielts;
      user.sat = sat || user.sat;
 
      if (hadNoScores && (gpa || ielts || sat) && !user.hasReceivedScoreBonus) {
        user.currencyBalance += 10;
        user.hasReceivedScoreBonus = true; 
      }
  
      await user.save();
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId).select('-passwordHash'); // Исключаем хэш пароля

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка получения данных пользователя' });
    }
};
  