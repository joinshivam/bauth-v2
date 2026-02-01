const input = "+91 7065494501"
const usernameRegex = /^(\+)+([0-9]{2,3})+(?:\s+[0-9]{10})*$/;

const OTP = () => {
    const randDigit = Math.floor(Math.random() * 9999)
    const complex = Math.round(Math.random())
    return { string: complex ? `${randDigit}`.padStart(4, 0) : `${randDigit}`.padEnd(4, 0) };
}
console.log(OTP().string)