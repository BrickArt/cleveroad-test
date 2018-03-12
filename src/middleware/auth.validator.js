function AuthValidator(req, res, next) {
    var flag = false;
    var errors = [];

    if (!req.email) {
        flag = true;
        errors.push(getErrorMessage('email', 'Email was been required...'))
    }
    if (!req.password) {
        flag = true;
        errors.push(getErrorMessage('password', 'Password was been required...'))
    }
    if (req.password.length <= 4) {
        flag = true;
        errors.push(getErrorMessage('password', 'password must be longer than 4 characters'))
    }

    if (flag) req.errors = errors;
    next();
}

function getErrorMessage(title, message) {
    return {field: title, message: message}
}

module.exports = AuthValidator;