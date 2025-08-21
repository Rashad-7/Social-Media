import mongoose, { Schema,Types,model } from "mongoose"
import CryptoJS from "crypto-js"
import bcrypt from "bcryptjs"
export const genderTypes={male:"male",female:"female"}
export const providerTypes={google:"google",system:"system"}

export const roleTypes={user:"user",admin:"admin",superAdmin:"superAdmin"}
const userSchema= new Schema({
//userName:{type:String,required:true, minlength:2,maxlength:50,trim:true},
firstName:{type:String,required:true, minlength:2,maxlength:50,trim:true},
lastName:{type:String,required:true, minlength:2,maxlength:50,trim:true},

email:{type:String,required:true,unique:true},
confirmEmailOTP:String,
password:{type:String,required:(data)=>{
  return data?.provider===providerTypes.google?false:true
}},
restPasswordOTP:String,
phone:String,
address:String,
  loginAttempts: { type: Number, default: 0 },
  banUntil: { type: Date, default: null },
DOB:Date,
image:{secure_url:String,public_id:String},
cover:[{secure_url:String,public_id:String}],
gender:{
type:String,
enum:Object.values(genderTypes),
default: genderTypes.male
},
role:{
    type:String,
    enum:Object.values(roleTypes),
    default: roleTypes.user
    },
    confirmEmail:{type:Boolean,default:false},
    isDeleted: {
      type: Date
    }
    ,
    chanageCridentialsTime:Date,
    confirmEmailOTPExpires: { type: Date },
    provider:{type:String,enum:Object.values(providerTypes),default:providerTypes.system}, 
viewers: [
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    times: [{ type: Date,default: Date.now() }]
  }
]
,tempEmail:String,
friends:[{ type: mongoose.Types.ObjectId, ref: "User" }]
,
tempEmailOTP:String,
updatedBy:{type:Types.ObjectId,ref:"User"}

},{timestamps:true,toObject:{versionKey:true},toJSON:{versionKey:true}}) 

userSchema.virtual('userName').set(function(value){
this.firstName = value.split(' ')[0];
this.lastName = value.split(' ')[1] || '';

}).get(function(){
  return this.firstName+""+this.lastName
})
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password,10);
    }
    next();
  });
   
  userSchema.pre('save', function (next) {
    if (this.isModified('phone')) {
      this.phone = CryptoJS.AES.encrypt(this.phone,process.env.KEY_ENC).toString();
    }
    next();
  });
  userSchema.pre('findOneAndUpdate', async function (next) { 
    const update = this.getUpdate();
  
    if (update?.password) {
      const hashedPassword = await bcrypt.hash(update.password, Number(process.env.SALT));
      this.setUpdate({ ...update, password: hashedPassword });
    }
    if (update?.$set?.password) {
      const hashed = await bcrypt.hash(update.$set.password, Number(process.env.SALT));
      update.$set.password = hashed;
    }
    next();
  });

  userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.phone) {
      update.phone = CryptoJS.AES.encrypt(update.phone, process.env.KEY_ENC).toString();
  }
  next()})
export const userModel= mongoose.models.User || model('User',userSchema)
export const socketConnection= new Map()
