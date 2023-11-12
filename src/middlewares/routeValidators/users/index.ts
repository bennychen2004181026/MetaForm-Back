import emailValidator from '@middleware/routeValidators/users/user.emailValidator'
import checkUserExistence from '@middleware/routeValidators/users/user.checkUserExistence'
import userInfosValidator from '@middleware/routeValidators/users/user.userInfosValidator'

export default {
    checkUserExistence,
    emailValidator,
    userInfosValidator
}