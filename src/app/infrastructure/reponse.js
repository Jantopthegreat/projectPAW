const responsAPI = (reqstatus,data,message,res) =>{
    res.status(reqstatus).json({
        response: reqstatus,
        data: data,
        message: message
    });
}

module.exports = responsAPI;