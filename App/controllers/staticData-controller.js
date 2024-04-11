dataController ={}
const {cancellationPolicies,propertyRules,IdentityProofs}= require('../staticData/data')
dataController.list=(req,res)=>{
    res.json({cancellationPolicies,propertyRules,IdentityProofs})

}
module.exports = dataController

