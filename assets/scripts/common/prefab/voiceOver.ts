
import { _decorator, Component, Node , Label, Sprite} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VoiceOver')
export class VoiceOver extends Component {
    
    @property(Label)
    message = new Label;

    @property(Label)
    countDown = new Label;

    @property(Sprite)
    popUp = new Sprite;

    start () {
        
    }

    updateMessage(message:string){
        this.message.string = message;
    }

    updateCountDown(message:string){
        this.countDown.string = message;
    }

    InactiveActivePopUp(isActive:boolean){
        this.popUp.node.active = isActive;
    }
}
