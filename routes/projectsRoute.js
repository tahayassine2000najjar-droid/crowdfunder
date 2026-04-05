const express = require('express')
const router = express.Router()
const projects = require('../data/projects')
const users = require('../data/users')
const investments = require('../data/investments')
const {auth , checkRole} = require('../middlewares/authMiddleware')
const projectSchema  = require('../models/project')
const { estimatedDocumentCount } = require('../models/User')


router.get('/',(req,res)=>{
    res.json(projects.filter(p=>p.status === 'open'))    
})

router.get('/:id',(req,res)=>{
  const project = projects.find(p=>p.id === parseInt(req.params.id))
  if (!project) return res.status(404).json({message :'project not found'}) 
    const currentInvestmentPercentage = ((project.currentAmount/project.capital)*100).toFixed(2)
     res.json({...project,currentInvestmentPercentage :`${currentInvestmentPercentage}%`})
});

router.post('/',auth , checkRole(['owner']),(req,res)=>{
    const {error} = projectSchema.validate(req.body)
    if (error) return res.status(400).json({message : error.details[0].message})
   const {title , description , capital , maxInvestmentPercentage , initialInvestment} = req.body   
if (initialInvestment > capital) return res.status(400).json({message :'initial investment cannot exceed capital'})  

const id = Date.now()
const newProject = {
    id,
    title,
    description,
    capital,currentAmount: initialInvestment || 0,
    status : (initialInvestment >= capital) ? 'closed' : 'open',
    maxInvestmentPercentage : maxInvestmentPercentage || 0,
    ownerId : req.user.id 
}
projects.push(newProject)

if (initialInvestment >0){
    investments.push({
    id: Date.now() + 1,
    userId: req.user.id,
    projectId:newProject.id,
    amount: initialInvestment,
    type:'initial',
    date:new Date()
})}
res.json(newProject)
}) 
router.put('/:id',auth , checkRole(['owner']),(req,res)=>{
    const project = projects.find(p=>p.id === parseInt(req.params.id))
   if(!project) return res.status(401).json({message :'project not found'})
    if(project.ownerId !==req.user.id) return res.status(401).json({message :'not autorized'})

        project.status = 'closed'
        res.json({message : 'project closed manually',project})
})

router.get('/:id/investors',auth, (req,res)=>{
    const project = projects.find(p=>p.id == parseInt(req.params.id))
    if(!project) return res.status(400).json({message :'project not found'})
        if(req.user.role !=='admin' && project.ownerId !== req.user.id){
            return res.status(403).json({message :'not authorized'})
        }
  const projectInvestments = investments.filter(inv=>inv.projectId === project.id)
  const summary = {};
   projectInvestments.forEach(inv=> {
    if(!summary[inv.userId]){
        const user = users.find(u=>u.id === inv.userId);
        summary[inv.userId]= {
            investorName : user ? user.name : 'unknown',
            totalInvested : 0
        }
    }
    summary[inv.userId].totalInvested += inv.amount;
   });
 const result = Object.values(summary).map(s=> ({
   investorName :s.investorName,
   amountInvested : s.totalInvested,
   percentageOfCapital :((s.totalInvested/project.capital)*100).toFixed(2)+'%'
 }))
res.json(result)
})

router.get('/my/all',auth , checkRole(['owner']),(req,res)=>{
    const myProjects = projects.filter(p=>p.ownerId === req.user.id)
    res.json(myProjects)
})
module.exports = router
   


