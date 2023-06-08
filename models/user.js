const mongoose= require('mongoose')
const schema= mongoose.Schema
const ObjectId = schema.Types.ObjectId

const userModel = new schema({
id: ObjectId ,
created_at: {type:Date,default:Date.now()},
username:{type:String, required:true, unique:true},
urls:{
    type:ObjectId, ref:'shortUrl'
}

})


module.exports= mongoose.model('users',userModel)