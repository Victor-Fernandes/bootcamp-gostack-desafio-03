/* eslint-disable class-methods-use-this */
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const user_id = await User.findByPk(req.UserId);

    return res.json();
  }
}

export default new SubscriptionController();
