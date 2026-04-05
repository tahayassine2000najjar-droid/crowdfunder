const express = require('express')
const router = express.Router()
const projects = require('../data/projects')
const investments = require('../data/investments')
const users =require('../data/users')

const {auth , checkRole} = require('../middlewares/authMiddleware')
const {investmentSchema} = require('../models/Investment')

router.post('/:projectId', auth, checkRole(['investor']), (req, res) => {
    const {error} = investmentSchema.validate(req.body)
    if (error) return res.status(401).json({message : error.details[0].message})
    const {amount} = req.body;
    const project = projects.find(p => p.id === parseInt(req.params.projectId))
    const user = users.find(u => u.id === req.user.id)
    if(!project) return res.status(400).json({message :'project not found'})
    if(project.status !== 'open') return res.status(400).json({message :'project closed for investment'})
    if(user.balance < amount) return res.status(400).json({message:'insuffisant balance'})
    const remainingCapital = project.capital - project.currentAmount;
    if (amount > remainingCapital) return res.status(400).json({ message: `Investment exceeds remaining capital (${remainingCapital})` });

    
    const userCurrentTotal = investments
        .filter(inv => inv.projectId === project.id && inv.userId === req.user.id)
        .reduce((sum, inv) => sum + inv.amount, 0);

    const maxAllowedPercent = Math.min(50, project.maxInvestmentPercentage || 100);
    const maxAllowedAmount = project.capital * (maxAllowedPercent / 100);

    if ((userCurrentTotal + amount) > maxAllowedAmount) {
        return res.status(400).json({ 
            message: `Investment denied. Your total investment would exceed the limit of ${maxAllowedPercent}% of the project capital.` 
        });
    }

    
    user.balance -= amount;
    project.currentAmount += amount;
    
    const newInvestment = {
        id: Date.now(),
        userId: req.user.id,
        projectId: project.id,
        amount,
        date: new Date()
    };
    investments.push(newInvestment);

    if (project.currentAmount >= project.capital) {
        project.status = 'closed';
    }

    res.json({ message: 'Investment successful', project, investment: newInvestment });
});

router.get('/my/all', auth, checkRole(['investor']), (req, res) => {
    const myInvestments = investments.filter(inv => inv.userId === req.user.id);
    
    const summary = {};
    myInvestments.forEach(inv => {
        if (!summary[inv.projectId]) {
            const project = projects.find(p => p.id === inv.projectId);
            if (project) {
                summary[inv.projectId] = {
                    projectId: project.id,
                    projectTitle: project.title,
                    totalInvested: 0,
                    capital: project.capital
                };
            }
        }
        if (summary[inv.projectId]) {
            summary[inv.projectId].totalInvested += inv.amount;
        }
    });

    const result = Object.values(summary).map(s => ({
        projectId: s.projectId,
        projectTitle: s.projectTitle,
        amountInvested: s.totalInvested,
        percentageOfCapital: ((s.totalInvested / s.capital) * 100).toFixed(2) + '%'
    }));

    res.json(result);
});

module.exports = router;


