/* eslint-disable class-methods-use-this */
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';

import User from '../models/User';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const where = {};

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'lastname', 'email'],
        },
      ],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const file = await File.findByPk(req.body.file_id);
    // Verificando se o file_id existe
    if (!file) {
      return res.status(401).json({ error: 'File not found' });
    }
    // Verificando se a data de criação de meetup é valida
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id: req.userId, // armazena ID do user que organiza
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      file_id: Yup.number(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const user_id = req.userId;
    // const fileId = await File.findByPk(req.body.file_id);
    const meetup = await Meetup.findByPk(req.params.id);

    // Verificar se o usuario está autorizado a alterar dados do meetup
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Verificando se o file_id existe
    if (!(await File.findByPk(req.body.file_id))) {
      return res.status(401).json({ error: 'File not found' });
    }

    // Verificando se a data do meetup é invalida
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Meetup invalid' });
    }

    // Verifcando se o meetup já passou
    if (meetup.past) {
      return res.status(401).json({ error: "Can't update past meetups" });
    }

    await meetup.update(req.body);
    return res.json(meetup);
  }

  async delete(req, res) {
    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);

    // Verificando se o id do meetup está correto
    if (!meetup) {
      return res.json({ error: 'Meetup not found' });
    }

    // Verificar se o usuario está autorizado a alterar dados do meetup
    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Verifcando se o meetup já passou
    if (meetup.past) {
      return res.status(401).json({ error: "Can't delete past meetups" });
    }

    await meetup.destroy();

    return res.send();
  }
}
export default new MeetupController();
