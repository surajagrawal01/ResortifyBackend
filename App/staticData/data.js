const cancellationPolicies=[
    {id:1,field:"free cancellation upto 48 hrs",checked:false},
    {id:2,field:"Non-Refundable within 48hrs",checked:false},
    {id:3,field:"Non-Refundable",checked:false}
]
const propertyRules =[
    {id:1,field:"Below 18 yrs allowed",checked:false},
    {id:2,field:"UnMarried couples allowed",checked:false},
    {id:3,field:"Pets allowed",checked:false},
    {id:4,field:"Can Bring food-items,drinks",checked:false},
    {id:5,field:"alcohol allowed",checked:false},
    {id:6 , field:"swimming pool accessibility between 10 to 23 depending on respective timings",checked:false}
]
const IdentityProofs=[
    {id:1,field:"Aadhar Card",checked:false},
    {id:2,field:"Passport",checked:false},
    {id:3,field:"PAN card",checked:false},
    {id:4,field:"Voter Id card",checked:false}
]

module.exports = {cancellationPolicies,propertyRules,IdentityProofs}
