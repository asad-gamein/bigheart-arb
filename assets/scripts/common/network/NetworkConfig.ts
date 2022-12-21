import { Enum } from "cc"


export const API_END_POINTS = {
    LOG_IN : "v1/user/login",
    FORGET_PASSWORD : "v1/user/forgot-password",
    RESET_PASSWORD : "v1/user/reset-password",
    REGISTER : "v1/user/register",
    USER_PROFILE : "v1/user/get-profile",
    UPDATE_PROFILE: "v1/user/update-profile"

}

export const enum DEPLOYMENT_MODE  {
    LOCAL = 0,
    DEVELOPMENT,
    STAGING,
    PRODUCTION,
}

export const SERVER  = DEPLOYMENT_MODE.STAGING;


export const REQUEST_TYPE = {
    GET : "get",
    POST: "post",
    PUT : "put"
}

export const BASE_ADDRESS= {
    LOCAL: "http://localhost:3000/",
    DEVELOPMENT : "http://localhost:3000/",
    STAGING :  "https://big-heart-foundation.herokuapp.com/",
    PRODUCTION :"http://b37a4c250714.ngrok.io/",
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
