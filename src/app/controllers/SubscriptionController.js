/* eslint-disable class-methods-use-this */

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.UserId);
    const meetup = await Meetup.findByPk(req.params.idMeetup, {
      include: [User],
    });

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
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
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    try {
      const subscription = await Subscription.create({
        user_id: user.id,
        meetup_id: meetup.id,
      });
      return res.json(subscription);
    } catch (error) {
      return error;
    }
  }
}

export default new SubscriptionController();
