import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    try{   
        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        return hash;
    }catch(err){
        console.log("Error in hashing password ", err);
    }
    return null;
}

const compareHash = async (planeText , hashText) =>{
    try{
        const res = await bcrypt.compare(planeText,hashText);
        return res;
    }catch(err){
        console.log(err)
    }
}


export { hashPassword ,compareHash }

