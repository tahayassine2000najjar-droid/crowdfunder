const investmentService = require('../services/investmentService.js')
exports.invest = async (res,req)=>{
    try{
        const investment = await investmentService.invest(req.user.id , req.body);
        res.status(201).json(investment)
    }catch(error){
       res.status(400).json({err:err.message});
    }
}
exports.listInvestments = async (res,req)=>{
   const investments = investmentService.listInvestments(req.user.id);
   res.json(investments)
}