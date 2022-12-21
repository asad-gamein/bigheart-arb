
import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, Label, Size, director, AudioSource, RichTextComponent, RichText } from 'cc';
const { ccclass, property } = _decorator;
import { gameManager, GAME_TYPE, SCENE_TYPE, IN_GAME_CURR_OP} from '../common/managers/gameManager';
import {getAccomplishments} from '../common/strings'
import { ResourceUtils } from './managers/ResourceUtils';
import { SoundManager } from './managers/SoundManager';

@ccclass('Accomplishment')
export class Accomplishment extends Component {
    
    accomplishment : any;

    accomplishments:any;

    @property(Node)
    generalFacts = new Node;

    @property(Node)
    achievements = new Node;

    @property(Prefab)
    accomplishmentPrefab = new Prefab;

    @property(Label)
    headingGeneralFacts = new Label;

    @property(Label)
    headingAchievements = new Label;
    
    start () {
        // gameManager.getInstance().setGameType(GAME_TYPE.RELIEF);
        // gameManager.getInstance().setSceneType(SCENE_TYPE.GAME);
        // gameManager.getInstance().setGameType(GAME_TYPE.LIVLIHOOD);
        this.accomplishments = getAccomplishments(gameManager.getInstance().getGameType());
        // this.addGeneralFacts();
        this.addAchievement();
        this.updateHeadings();
        
        let clip:any = null!;
        
        switch(gameManager.getInstance().getGameType()){
            case GAME_TYPE.RELIEF : {
                gameManager.getInstance().addToGamesPlayed(GAME_TYPE.RELIEF);
                clip = ResourceUtils.getInstance().getGameResources("Relief", "music");
            }break;
            case GAME_TYPE.EDUCATION : {
                gameManager.getInstance().addToGamesPlayed(GAME_TYPE.EDUCATION);
                clip = ResourceUtils.getInstance().getGameResources("Education", "music");
            }break;
            case GAME_TYPE.HEALTHCARE : {
                gameManager.getInstance().addToGamesPlayed(GAME_TYPE.HEALTHCARE);
                clip = ResourceUtils.getInstance().getGameResources("Healthcare", "music");
            }break;
            case GAME_TYPE.LIVLIHOOD : {
                gameManager.getInstance().addToGamesPlayed(GAME_TYPE.LIVLIHOOD);
                clip = ResourceUtils.getInstance().getGameResources("LiveliHood", "music");
            }break;
        }
        
        if(clip){
            this.node.getComponent(AudioSource)!.clip = clip;
            SoundManager.getInstance().playMusic(true);
        }
    }

    addGeneralFacts(){
        this.accomplishment = instantiate(this.accomplishmentPrefab);

        let height = this.accomplishment.getComponent(UITransform)?.contentSize.height! * this.accomplishments.generalFacts.length;

        let width = this.accomplishment.getComponent(UITransform)?.contentSize.width*0.9;
        this.generalFacts.getComponent(UITransform)?.setContentSize(new Size(width,height)); 
        
        this.accomplishments.generalFacts.forEach((generalFact:string,index:number) =>{
            this.accomplishment = instantiate(this.accomplishmentPrefab);
            //this.accomplishment.getChildByName("Text")!.getComponent(Label).string = 'Did you know '+generalFact;
            this.accomplishment.getChildByName("Text")!.getComponent(Label).string = generalFact;//'<b><color=#fed047> هل تعلم</color></b>';
            //this.accomplishment.getChildByName("Text")!.getComponent(RichText).maxWidth = width;
            this.accomplishment.position.y = this.accomplishment.getComponent(UITransform)?.contentSize.height!*1 * index*-1;
            
            this.generalFacts.addChild(this.accomplishment);
        });
        
    }

    addAchievement(){

        this.accomplishment = instantiate(this.accomplishmentPrefab);

        let height = this.accomplishment.getComponent(UITransform)?.contentSize.height! * this.accomplishments.achievements.length;

        let width = this.accomplishment.getComponent(UITransform)?.contentSize.width*0.9;
        this.achievements.getComponent(UITransform)?.setContentSize(new Size(width,height)); 

        this.accomplishments.achievements.forEach((achievement:string,index:number) =>{
            this.accomplishment = instantiate(this.accomplishmentPrefab);
            //this.accomplishment.getChildByName("Text")!.getComponent(Label).string = 'Did you know '+achievement;
            this.accomplishment.getChildByName("Text")!.getComponent(Label).string = achievement;//'<b><color=#fed047> هل تعلم</color></b>';
            //this.accomplishment.getChildByName("Text")!.getComponent(RichText).maxWidth = width;
            this.accomplishment.position.y = this.accomplishment.getComponent(UITransform)?.contentSize.height!*1 * index*-1;
            this.achievements.addChild(this.accomplishment);
        });
    }

    updateHeadings(){
        this.headingGeneralFacts.string = this.accomplishments.headings[0];
        this.headingAchievements.string = this.accomplishments.headings[1];
    }

    goToHomeScene(){

        if(gameManager.getInstance().allGamesPlayed()){
            director.loadScene("review");
            console.log("All Games Played Well Done!");
        }
        else{
            director.loadScene("home");
        }
    }

    onPlayAgain(){
        gameManager.getInstance().gameAutoAdvance = gameManager.getInstance().gameType;
        this.goToHomeScene();
    }

    onContinue(){
        gameManager.getInstance().gameAutoAdvance = 0;
        this.goToHomeScene();
    }
}
