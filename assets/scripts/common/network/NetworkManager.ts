import {DEPLOYMENT_MODE, BASE_ADDRESS, SERVER} from "./NetworkConfig"
export class NetworkManager {
    private static _instance : NetworkManager;
    private baseUrl : string = "";

    static getInstance() : NetworkManager{
        if(!NetworkManager._instance){
            NetworkManager._instance = new NetworkManager();
        }
        return NetworkManager._instance;       
    }
  

    init(deplaymentMode: DEPLOYMENT_MODE = SERVER){
        switch(deplaymentMode){
            case DEPLOYMENT_MODE.LOCAL:
                this.baseUrl =  BASE_ADDRESS.LOCAL;
                break;  
            case  DEPLOYMENT_MODE.DEVELOPMENT:
                this.baseUrl =  BASE_ADDRESS.DEVELOPMENT;
                break;
            case DEPLOYMENT_MODE.PRODUCTION:
                this.baseUrl =  BASE_ADDRESS.PRODUCTION;
                break;
            case DEPLOYMENT_MODE.STAGING:
                this.baseUrl =  BASE_ADDRESS.STAGING;
                break;
        }


    }

    sendRequest(api: string,  reuqestType : string, param : any, successCb : Function, errorCb :Function,requireToken: boolean = false){
        let xhr = new XMLHttpRequest();
        let fullurl = this.baseUrl + api;
       
        let readyStateChanged  = () =>{
            if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                let response : string = xhr.responseText;
                successCb(response);
            }else if(xhr.readyState === 4 && (xhr.status >= 400 && xhr.status < 500)){
                let respone: string = xhr.responseText;
                errorCb(respone);
            }
        }
        xhr.open(reuqestType, fullurl);
        xhr.setRequestHeader("Content-Type", "application/json");

        //console.log("token", localStorage.getItem("jwtToken"));
        if(requireToken)
            xhr.setRequestHeader('Authorization', sessionStorage.getItem("jwtToken"));
        
        xhr.onreadystatechange = readyStateChanged;
        //console.log("param", param);
        xhr.send(JSON.stringify(param));
    }
}

