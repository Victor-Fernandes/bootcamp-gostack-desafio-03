/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import User from '../models/User';
import charConfig from '../../config/charconfig';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      lastname: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }
    // verificando se email já existe
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(401).json({ erro: 'User alredy exist' });
    }

    const { name, lastname, email, password, confirmPassword } = req.body;

    /**
     * Assegurando que o name e lastname não tenham espaço
     * e tb não tenham caracteres especiais.
     * Remover o spaço dentro do password.
     */
    if (!charConfig.regChar.test(name) || !charConfig.regChar.test(lastname)) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (charConfig.regSpace.test(name) || charConfig.regSpac.test(name)) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (
      charConfig.regSpace.test(lastname) ||
      charConfig.regSpac.test(lastname)
    ) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (
      charConfig.regSpace.test(password) ||
      charConfig.regSpac.test(password)
    ) {
      return res.status(401).json({ error: 'No spaces in password' });
    }

    // confirmação de password
    if (password !== confirmPassword) {
      return res.status(401).json({ error: 'Password does not macht' });
    }

    // cadastrando usuario
    await User.create(req.body);

    return res.json({
      name,
      lastname,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      lastname: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validations falls' });
    }
    const { email, name, lastname, oldPassword, password } = req.body;

    // pegando user no bd pelo id
    const user = await User.findByPk(req.userId);

    /**
     * Verifica se o usuario logado vai mudar o email
     * e se o novo email já existe
     */
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(401).json({ erro: 'User alredy exist' });
      }
    }

    /**
     * Verifica se o usuario logado vai mudar a senha
     * e se a senha antiga está correta.
     */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ erro: 'Password does not match' });
    }

    /**
     * Assegurando que o name,lastname não tenha espaço
     * e tb não tenham caracteres especiais.
     * Remover o spaço dentro do password.
     */
    if (!charConfig.regChar.test(name) || !charConfig.regChar.test(lastname)) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (charConfig.regSpace.test(name) || charConfig.regSpac.test(name)) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (
      charConfig.regSpace.test(lastname) ||
      charConfig.regSpac.test(lastname)
    ) {
      return res.status(401).json({ error: 'Invalid characters' });
    }
    if (
      charConfig.regSpace.test(password) ||
      charConfig.regSpac.test(password)
    ) {
      return res.status(401).json({ error: 'No spaces in password' });
    }

    // realizando update
    await user.update(req.body);

    return res.json({
      name,
      lastname,
      email,
    });
  }
}

export default new UserController();
