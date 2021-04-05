'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const Event = use('Event')

class UserController {
    async index() {
        const user = User.all()
        return user
    }

    async show({ params }) {
        const user = await User.findOrFail(params.id)

        return user
    }

    async destroy({ params, auth, response }) {
        const user = await User.findOrFail(params.id)
        if(await user.delete()) {
            response.send({
                message: 'Dados excluidos com sucesso'
            });
        } else {
            response.send({
                message: 'Erro ao excluir dados'
            });
        }
    }

    async store({ request, response }) {
        const rules = {
            username: 'required|max:80|unique:users,username',
            email: 'required|email|unique:users,email',
            password: 'required',
        }

        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
          return validation.messages()
        }

        const eventParams = request.only(['username', 'email', 'password'])
        return await User.create({ ...eventParams })
    }


    async update({ params,request, response }) {
        const user = await User.find(params.id)
        const eventParams = request.only(['username', 'email', 'password'])
        user.merge({ ...eventParams })
        await user.save()
        return user;
    }
}

module.exports = UserController
