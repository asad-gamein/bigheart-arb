
import { _decorator, Component, Node, director, AudioSource, EditBox } from 'cc';
import { SoundManager } from '../common/managers/SoundManager';
import { gameManager, SCENE_TYPE } from '../common/managers/gameManager';
const { ccclass, property } = _decorator;

@ccclass('Review')
export class Review extends Component {
    
    @property({type: EditBox,  displayName : "Review Editbox"}) reviewEb = new EditBox();

    start () {
        
    }

    onEditingDidEnded(editbox : EditBox){
        //console.log("on end : ",editbox.string);
    }
      
    onContinue(){
        gameManager.getInstance().reviewDone();
        //console.log("on continue : ",this.reviewEb.string);
        director.loadScene("home");
    }
}
