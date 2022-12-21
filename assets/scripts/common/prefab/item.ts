
import { _decorator, Component, Node, Sprite, Label, SpriteFrame , UITransform, Vec3} from 'cc';
import { gameManager, GAME_TYPE, SCENE_TYPE} from '../managers/gameManager';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    _delagateScript: Component | undefined;

    @property(Sprite)
    baseImage = new Sprite;

    @property(Sprite)
    itemImage = new Sprite;

    @property(Label)
    itemName = new Label;

    @property(Label)
    itemPrice = new Label;

    start () {
        
    }

    setDelegate(delegate: Component){
        this._delagateScript = delegate;
    }

    onPauseButtonPressed(){
        this._delagateScript!.timePaused();
    }

    upateItemData(itemdata :any,spriteFrame : SpriteFrame){
        this.itemName.string = itemdata.name;
        this.itemPrice.string = itemdata.price;

        this.itemImage.getComponent(Sprite)!.spriteFrame = spriteFrame;
        let itemBaseHeight = this.baseImage.getComponent(UITransform)?.contentSize.height;
        let itemHeight = this.itemImage.getComponent(UITransform)?.contentSize.height;
        let scale = itemBaseHeight!/itemHeight!;
        // console.log("Scale : "+scale + " b : "+itemBaseHeight +" i : "+itemHeight);
        this.itemImage.node.setScale(new Vec3(scale, scale, scale));
    }

    getItemImage(){
        return this.itemImage.getComponent(Sprite)!.spriteFrame;
    }

    getItemImageScale(){
        return this.itemImage.node.getScale();
    }
}
