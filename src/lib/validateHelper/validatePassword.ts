function validatePassword(password: string): boolean {
    const hasNumberOrSpecial = /[\d\W]/;
    return password.length >= 6 &&
           password.length <= 16 &&
           hasNumberOrSpecial.test(password);
}
export default validatePassword;