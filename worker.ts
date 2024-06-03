export default class Listener {

    private post = "";

    public onData(buffer, req, res, threadNo){
        this.post += buffer;
    }

    public onEnd(req, res, threadNo){

        if(this.post){
            console.log(this.post.toString());
        }

        res.setHeader("name", "minuet-server.19.0.0");
        res.write("OK.....ThreadNo=" + threadNo);
        res.end();
    }


}