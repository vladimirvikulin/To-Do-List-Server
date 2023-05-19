import GroupModel from '../models/Group.js'

export const getAll = async (req, res) => {
    try {
      const groupId = req.params.groupId;
  
      const group = await GroupModel.findOne({
        _id: groupId,
        user: req.userId
      });
  
      if (!group) {
        return res.status(404).json({
          message: "Група не знайдена"
        });
      }
  
      res.json(group.tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Не вдалося отримати задання"
      });
    }
  };

export const create = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const task = req.body;
        const group = await GroupModel.findOne({
        _id: groupId,
        user: req.userId
        });
        if (!group) {
            return res.status(404).json({
                message: "Група не знайдена"
            });
        }
        group.tasks.push(task);
        group.save();
        res.json(group.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не вдалося створити завдання",
        });
    }
};

export const remove = async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const taskId = req.params.taskId;
      const group = await GroupModel.findOne({
        _id: groupId,
        user: req.userId
      });
  
      if (!group) {
        return res.status(404).json({
          message: "Група не знайдена"
        });
      }
      const taskIndex = group.tasks.findIndex((task) => task._id.toString() === taskId);
  
      if (taskIndex === -1) {
        return res.status(404).json({
          message: "Завдання не знайдено"
        });
      }
      group.tasks.splice(taskIndex, 1);
      await group.save();
      res.json(group.tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Не вдалося видалити завдання"
      });
    }
  };

export const update = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const taskId = req.params.taskId;
        const group = await GroupModel.findOne({
          _id: groupId,
          user: req.userId
        });
        if (!group) {
          return res.status(404).json({
            message: "Група не знайдена"
          });
        }
        const taskIndex = group.tasks.findIndex((task) => task._id.toString() === taskId);
        if (taskIndex === -1) {
          return res.status(404).json({
            message: "Завдання не знайдено"
          });
        }
        group.tasks[taskIndex] = { ...req.body, _id: taskId };
        await group.save();
        res.json(group.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Не вдалося обновити завдання",
        });
    }
};