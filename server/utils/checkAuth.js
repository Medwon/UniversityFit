import jwt from 'jsonwebtoken'

export default (req,res,next) =>{
    const token =( req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token){
        try{
            const decoded = jwt.verify(token , 'Topsecret')
            req.userId = decoded._id
            next()
        }
        catch(e){
            return res.status(400).json({
                message: "нет доступа"
            })
        }
    }
    else{
        return res.status(405).json({
            message: "нет доступа"
        })
    }
}