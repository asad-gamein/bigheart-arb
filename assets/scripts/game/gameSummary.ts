
import { _decorator, Component, Node, Prefab, Label, UITransform, Size, instantiate, tween, director, Vec3, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
import { gameManager, GAME_TYPE} from '../common/managers/gameManager';
import { ResourceUtils } from '../common/managers/ResourceUtils';
import { SoundManager } from '../common/managers/SoundManager';
import {getVoiceOvers} from '../common/strings';
@ccclass('GameSummary')
export class GameSummary extends Component {
    
    accomplishment : any;
    gameSummary:Array<string> = new Array;
    @property(Node)
    summary = new Node;
    @property(Prefab)
    accomplishmentPrefab = new Prefab;
    @property(Label)
    heading = new Label;
    start () {
        this.gameSummary=(gameManager.getInstance().getGameSummary());
        this.gameSummary.unshift(getVoiceOvers(gameManager.getInstance().getGameType()).game_summary.replace("xxx", String(gameManager.getInstance().getLastScore()))+"  من خلال التبرع بـ");        
        this.addGameSummary();
        this.upateHeading();
        
        let clip:any = null!;
        
        switch(gameManager.getInstance().getGameType()){
            case GAME_TYPE.RELIEF : {
                clip = ResourceUtils.getInstance().getGameResources("Relief", "music");
            }break;
            case GAME_TYPE.EDUCATION : {
                clip = ResourceUtils.getInstance().getGameResources("Education", "music");
            }break;
            case GAME_TYPE.HEALTHCARE : {
                clip = ResourceUtils.getInstance().getGameResources("Healthcare", "music");
            }break;
            case GAME_TYPE.LIVLIHOOD : {
                clip = ResourceUtils.getInstance().getGameResources("LiveliHood", "music");
            }break;
        }
        
        if(clip){
            this.node.getComponent(AudioSource)!.clip = clip;
            SoundManager.getInstance().playMusic(true);
        }
    }
    addGameSummary(){
        this.accomplishment = instantiate(this.accomplishmentPrefab);
        let height = this.accomplishment.getComponent(UITransform)?.contentSize.height! * (this.gameSummary.length +1);
        let width = this.accomplishment.getComponent(UITransform)?.contentSize.width;
        this.summary.getComponent(UITransform)?.setContentSize(new Size(width,height*1.2)); 
        
        this.gameSummary.forEach((element,index) =>{
            this.accomplishment = instantiate(this.accomplishmentPrefab);
            this.accomplishment.getChildByName("Text").getComponent(Label).string = element;//+".";
            this.accomplishment.position.y = this.accomplishment.getComponent(UITransform)?.contentSize.height!*1.2* index*-1;
            this.summary.addChild(this.accomplishment);
        });
    }
    upateHeading(){
        this.heading.string = "Your Accomplishments";
    }
    showAccomplishments(){
        director.loadScene("accomplishment");
    }
    onContinue(){
        this.showAccomplishments();
    }

   
    
}
