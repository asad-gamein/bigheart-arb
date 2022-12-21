
import { _decorator, Component, Node , Label, Sprite, Prefab, UITransform, instantiate, Size, RichText} from 'cc';
const { ccclass, property } = _decorator;
import { gameManager, GAME_TYPE, SCENE_TYPE, IN_GAME_CURR_OP} from '../managers/gameManager';
import {getAccomplishments} from '../strings';

export enum FACT_NUMBER{
    NUM1 = 1,
    NUM2 = 2,
    NUM3 = 3
}

@ccclass('FactsPopUp')
export class FactsPopUp extends Component {

    accomplishments:any;
    accomplishment : any;
    accomplishmentCounter:number = -1;
    _delagateScript: Component | undefined;

    @property(Label)
    message = new Label;

    @property(Label)
    heading = new Label;

    @property(Prefab)
    accomplishmentPrefab = new Prefab;

    @property(Node)
    scrollViewContent = new Node;

    start () {
        
    }
    setDelegate(delegate: Component){
        this._delagateScript = delegate;
    }

    loadAccomplishments(){
        this.accomplishments = getAccomplishments(gameManager.getInstance().getGameType());
        // console.log("Acc : " + this.accomplishments.generalFacts)
    }

    showFact(){
        this.accomplishmentCounter++;
        
        if(this.accomplishmentCounter == 0)
            this.addGeneralFacts();
        else if(this.accomplishmentCounter == 1)
            this.addAchievement();

        this.node.active = true;
    }

    addGeneralFacts(){
        this.accomplishment = instantiate(this.accomplishmentPrefab);

        let height = this.accomplishment.getComponent(UITransform)?.contentSize.height! * this.accomplishments.generalFacts.length;

        let width = this.accomplishment.getComponent(UITransform)?.contentSize.width;
        this.scrollViewContent.getComponent(UITransform)?.setContentSize(new Size(width,height)); 
        
        this.accomplishments.generalFacts.forEach((generalFact:string,index:number) =>{
            this.accomplishment = instantiate(this.accomplishmentPrefab);
            this.accomplishment.getChildByName("Text")!.getComponent(RichText).string = '<color=#555555>'+generalFact+'</color>';
            this.accomplishment.position.y = this.accomplishment.getComponent(UITransform)?.contentSize.height!*1 * index*-1;
            
            this.scrollViewContent.addChild(this.accomplishment);
        });
    }

    addAchievement(){
        this.scrollViewContent.removeAllChildren();

        this.accomplishment = instantiate(this.accomplishmentPrefab);

        let height = this.accomplishment.getComponent(UITransform)?.contentSize.height! * this.accomplishments.achievements.length;

        let width = this.accomplishment.getComponent(UITransform)?.contentSize.width;
        this.scrollViewContent.getComponent(UITransform)?.setContentSize(new Size(width,height)); 

        this.accomplishments.achievements.forEach((achievement:string,index:number) =>{
            this.accomplishment = instantiate(this.accomplishmentPrefab);
            this.accomplishment.getChildByName("Text")!.getComponent(RichText).string = '<color=#555555>'+achievement+'</color>';
            this.accomplishment.position.y = this.accomplishment.getComponent(UITransform)?.contentSize.height!*1 * index*-1;
            this.scrollViewContent.addChild(this.accomplishment);
        });
    }

    updateMessage(message:string){
        this.message.string = message;
    }

    updateHeading(message:string){
        this.heading.string = message;
    }

    okButton(){
        // console.log("OK button ");
        this.node.active = false;
        // console.log(this.accomplishmentCounter);
        switch(this.accomplishmentCounter){
            case 0: {
                if(gameManager.getInstance().getGameType() == GAME_TYPE.RELIEF){
                    this._delagateScript!.enterPlane();
                }
                else{
                    this._delagateScript!.runTutorial();
                }
                
             } break;
            case 1: this._delagateScript!.changeScene(); break;
        }
        
    }
}
