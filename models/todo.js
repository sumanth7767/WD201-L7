/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");

      console.log(
        (await Todo.overdue())
          .map((x) => {
            x.displayableString();
          })
          .join("\n")
      );

      console.log("\n");

      console.log("Due Today");

      console.log(
        (await Todo.dueToday())
          .map((x) => {
            x.displayableString();
          })
          .join("\n")
      );

      console.log("\n");

      console.log("Due Later");

      console.log(
        (await Todo.dueLater())
          .map((x) => {
            x.displayableString();
          })
          .join("\n")
      );
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async completedTodo() {
      return await Todo.findAll({
        where: {
          completed: true,
        },
      });
    }

    static getTodos() {
      return this.findAll();
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    setCompletionStatus(completed) {
      return this.update({ completed: completed });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate == new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate
      }`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
