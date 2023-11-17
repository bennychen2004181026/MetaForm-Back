import forgotPasswordValidator from '@middleware/routeValidators/users/forgotPasswordValidator'
import loginValidator from '@middleware/routeValidators/users/loginValidator'
import emailValidator from '@middleware/routeValidators/users/emailValidator'
import checkUserExistence from '@middleware/routeValidators/users/checkUserExistence'
import userInfosValidator from '@middleware/routeValidators/users/userInfosValidator'
import completeAccountValidator from '@middleware/routeValidators/users/completeAccountValidator'

export default {
    checkUserExistence,
    emailValidator,
    userInfosValidator,
    completeAccountValidator,
    loginValidator,
    forgotPasswordValidator
}