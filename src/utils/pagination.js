import * as dbServices from "../DB/db.service.js"

export const paginate=async({page,size,model,populate=[],filter={},select=""}={})=>{
    //  let{page,size}=req.query
 page=parseInt(page<1?process.env.PAGE:page)
 size=parseInt(size<1?process.env.SIZE:size)
const count=await model.find(filter).countDocuments()
 const skip=(page-1)*size
  const data = await dbServices.find({
    model:model,
    filter,
    populate,
    select,
    skip,
    limit: size
  });
return {data,page,size,count}
}