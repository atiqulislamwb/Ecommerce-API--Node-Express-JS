export const errorHandlerMiddleware = async (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ msg: `Something went wrong try again` });
    
  };
  
  export const notFoundHandlerMiddleware = async (req, res) => {
    return res.status(400).send("Route does not exit");
    
  };