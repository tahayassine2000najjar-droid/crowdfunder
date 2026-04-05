const projectService = require('../services/projectService.js')
exports.createProject = async (req,res)=>{
   try{
     const project = projectService.creatProject(req.user.id ,req.body)
     res.status(201).json(project)
   }catch(error){
      res.status(400).json({err:err.message})
}
};
exports.listProjects = async (req,res)=>{
    
        const projects = await projectService.listProjects(req.user.id)
        res.status(201).json(projects)
    
}

exports.updateProject = async (req,res)=>{
    try{
        const project = await projectService.updateProject(req.user.id , req.params.projectId, req.body)
        res.status(201).json(project)
    }catch(error){
        res.status(400).json({err:err.message})
    }
};
exports.deleteProject = async (req,res)=>{
    try{
        await projectService.deleteProject(req.user.id , req.params.projectId)
        res.status(201).send()
    }catch(error){
        res.status(400).json({err:err.message})
    }
};

exports.getProjectInvestors = async (req,res)=>{
    const investors = projectService.getProjectInvestors(req.user.id,req.params.projectId)
    res.status(201).json(investors)
}