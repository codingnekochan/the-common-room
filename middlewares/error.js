const globalErrorHandler = (err,req,res,next)=>{
    console.error(err)
    res.status(500).render('500')
}

module.exports = globalErrorHandler