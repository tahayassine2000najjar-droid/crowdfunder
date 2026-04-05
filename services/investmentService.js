const Project = require('../models/project')
const Investment = require('../models/Investment')
const User = require('../models/User')

exports.invest = async (userId , {projectId , amount})=>{
    const project = await Project.findById(projectId)
    
    if(!project || project.status !=='open') throw new Error("project closed or doesn't existe")
    const remaining = project.capital - (project.currentCapital || 0);

if (amount > remaining) throw new Error('amount superior than remaining capital')
    const maxPercent = project.maxInvestmentPercent || 50;
    const currentInvestment = await Investment.findOne({project :projectId , investor: userId});
    const newTotal = (currentInvestment ? currentInvestment.amount : 0) + amount;

    if(newTotal > (project.capital*maxPercent/100)) throw new Error ('investment passed the authorized limit')
    const user = user.findById(userId)

    if(user.balance<amount)  throw new Error('solde of insuffisant')
    user.balance -= amount
 await user.save();
 const investment = await Investment.create({project : projectId , investor :userId , amount})
 project.currentCapital = (project.currentCapital || 0) +amount;

 if(project.currentCapital >=project.capital)  project.capital ='closed' 
 await project.save();
 return (investment)
}
exports.listInvestments = async (userId)=>{
    return Investment.find({investor : userId}).populate('project')
}
