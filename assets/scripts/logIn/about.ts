
import { _decorator, Component, Node, director, AudioSource, AudioClip } from 'cc';
import { SoundManager } from '../common/managers/SoundManager';
import { gameManager, SCENE_TYPE } from '../common/managers/gameManager';
const { ccclass, property } = _decorator;

@ccclass('About')
export class About extends Component {
    @property(Node)
    welcomeBack : Node = null!;

    @property(AudioClip)
    buttonClick : AudioClip = null!;


    start () {
        //console.log("gameManager.getInstance().doNeedWelcomePopUp()", gameManager.getInstance().doNeedWelcomePopUp());
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        gameManager.getInstance().doNeedWelcomePopUp() && this.showWelComePopUp();
        !gameManager.getInstance().doNeedWelcomePopUp() && this.playAboutUs();
    }



    onContinue(){
        this.node.getComponent(AudioSource)?.stop();
        director.loadScene("home");
    }

    onButtonClick(){
        SoundManager.getInstance().playSoundEffect(this.buttonClick);
        this.welcomeBack.active = false;
        gameManager.getInstance().doNeedtoShowWelcomePopUp(false);
        this.playAboutUs();
    }

    showWelComePopUp(){
        this.welcomeBack.active = true;
    }

    playAboutUs(){
        SoundManager.getInstance().playMusic(false);
    }
}
