'use strict'
const User = use('App/Models/User')
const {validate} = use('Validator')

class AuthController {
    async register({request, auth, response}) {
        const register = request.only([
            'name',
            'username',
            'email',
            'password'
        ])

        const user = new User()
        user.name = register.name
        user.username = register.username
        user.email = register.email
        user.password = register.password

        await user.save()

        const accessToken = await auth.withRefreshToken().generate(user)
        return response.json({
            'user': user,
            'access_token': accessToken
        })
    }

    async login({request, auth, response}) {
        const rules = {
            email:'email'
        }
        const login = request.only([
            'email',
            'password'
        ])
        const email = login.email
        const password = login.password

        const validation = await validate(email, rules)
        if (validation.fails()) {
            const user = await User.findBy('username',email)
            const accessToken = await auth.authenticator('jwtUsername').withRefreshToken().attempt(email,password)
            return response.json({
                'user': user,
                'access_token': accessToken
            })
        } else {
            const user = await User.findBy('email',email)
            const accessToken = await auth.authenticator('jwtEmail').withRefreshToken().attempt(email,password)
            return response.json({
                'user': user,
                'access_token': accessToken
            })
        }
    }
}

module.exports = AuthController
