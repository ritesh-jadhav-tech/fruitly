import jwt from "jsonwebtoken"
function generateToken(userId){
    let token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'1D'
    })
    return token.toString();
}

function verifyToken(token){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

export { generateToken, verifyToken };