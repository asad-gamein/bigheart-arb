
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {
    

    _delegate  = null;
    @property(Node)
    reset : Node = null!;


    @property(Node)
    resume : Node = null!;


    start () {
      
    }

    init(delegate){
        this._delegate = delegate;
    }

    changeButtonState(isPause:boolean){
        this.resume.active = isPause;
        this.reset.active = !isPause;

    }


    onResume(){
        this._delegate.onResume();

    }

    onReload(){
        this._delegate.onReload();
    }


    home(){
        director.loadScene("home");
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
