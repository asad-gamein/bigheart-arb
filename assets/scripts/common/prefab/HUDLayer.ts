
import { _decorator, Component, Node, Sprite, Label, math } from 'cc';
import { gameManager, GAME_TYPE, SCENE_TYPE, IN_GAME_CURR_OP} from '../managers/gameManager';
const { ccclass, property } = _decorator;

export enum TIMER_STATE{
    PAUSED  = 0,
    RUNNING = 1,
    OVER    = 2
}

@ccclass('HUDLayer')
export class HUDLayer extends Component {


    _delagateScript: Component | undefined;

    minutes = 0;
    seconds = 0;
    tempMin = 0;
    secondsLeft = 0;
    initHeartsCount = 0;
    cheapestItemPrice = 0;
    timerState : TIMER_STATE = 0;
    halfTime : number =0;

    @property(Label)
    timerCountDown = new Label;

    @property(Label)
    heartsCount = new Label;

    start () {
        gameManager.getInstance().getSceneType();
        this.initTime();
        this.updateTimerCountDown();
        this.getCheapestItem();
    }
     
    getCheapestItem(){
        let donateableItemsInfo = gameManager.getInstance().getGameItems(gameManager.getInstance().getGameType());
        
        let prices:any = donateableItemsInfo.map(i=> i.price);

        
        this.cheapestItemPrice = Math.min(... prices);
        //console.log("Prices "+prices+ "Cheapest "+this.cheapestItemPrice);
    }

    setDelegate(delegate: Component){
        this._delagateScript = delegate;
    }

    //Timer Methods
    timer(){  
        
        // if(this.secondsLeft == this.halfTime){
        //     this.pauseTimer();
        //     this._delagateScript.startQuiz();
        // }


        if(this.secondsLeft>=0){
            this.updateTimerCountDown();
            this.secondsLeft--;
        } 
        else{
            this.timeOver();
        }
    }

    updateTimerCountDown(){
        this.seconds = this.secondsLeft%60;
        this.minutes = Math.floor(this.secondsLeft/60);
        
        let min = this.minutes < 10 ? "0" + this.minutes : this.minutes;
        let sec = this.seconds < 10 ? "0" + this.seconds : this.seconds;
        this.timerCountDown.string = min +':'+ sec;
    }

    initTime(){

        let gameTimeHeart =  gameManager.getInstance().getGameTimeHeart(gameManager.getInstance().getGameType());
        this.secondsLeft = gameTimeHeart.seconds;
        this.halfTime =  this.secondsLeft - 10//this.secondsLeft/2;
        //console.log("half time", this.halfTime);
        // this.initHeartsCount = gameManager.getInstance().getuserHeartCount();
        this.initHeartsCount = gameTimeHeart.hearts;
        this.updateHearts(IN_GAME_CURR_OP.RESET, this.initHeartsCount);
    }

    startTimer(){
        this.initTime();
        this.updateTimerCountDown();
        this.timerState = TIMER_STATE.RUNNING;
        this.schedule(this.timer, 1);
        this._delagateScript!.timeRunning();
    }

    pauseTimer(){
        this.timerState = TIMER_STATE.PAUSED;
        this.unschedule(this.timer);
    }

    skipTimer(){
        this.secondsLeft = 1;
        this.updateTimerCountDown();
    }

    resumeTimer(){
        this.timerState = TIMER_STATE.RUNNING;
        this.schedule(this.timer, 1);
    }

    timeOver(){
        // gameManager.getInstance().setuserHeartCount(parseInt(this.heartsCount.string));
        this.timerState = TIMER_STATE.OVER;
        this.unschedule(this.timer);
        this._delagateScript!.timeOver();
    }

    onPauseButtonPressed(){

        switch(this.timerState){
            case TIMER_STATE.OVER : 
            // this.startTimer();
            // this._delagateScript!.timeRunning();
            break;
            case TIMER_STATE.PAUSED : this.resumeTimer();
            this._delagateScript!.timeRunning();
            break;
            case TIMER_STATE.RUNNING : this.pauseTimer();
            this._delagateScript!.timePaused();
            break;
            default : this.timeOver();
            break;
        }
    
    }

    getHeartsConsumed(){
        let heartsComsumed = this.initHeartsCount - parseInt(this.heartsCount.string);
        return heartsComsumed;
    }

    updateHearts(operationType : IN_GAME_CURR_OP, amount: number=0){

        let currentAmount:number = parseInt(this.heartsCount.string);
        let error:string = "";
        
        switch(operationType){
            case IN_GAME_CURR_OP.INCRESE :{
                currentAmount += amount;
            }
            break;
            case IN_GAME_CURR_OP.DECREASE :{
                if(currentAmount < amount){
                    error = "Not enought hearts to buy particular Item.";
                }else{
                    currentAmount -= amount;
                }
            }
            break;
            case IN_GAME_CURR_OP.RESET :{
                currentAmount = this.initHeartsCount;
            }
            break;
        }
        if(currentAmount >= 0){
            this.heartsCount.string = String(currentAmount);
        }
        return {
            gameover  : currentAmount == 0 || this.cheapestItemPrice > currentAmount?true:false,
            error : error
        }
    }


}

