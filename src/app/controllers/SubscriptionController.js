/* eslint-disable class-methods-use-this */
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.idMeetup, {
      include: [User],
    });

    // Verificação para usuario na se inscresver nos propios meetups.
    if (meetup.user_id === user) {
      return res
        .status(401)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe in past meetups" });
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

    // Verificando se o usuario já está cadastrado em outro meetup no mesmo horario
    if (checkDate) {
      return res.status(401).json({
        error: "Can't subscribe to two meetups at the same time",
      });
    }

    const subscribe = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    return res.json(subscribe);
  }
}
export default new SubscriptionController();
