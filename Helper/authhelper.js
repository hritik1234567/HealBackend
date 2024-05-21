const bcrypt=require('bcrypt');
const hashpassword=async(password)=>{
    try {
        const saltRounds=10;
        const hashedpassword=await bcrypt.hash(password,saltRounds);
        return hashedpassword;
    } catch (error) {
        console.log(error)
    }
}
const comparepassword=async(password,hashedpassword)=>{
    return bcrypt.compare(password,hashedpassword);
}
module.exports = {hashpassword,comparepassword};