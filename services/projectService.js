const Project = require("../models/project")
const Investment = require('../models/Investment') 

exports.createProjet = async (userId , data) =>{
    const projet = await Project.create({data , owner:userId , status :'open'})
    if (data.initialInvestment){
        await Investment.create({
            projet:project_Id,
            investor:userId,
            amount:data.initialInvestment
        });
        project.currentCapital = data.initialInvestment;
        await project.save()
    }
    return project;
}

exports.listProjects = async (userId) =>{
    return project.find({owner:userId});
} 

exports.updateProject = async (userId , projectId , updates) =>{
    const project = await Project.findOne({_id :projectId , owner :userId , status : 'open'})
    if(!prject) throw new Error('project not found or close')
    Object.assign(project , updates)
    project.save()
}

exports.deleteProject = async (userId , projectId) =>{
    const project = await Project.find({_id : projectId , owner : userId})
    if(!project) throw new Error('Project not found!')
        await project.remove();
}


exports.getInvestors = async (userId , projectId)=>{
    return investment.find({project: projectId}).populate('investor','name email')
}
