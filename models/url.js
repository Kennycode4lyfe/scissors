const mongoose = require('mongoose')
const {nanoid} = require('nanoid')
const shortDefault = nanoid(6)
const schema = mongoose.Schema
const ObjectId = schema.Types.ObjectId

const shortUrlSchema = new mongoose.Schema({
user:{
type: ObjectId, ref:'users'
},
full:{
type:String,
required:true
},
short:{
    type:String
},
clicks:{
    type:Number,
    required:true,
    default:0
},
qrLink:{
    type:String
}
})


shortUrlSchema.pre('save', async function(){
const regex = /[^\s]/g
console.log(this.short.search(regex))
const url = this
if(this.short.search(regex)){
    this.short = shortDefault
}
})

module.exports = mongoose.model('shortUrl', shortUrlSchema)