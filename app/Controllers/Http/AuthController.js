'use strict'
const User = use('App/Models/User')

class AuthController {
    async register({request, auth, response}) {
        const name = request.input("name")
        const username = request.input("username")
        const email = request.input('email')
        const password = request.input("password")

        let user = new User()
        user.name = name
        user.username = username
        user.email = email
        user.password = password

        user = await user.save()

        

        let accessToken = await auth.generate(user)
        return response.json({"user": user, "access_token": accessToken})
    }

    async login({request, auth, response}) {
        const username = request.input("username")
        const password = request.input("password")
        
        try {
            if (await auth.attemp(username, password)) {
                let user = await User.findBy('username', username)
                let accessToken = await auth.generate(user)
                return response.json({"user": user, "access_token": accessToken})
            }
        } catch (error) {
            return response.json({message: 'You first need to register!'})
            
        }
    }
}

module.exports = AuthController
