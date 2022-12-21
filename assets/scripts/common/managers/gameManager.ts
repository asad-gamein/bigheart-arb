
import { color, director } from 'cc';
export enum SCENE_TYPE {
    NONE = 0,
    HOME = 1,
    GAME = 2
}

export enum GAME_TYPE {
    NONE        = 0,
    EDUCATION   = 1,
    LIVLIHOOD   = 2,
    RELIEF      = 3,
    HEALTHCARE  = 4,
    HOME       = 5,
}

export enum IN_GAME_CURR_OP{
    INCRESE  = 1,
    DECREASE = 2,
    RESET    = 3
}

export class gameManager{

    sceneType: SCENE_TYPE = 0;
    gameType: GAME_TYPE = 0;
    gameSummary:Array<string> = new Array;
    isHomeVoPlayed : boolean = false;
    isPopUpShown : boolean = false;
    userHeartCount : number = 0;
    gameAutoAdvance : number = 0;
    lastScore:number =0;

    gamesPlayed:Array<GAME_TYPE> = new Array; 

    // currentLodedSceneIndex = 0;
    // // "relief", " healthcare" 
    // scenes = ["education", "livelihood"];

    gameManager(){
        this.sceneType = SCENE_TYPE.NONE;
        this.gameType = GAME_TYPE.NONE;
    }

    private static _instance : gameManager;

    static getInstance(): gameManager{
        if(!gameManager._instance){
            gameManager._instance = new gameManager();
        }
        return gameManager._instance;
    }

    setLastScore(s:number){
        this.lastScore = s;
    }

    getLastScore(){
        return this.lastScore;
    }

    setGameSummary(pGameSummary:Array<string>){
        this.gameSummary = pGameSummary
    }

    getGameSummary(){
        return this.gameSummary;
    }

    getGameType () : GAME_TYPE{
        return this.gameType;
    }
    setGameType (pGameType : GAME_TYPE){
        this.gameType = pGameType;
    }

    getSceneType () : SCENE_TYPE{
        return this.sceneType;
    }
    setSceneType (pSceneType : SCENE_TYPE){
        this.sceneType = pSceneType;
    }

    allGamesPlayed(){
        return this.gamesPlayed.length == 4 ?true:false;
    }

    addToGamesPlayed(game : GAME_TYPE){
        if(this.gamesPlayed.indexOf(game) == -1)
        {
            this.gamesPlayed.push(game);
        }
    }

    reviewDone(){
        this.gamesPlayed = [];
    }


    getGameTimeHeart(pGameType : GAME_TYPE){

        let sec = 0;
        let initHearts = 0;
        switch(pGameType){
            case GAME_TYPE.EDUCATION :
                sec = 60;
                initHearts = 1000;
                break;
            case GAME_TYPE.LIVLIHOOD :
                sec = 60;
                initHearts = 1000;
                break;
            case GAME_TYPE.RELIEF :
                sec = 60;
                initHearts = 1000;
                break;
            case GAME_TYPE.HEALTHCARE : 
                sec = 90;
                initHearts = 1000;
                break;
            default : 
                sec = 60;
                initHearts = 1000;
                break;
        }
        return {
            seconds : sec,
            hearts : initHearts
        }
    }

    getGameItems(pGameType : GAME_TYPE){

        switch(pGameType){
            case GAME_TYPE.EDUCATION : 
                return [
                    {
                        name: "شراء الكتب والقرطاسية",
                        price: 10,
                        type : EDU_ITEM_TYPE.BOOK
                    },
                    {
                        name: "توفير أجهزة الحاسوب",
                        price: 20,
                        type : EDU_ITEM_TYPE.COMPUTER
                    },
                    {
                        name: "توفير أثاث مدرسي",
                        price: 20,
                        type : EDU_ITEM_TYPE.FURNITURE
                    },
                    {
                        name: "بناء مدرسة",
                        price: 300,
                        type : EDU_ITEM_TYPE.SCHOOL
                    }
                ]
            case GAME_TYPE.LIVLIHOOD : 
                return [
                    {
                        name: "طعام",
                        price: 30,
                        type : LIVLI_ITEM_TYPE.FOOD,
                        color :  color(251,0,7,255)
                    },
                    {
                        name: "ماء",
                        price: 30,
                        type : LIVLI_ITEM_TYPE.WATER,
                        color :  color(50,151,191,255)
                        
                    },
                    {
                        name: "ملابس",
                        price: 30,
                        type : LIVLI_ITEM_TYPE.CLOTHES,
                        color :  color(28,152,14,255)
                    }
                ]
            case GAME_TYPE.RELIEF : 
                return [
                    {
                        name: "abc",
                        price: 0
                    },
                    {
                        name: "abc",
                        price: 0
                    },
                    {
                        name: "abc",
                        price: 0
                    },
                    {
                        name: "abc",
                        price: 0
                    }
                ]
            case GAME_TYPE.HEALTHCARE : 
                return [
                    {
                        name: "ستار",
                        price: 10,
                        type : HEALTH_ITEM_TYPE.CURTAINS,
                        max : 3
                    },
                    {
                        name: "شاشة",
                        price: 60,
                        type : HEALTH_ITEM_TYPE.MONITOR,
                        max : 3
                    },
                    {
                        name: "كرسي",
                        price: 10,
                        type : HEALTH_ITEM_TYPE.CHAIR,
                        max : 2
                    },
                    {
                        name: "ساعة",
                        price: 10,
                        type : HEALTH_ITEM_TYPE.CLOCK,
                        max : 2
                    },
                    {
                        name: "نبتة",
                        price: 50,
                        type : HEALTH_ITEM_TYPE.PLANT,
                        max : 2
                    },
                    {
                        name: "سرير",
                        price: 200,
                        type : HEALTH_ITEM_TYPE.BED,
                        max : 3
                    },
                    {
                        name: "جهاز أشعة",
                        price: 150,
                        type : HEALTH_ITEM_TYPE.XRAY,
                        max : 1
                    },
                    {
                        name: "أكسجين",
                        price: 50,
                        type : HEALTH_ITEM_TYPE.OXYGEN,
                        max : 3
                    },
                    {
                        name: "أدوية",
                        price: 20,
                        type : HEALTH_ITEM_TYPE.MEDICINE,
                        max : 3
                    }
                ]
            default : 
                return []
        }
    }


