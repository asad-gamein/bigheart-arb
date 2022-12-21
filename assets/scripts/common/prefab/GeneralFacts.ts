

import { _decorator, Component, Node, Prefab, instantiate, Label, EventHandler, Button } from 'cc';
import { gameManager } from '../managers/gameManager'; 
import { getQuestionier } from '../strings';
const { ccclass, property } = _decorator;

@ccclass('GeneralFacts')
export class GeneralFacts extends Component {
    

    questions : Record<string, any> = {};
    currentPage : number =0;

    _delegate : Component = null!;

    questionPages : Node[] =[];


    @property(Prefab)
    questionPopUp : Prefab = null!;




    start () {
        // [3]
    }

    setDelegate(delegate : any){
        this._delegate = delegate;
    }


    setUpQuestioniers(){
        this.questions  = getQuestionier(gameManager.getInstance().getGameType());
        let siblingIndex = 5;
        let initalHeight = 0;
        
        for(let item of this.questions.facts){
            let prefab = instantiate(this.questionPopUp);
            prefab.getChildByName("Layout")!.getChildByName("question")!
            .getComponent(Label)!.string = item.question;
            this.setButtons(prefab, item);
            prefab.setSiblingIndex(siblingIndex);
            prefab.position.y = initalHeight;
            initalHeight+=20;
            this.questionPages.push(prefab);
        }
        for(let i = this.questionPages.length-1; i >= 0; i-- ){
            this.node.addChild( this.questionPages[i]);
        }

    }

    setButtons(parent:Node, item : any){
        //console.log("item.options", item, item.options, this.questions);
        for(let i = 0; i < item.options.length; i++ ){
            let button = parent.getChildByName("buttonLayout")!.getChildByName(`Button${i+1}`)!
            let clickEventHandler = new  EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "GeneralFacts";
            clickEventHandler.handler = "onButtonCall";
            clickEventHandler.customEventData = `${i+1}`;
            button.getComponent(Button)!.clickEvents.push(clickEventHandler);
            button.getComponentInChildren(Label)!.string = item.options[i];
        }
       
    }
    

    onButtonCall(event: Event, buttonNo : string){
        if(this.questions.facts[this.currentPage].answer == buttonNo){
            this.playMoveOutAnimation();
          
           
        }

    }

    playMoveOutAnimation(){
        let  node = this.questionPages[this.currentPage];
        node.removeFromParent();
        this.currentPage++;
        //console.log("currebt opage", this.currentPage)
        if(this.currentPage == this.questions.facts.length){
            this.onFactsFinished();
        }

        

    }


    onFactsFinished(){
        this._delegate.onFactEnd();
    }
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
