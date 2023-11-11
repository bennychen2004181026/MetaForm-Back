import emailValidator from '@middleware/routeValidators/users/user.emailValidator'
import checkUserExistence from '@middleware/routeValidators/users/user.checkUserExistence'

export default {
    checkUserExistence,
    emailValidator
}