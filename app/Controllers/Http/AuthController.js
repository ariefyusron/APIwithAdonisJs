'use strict'
const User = use('App/Models/User')

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
        const login = request.only([
            'email',
            'password'
        ])
        const email = login.email
        const password = login.password
        
        const user = await User.findBy('email',email)
        const accessToken = await auth.withRefreshToken().attempt(email,password)
        
        return response.json({
            'user': user,
            'access_token': accessToken
        })
    }
}

module.exports = AuthController
