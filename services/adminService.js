const User = require('../models/User')
const Investment = require('../models/Investment')
const project = require('../models/project')


exports.listInvestors = () => User.find({role : 'investor'})
exports.listProjectOwners = () => User.find({role : 'owner'})

exports.getInvestorPortfolio  = async (investorId) =>{
    const investments = await Investment.find({investor : investorId}).populate('project')
    const total = investments.reduce((sum, inv)=>sum+ inv.amount , 0)
    return {investments , total}
}
 exports.getProjectOwnerPortfolio = async (ownerId) =>{
    const projects = await project.find({owner :ownerId})
    const totalRaised =  projects.reduce((sum, p)=>sum+ (p.currentCapital || 0) , 0)
    return {projects , totalRaised}
 }