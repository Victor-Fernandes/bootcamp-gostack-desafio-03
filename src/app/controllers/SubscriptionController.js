/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    const subscription = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscription);
  }

  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.idMeetup, {
      include: [User],
    });

    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: "Can't subscribe in your own meetups" });
    }

    if (meetup.past) {
      return res.status(401).json({ error: "Can't subscribe in past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(401)
        .json({ error: "Can't subscribe in two meetups at same time " });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    return res.json(subscription);
  }
}
export default new SubscriptionController();
