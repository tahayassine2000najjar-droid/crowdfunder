const adminService = require('../services/adminService');
exports.listInvestors = async (req,res)=>{
    const investors = await adminService.listInvestors();
    res.json(investors);
}
exports.listProjectowners = async (req,res)=>{
    const owners = await adminService.listProjectOwners();
    res.json(owners)
}
exports.getInvestorPortfolio = async (req,res) =>{
    const portfolio = await adminService.getInvestorsPortfolio(req.params.investorId)
    res.json(portfolio)
}

exports.getProjectOwnerPortfolio = async (req,res)=>{
    const portfolio = await adminService.getProjectOwnerPortfolio(req.params.ownerId)
    res.json(portfolio)
}