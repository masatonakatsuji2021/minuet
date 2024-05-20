import * as http from "http";

const MServerListen = ()=>{
    
    const h = http.createServer((req, res) => {

        console.log(req.url);
        res.write("Hallow OK");
        res.end();
    
    });
    h.listen(8021);
};
export default MServerListen;

