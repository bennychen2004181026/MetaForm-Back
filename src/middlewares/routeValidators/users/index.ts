import emailValidator from '@middleware/routeValidators/users/emailValidator'
import checkUserExistence from '@middleware/routeValidators/users/checkUserExistence'
import userInfosValidator from '@middleware/routeValidators/users/userInfosValidator'

export default {
    checkUserExistence,
    emailValidator,
    userInfosValidator
}