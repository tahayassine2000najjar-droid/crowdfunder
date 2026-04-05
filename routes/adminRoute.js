const express = require('express');
const router = express.Router();
const projects = require('../data/projects.js');
const users = require('../data/users.js');
const investments = require('../data/investments.js');
const { auth, checkRole } = require('../middlewares/authMiddleware.js');

router.use(auth, checkRole(['admin']));

router.get('/investors', (req, res) => {
    res.json(users.filter(u => u.role === 'investor'));
});


router.get('/owners', (req, res) => {
    res.json(users.filter(u => u.role === 'owner'));
});

router.get('/investor/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id) && u.role === 'investor');
    if (!user) return res.status(404).json({ message: 'Investor not found' });

    const userInvestments = investments.filter(inv => inv.userId === user.id);
    const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);

    const portfolio = userInvestments.map(inv => {
        const project = projects.find(p => p.id === inv.projectId);
        return {
            projectTitle: project.title,
            amountInvested: inv.amount,
            percentageOfCapital: ((inv.amount / project.capital) * 100).toFixed(2) + '%'
        };
    });

    res.json({ investor: user.name, totalInvested, portfolio });
});


router.get('/owner/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id) && u.role === 'owner');
    if (!user) return res.status(404).json({ message: 'Owner not found' });

    const ownerProjects = projects.filter(p => p.ownerId === user.id);
    const totalRaised = ownerProjects.reduce((sum, p) => sum + p.currentAmount, 0);

    res.json({ owner: user.name, totalProjects: ownerProjects.length, totalRaised, projects: ownerProjects });
});

module.exports = router


