import emailValidator from '@middleware/routeValidators/users/user.emailValidator'
import checkUserExistence from '@middleware/routeValidators/users/user.checkUserExistence'
import userInfosValidator from '@middleware/routeValidators/users/user.userInfosValidator'
import completeAccountValidator from '@middleware/routeValidators/users/user.completeAccountValidator'

export default {
    checkUserExistence,
    emailValidator,
    userInfosValidator,
    completeAccountValidator
}