    isVoiceOverPlayer(screenType: SCENE_TYPE){
        switch(screenType){
            case SCENE_TYPE.HOME:
                return this.isHomeVoPlayed;
                break;

            case SCENE_TYPE.GAME:
                break;    
        }
    }

    setVoiceOverPlayed(screenType: SCENE_TYPE, status:boolean){
        switch(screenType){
            case SCENE_TYPE.HOME:
                this.isHomeVoPlayed = status;
                // console.log("don't play voice over again");
                break;

            case SCENE_TYPE.GAME:
                break;    
        }

    }


    incrementUserHearts(increamentCount: number){
        this.userHeartCount += increamentCount;

    }

    setuserHeartCount(leftOverHearts: number){
        this.userHeartCount = leftOverHearts;
    }

    getuserHeartCount(){
        return this.userHeartCount;
    }


    doNeedWelcomePopUp(){
        return  this.isPopUpShown ;
    }

    doNeedtoShowWelcomePopUp(state:boolean){
        this.isPopUpShown = state
    }
}


export enum EDU_CONTAINER_TYPE{
    NONE = 0,
    MORROCO = 1,
    ALGERIA = 2,
    LIBYA = 3,
    EGYPT = 4,
    SYRIA = 5,
    IRAQ = 6,
    SAUDIARABIA = 7,
    UAE = 8,
    OMAN = 9,
    YEMEN = 10,
    PALESTINE = 11,
    PAKISTAN = 12,
    INDIA = 13
}
export enum EDU_ITEM_TYPE{
    NONE = 0,
    BOOK = 1,
    COMPUTER = 2,
    FURNITURE = 3,
    SCHOOL = 4
}

export enum HEALTH_ITEM_TYPE{
    NONE = 0,
    XRAY = 1,
    BED = 2,
    PLANT = 3,
    CLOCK = 4,
    CHAIR = 5,
    MONITOR = 6,
    CURTAINS = 7,
    OXYGEN = 8,
    MEDICINE = 9
}


export enum LIVLI_CONTAINER_TYPE{
    NONE = 0,
    FOOD_TRUCK = 1,
    WATER_TRUCK = 2,
    CLOTHES_TRUCK = 3
}
export enum LIVLI_ITEM_TYPE{
    NONE = 0,
    FOOD = 1,
    WATER = 2,
    CLOTHES = 3
}

export class DonateableItem
{
  public type           : EDU_ITEM_TYPE | LIVLI_ITEM_TYPE |HEALTH_ITEM_TYPE| undefined;
  public donationTo     : EDU_CONTAINER_TYPE | LIVLI_CONTAINER_TYPE | undefined;
  public item           : Node | undefined | any;
  public price          : number | undefined;
  public name           : string | undefined;
}

export class ContainerItem
{
  public type           : EDU_CONTAINER_TYPE | LIVLI_CONTAINER_TYPE | undefined;
  public requiredItem   : EDU_ITEM_TYPE | LIVLI_ITEM_TYPE | HEALTH_ITEM_TYPE|undefined;
  public item           : Node | undefined | any;
  public itemCount      : number|undefined;
  public name            : string|undefined;
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum).map((n: string | number) => +n)
      .filter((n: unknown) => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue;
  }
//   Object.values(anEnum).map(n => +n)