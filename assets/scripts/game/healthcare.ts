import { _decorator, Prefab, Component,instantiate, Node, Sprite, v2, v3, UITransform, SpriteFrame , Intersection2D, Vec3, Enum, tween, director, VideoPlayer, math, AudioClip, AudioSource, Widget, ProgressBar, Color, IColorLike, Animation, Label, repeat} from 'cc';
const { ccclass, property } = _decorator;
import { gameManager,DonateableItem,ContainerItem, GAME_TYPE, SCENE_TYPE,HEALTH_ITEM_TYPE,LIVLI_CONTAINER_TYPE,IN_GAME_CURR_OP, randomEnum} from '../common/managers/gameManager';
import { ResourceUtils } from '../common/managers/ResourceUtils';

import { SoundManager } from '../common/managers/SoundManager';

import {getVoiceOvers} from '../common/strings';
class Truck
{
  public type           : LIVLI_CONTAINER_TYPE | undefined;
  public spriteFrame    : SpriteFrame | undefined | any;
}

class itemCount
{
  public type   : HEALTH_ITEM_TYPE | undefined | any;
  public count : number | undefined;
}

@ccclass('Healthcare')
export class Healthcare extends Component {


    hospitalItemDragged:boolean = false;
    flashAction:any = null;
    flashingItem:Node|any = null!;
    
    HUDLayer : Node = null!;
    voiceOver : Node = null!;
    factsPopUp : Node = null!;
    pausePopUp : Node = null!;
    hospitalItem : Node= null!;
    touchRestriction : Node = null!;
    
    voiceOverData:any;
    sideBarHeight :number|undefined;

    foodBoxCount :number=0;
    waterBoxCount :number=0;
    clothesBoxCount :number=0;

    gameSummary:Array<string> = new Array;

    donateableItemsInfo = new Array();
    donateableItems: Array<DonateableItem> = new Array();
    donationInfo: Array<itemCount> = new Array();
    requestItems: Array<itemCount> = new Array();

    dragable = new DonateableItem();
    dragableItemInitPos :Vec3|undefined;
    canDragItem = false;
    canUpdateDragableItemData = true;
    
    gereranlFactsLayer : Node = null!;

    @property(Node)      doctor                 :Node = null!;
    @property(Label)     doctorMsg              :Label = null!;
    @property(Sprite)    bg                     :Sprite = null!;
    @property(Sprite)    sideBar                :Sprite = null!;
    @property(Prefab)    voiceOverPrefab        :Prefab = null!;
    @property(Prefab)    touchRestrictionPrefab :Prefab = null!;
    @property(Prefab)    HUDLayerPrefab         :Prefab = null!;
    @property(Prefab)    itemPrefab             :Prefab = null!;
    @property(Prefab)    itemInHandPrefab       :Prefab = null!;
    @property(Prefab)    dragableItemPrefab     :Prefab = null!;
    @property(Prefab)    factsPopUpPrefab       :Prefab = null!;
    @property(Prefab)    pausePopUpPrefab       :Prefab = null!;
    @property(Prefab)    gerenalFacts           :Prefab = null!;
    @property(Prefab)    errorPopUpPrefab       :Prefab = null!;

    @property(SpriteFrame)
    hospitalItemsFrames = [];
    @property({type : Enum(HEALTH_ITEM_TYPE)})
    hospitalItemsType   = [];

    //audios
    @property(AudioClip)
    donationDone : AudioClip = null!;

    start () {
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        gameManager.getInstance().setSceneType(SCENE_TYPE.GAME);
        gameManager.getInstance().setGameType(GAME_TYPE.HEALTHCARE);
        this.donateableItemsInfo = gameManager.getInstance().getGameItems(GAME_TYPE.HEALTHCARE);
        gameManager.getInstance().incrementUserHearts(gameManager.getInstance().getGameTimeHeart(gameManager.getInstance().getGameType()).hearts);
        
        this.HUDLayer = instantiate(this.HUDLayerPrefab); 
        this.node.addChild(this.HUDLayer);
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.setDelegate(this);
       
        this.dragable.item = instantiate(this.dragableItemPrefab); 
        this.bg.node.addChild(this.dragable.item);
        this.dragable.item.active = false;

        this.createDonateableItems();
        this.touchEvents();
        this.createVoiceOver();
        this.addTouchRestriction();
        this.addPausePopUp();
        this.setUpFactsPopUp();
        this.inActiveAll();
        // this.runTutorial();
        this.showFactsPopUp();
    }

    inActiveAll(){
        this.donateableItems.forEach((item,index)=>{
            let max = this.donateableItemsInfo.find(i=>i.type === item.type).max;
            let name = item.name;
            let itemName = "";
            for(let i = 1; i<=max;i++){
                itemName = name!+i;
                let item:any = this.bg.node!.getChildByName(itemName);
                item!.active = false;
                item.getComponent(Sprite).grayscale = true;
            }
        });
    }

    activeItem(name:string,count:number){
        let itemName = name!+count;
        let item:any = this.bg.node!.getChildByName(itemName);

        this.stopFlashItem();
        item!.active = true;
        item.getComponent(Sprite).grayscale = false;
    }

    stopFlashItem(){
        if(this.flashAction){
            this.flashAction.stop();
            this.flashAction=null;
        }
        if(this.flashingItem){
            this.flashingItem.getComponent(Sprite).grayscale = true;
            this.flashingItem.setScale(new Vec3(1,1,1));
            this.flashingItem!.active = false;
            this.flashingItem = null;
        }
    }

    flashItem(){
        let requestedItem:any = this.requestItems.find(i => i.type === this.dragable.type);
        //console.log({requestedItem});
        if(requestedItem){

            this.flashingItem = this.getItem(this.dragable.name,requestedItem.count);//this.bg.node!.getChildByName(itemName);
            this.flashingItem!.active = true;
            this.flashAction = tween(this.flashingItem)
            .repeatForever(
                tween()
                .call(()=>{
                    this.flashingItem.setScale(new Vec3(1.1,1.1,1.1));
                    this.flashingItem.getComponent(Sprite).grayscale = false;
                })
                .delay(0.4)
                .call(()=>{
                    this.flashingItem.getComponent(Sprite).grayscale = true;
                    this.flashingItem.setScale(new Vec3(1,1,1));
                })
                .delay(0.4)
            )
            .start();
        }
    }
    getItem(name:string|any,count:number){
        let itemName = name!+count;
        return this.bg.node!.getChildByName(itemName);
    }

    createRequest(tutorial:boolean){
        this.requestItems = [];
        if(!tutorial){
            this.donateableItems.forEach((item,index)=>{
                let max = this.donateableItemsInfo.find(i=>i.type === item.type).max + 1;
                let random = Math.floor(Math.random() * max);
                if(random){
                    this.requestItems.push({
                        type  : item.type,
                        count : random
                    })
                }
            });
        }
        else{
            this.donateableItems.forEach((item,index)=>{
                if(index == 0 ||index == 1 ||index == 2){    
                    let random = 1;
                    this.requestItems.push({
                        type  : item.type,
                        count : random
                    })
                }
            });
        }
        this.updateDoctorMsg();
    }

    updateDoctorMsg(){
        let msg = "نحتاج الى ";
        let firstItem = true;
        this.requestItems.forEach((item,index)=>{
            if(item.count){
                let itemName = this.donateableItemsInfo.find(i=>i.type === item.type).name;
                if(!firstItem){
                    msg = msg +"\n";
                }
                if(item.count >1)
                    msg = msg + itemName+ item.count ;//+"s";
                else if(item.count == 1)
                    msg = msg + itemName+ item.count ;
                firstItem=false;
            }
        });
        //msg = msg +".";
        this.doctorMsg.string = msg;
    }

    doctorAnimation(){
        tween(this.doctor)
        .call(()=>{
            this.doctor.getComponent(Animation)?.play('enterDoc');
        })
        .delay(0.5)
        .call(()=>{
            this.doctor.getChildByName('doctorMsg')?.getComponent(Animation)?.play('docMessageEnter');
        })
        .start();
    }

    setUpFactsPopUp(){
        this.factsPopUp = instantiate(this.factsPopUpPrefab);
        this.bg.node.addChild(this.factsPopUp);
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.loadAccomplishments();
        factPopUpScript!.updateHeading('حقائق عامة عن قطاع الرعاية الصحية');
       
        factPopUpScript!.setDelegate(this);
        this.factsPopUp.active = false;
    }

    showFactsPopUp(){
        this.pauseTimer();
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.showFact();
    }

    createVoiceOver(){
        this.voiceOver = instantiate(this.voiceOverPrefab);
        this.bg.node.addChild(this.voiceOver);
        this.voiceOver.active = false;
        this.voiceOverData = getVoiceOvers(gameManager.getInstance().getGameType());
    }

    addTouchRestriction(){
        this.touchRestriction = instantiate(this.touchRestrictionPrefab);
        this.node.addChild(this.touchRestriction);
        this.touchRestriction.active = false;
    }

    loadVideo(){

    }

    startTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.startTimer();
        this.createRequest(false);
        this.doctorAnimation();
    }

    pauseTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.pauseTimer();
    }

    resumeTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.resumeTimer();
    }

    createDonateableItems(){

        this.sideBarHeight = this.sideBar.getComponent(UITransform)?.contentSize.height;
        this.hospitalItemsFrames.forEach((itemFrame,index,aar) =>{

            let itemDetail = this.donateableItemsInfo.find(i=>i.type === this.hospitalItemsType[index]);
            
            let item = instantiate(this.itemPrefab); 
            let itemScript:any = item.getComponent("Item");
            itemScript!.setDelegate(this);
            itemScript!.upateItemData(itemDetail,itemFrame);
            
            let positionY = (this.sideBarHeight!/aar.length)*(index + 0.5);
            let scaleValue = (this.sideBarHeight!/(aar.length+1.5))*0.8/item.getComponent(UITransform)?.contentSize.height!;
            item.setScale(new Vec3(scaleValue,scaleValue,scaleValue));
            item.position.y = positionY;
            
            this.sideBar.node.addChild(item);
            this.donateableItems.push({ 
                type            : itemDetail.type,
                donationTo      : LIVLI_CONTAINER_TYPE.NONE, 
                item            : item,
                price           : itemDetail.price,
                name            : itemDetail.name
            });
        });
    }        

    touchEvents(){
        this.node.on(Node.EventType.TOUCH_START,this.itemTouchStartCallback,this);
        this.node.on(Node.EventType.TOUCH_MOVE,this.itemTouchMoveCallback,this);
        this.node.on(Node.EventType.TOUCH_END,this.itemTouchEndCallback,this);
        this.node.on(Node.EventType.TOUCH_CANCEL,this.itemTouchEndCallback,this);
    }
    itemTouchStartCallback(event: { getUILocation: () => any; }){
        this.sideBar!.getComponent(Widget)?.updateAlignment();
        var eventLocation = event.getUILocation();
        if(this.canUpdateDragableItemData){
            for(var i =0; i < this.donateableItems.length; i++){
                if(this.donateableItems[i].item!.getComponent(UITransform)?.getBoundingBoxToWorld().contains(v3(eventLocation.x, eventLocation.y,0))){
                    this.updateDragableItemData(this.donateableItems[i],v3(eventLocation.x, eventLocation.y,0),);
                    this.flashItem();
                    break;
                }
            }
        }

        // this.checkIfHospitalItemToched(eventLocation);
    }

    checkIfHospitalItemToched(eventLocation:any){
        this.donateableItems.forEach((item,index)=>{

            let max = this.donateableItemsInfo.find(i=>i.type === item.type).max;
            let name = item.name;
            let itemName = "";

            for(let i = 1; i<=max;i++){
                itemName = name!+i;

                let item:Node|null = this.bg.node!.getChildByName(itemName);
                if(item?.active){
                    if(item!.getComponent(UITransform)?.getBoundingBoxToWorld().contains(v2(eventLocation.x, eventLocation.y))){
                        this.hospitalItemDragged = true;
                        this.hospitalItem = item;
                        break;
                    }
                }
            }
        });
    }

    updateDragableItemData(itemData : DonateableItem,pos :any|Vec3){

        this.canUpdateDragableItemData = false;
        this.dragable.item.getComponent(Sprite)!.spriteFrame =  itemData.item!.getComponent("Item").getItemImage();
        this.dragable.item.setScale(itemData.item!.getComponent("Item").getItemImageScale());
        this.dragable.item.position = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(pos);
        // this.dragable.item.position = pos;
        this.dragableItemInitPos = pos;
        this.dragable.type = itemData.type;
        this.dragable.price = itemData.price;
        this.dragable.name = itemData.name;
        
        this.canDragItem = true;
        this.dragable.item.active =  true;
    }

    resetDragableItemData(){
        this.canDragItem = false;
        this.dragable.item.active =  false;
        
        this.dragable.donationTo = LIVLI_CONTAINER_TYPE.NONE;
        this.dragable.price = 0;
        this.dragable.name = "";
        this.dragable.type = HEALTH_ITEM_TYPE.NONE;
        this.canUpdateDragableItemData = true;
    }
    
    itemTouchMoveCallback(event: { getUILocation: () => any; }){
        var eventLocation = event.getUILocation();

        if(this.canDragItem){
            let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(eventLocation.x, eventLocation.y,0));
            this.dragable.item.position = newPosition;
        }

        if(this.hospitalItemDragged){

            let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(eventLocation.x, eventLocation.y,0));
            this.hospitalItem.position = newPosition!;
        }
    }

    //MARK: touch end callback
    itemTouchEndCallback(event: { getStartLocation: () => any; }){
        var eventLocation = event.getStartLocation();
        
        if(this.canDragItem){
            let item = this.requestItems.find(i => i.type === this.dragable.type);

            if(!item){
                this.putDragableItemBack();
                return;
            }

            let itemIntersect = this.checkDragableIntersectWith(this.flashingItem);
            if(!itemIntersect){
                this.putDragableItemBack();
                return;
            }
            
            let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
            let HUDResponse= HUDLayerScript!.updateHearts(IN_GAME_CURR_OP.DECREASE, this.dragable.price);
            if(HUDResponse.error !== ""){
                this.putDragableItemBack();
                if("Not enought hearts to buy particular Item."==HUDResponse.error){
                    this.showErrorPopUp(String("Not enought hearts to donate "+this.dragable.name));
                    if(item.count! >0)
                    {                        
                        this.requestItems.splice(this.requestItems.indexOf(item),1);
                        this.updateDoctorMsg();
                    }
                    if(this.requestItems.length ==0){
                        this.exitDoctor();
                    }
                }
            }else{
                if(item.count! ==0){
                    this.putDragableItemBack();
                    return;
                }                     
                this.activeItem(this.dragable.name!,item.count!);
                item.count!--;
                let donation = this.donationInfo?.find(item => item.type == this.dragable.type);
                if(donation){
                    donation.count!++;
                }
                else{
                    this.donationInfo?.push({
                        type : this.dragable.type,
                        count : 1
                    });
                }
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                if(item.count ==0){
                    this.requestItems.splice(this.requestItems.indexOf(item),1);
                }
                if(this.requestItems.length ==0){
                    this.exitDoctor();
                }else{
                    this.updateDoctorMsg();
                }
                this.resetDragableItemData();
            }

            if(HUDResponse.gameover){
                this.pauseTimer();
                this.noMoreHeartsLeft();
            }
            
        }
        if(this.hospitalItemDragged){
            this.hospitalItemDragged = false;
            this.hospitalItem = null!;
        }
    }

    exitDoctor(){
        tween(this.doctor)
        .call(()=>{
            this.doctorMsg.string = "!أحسنت";
        })
        .delay(3)
        .call(()=>{
            this.doctor.getChildByName('doctorMsg')?.getComponent(Animation)?.play('docMessageExit');
        })
        .delay(0.5)
        .call(()=>{
            this.doctor.getComponent(Animation)?.play('exitDoc');
        })
        .delay(0.5)
        .call(()=>{
            this.createRequest(false);
            this.doctorAnimation();
            this.inActiveAll();
        })
        .start();
    }

    checkDragableIntersectWith(container :any| Node){
        if(container && this.dragable.item){
            return Intersection2D.rectRect(
                container.getComponent(UITransform)?.getBoundingBoxToWorld(),
                this.dragable.item.getComponent(UITransform)?.getBoundingBoxToWorld()!
                );
        }
        else{
            return false;
        }
    }

    showErrorPopUp(Message:String){

        let erroPopUp = instantiate(this.errorPopUpPrefab);
        let text:Label|any = erroPopUp.getChildByName("message")?.getComponent(Label);
        text.string = Message;
        this.bg.node.addChild(erroPopUp);
        tween(this.node)
            .delay(1)
            .call(()=>{
                erroPopUp.removeFromParent();
            })
            .start();
    }

    putDragableItemBack(){
        this.stopFlashItem();
        this.canDragItem = false;
        let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(this.dragableItemInitPos!.x, this.dragableItemInitPos!.y,0));
        tween(this.dragable.item)
            .to(0.2, {position: newPosition})
            .call(()=>{this.resetDragableItemData();})
            .start();
    }

    timePaused(){
        this.touchRestriction.active = true;
        this.showPausePopUp(true);
    }
    timeRunning(){
        this.touchRestriction.active = false;
    }

    timeOver(){
        this.touchRestriction.active = true;
        this.createSummary();
        this.gameOver();
    }

    noMoreHeartsLeft(){
        this.touchRestriction.active = true;
        this.createSummary();
        this.gameOver();
    }

    gameOver(){
        this.touchRestriction.active = true;
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        let heartsConsumed = HUDLayerScript!.getHeartsConsumed();
        let amount = heartsConsumed < 100 ? [heartsConsumed] : [Math.floor(heartsConsumed/100) * 100, heartsConsumed%100];
        let result = amount.map(( name:string ) => ResourceUtils.getInstance().getAudioClip(name)).filter(item => item!=null);
        let waitAfterAmount = result.map(clip => clip?.getDuration()).reduce((a, b) => a! + b!, 0)

        
        if(heartsConsumed>0){
            tween(this.node)
            .call(()=>{
                var str =this.voiceOverData.end;
                let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
                let heartsConsumed = HUDLayerScript!.getHeartsConsumed();
                gameManager.getInstance().setLastScore(heartsConsumed);

                var str2 = str.replace("xxx", String(heartsConsumed));
                this.updateVoiceOverMessage(str2);
                this.voiceOver.active = true;
                let your = ResourceUtils.getInstance().getAudioClip("GoodJob");
                SoundManager.getInstance().playSoundEffect(your!); 
            })
            .delay(3)
            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("youDonated");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(1.2)
            .call(()=>{
                this.playAudios(0,result);
            })
            .delay(waitAfterAmount!)

            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("HeartsWord");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(1)

            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("toHospital");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(10.4)
            // .call(()=>{
            //     let wellDone = ResourceUtils.getInstance().getAudioClip("wellDone");
            //     SoundManager.getInstance().playSoundEffect(wellDone!);
            // })
            .delay(3)
            .call(()=>{
                this.voiceOver.active = false;
                // this.showFactsPopUp(); 
                this.changeScene();
            })
            .start();
        }else{
            this.changeScene();
        }
    }

    changeScene(){
        if(this.gameSummary.length >0){
            director.loadScene("gameSummary");
        }
        else{
            director.loadScene("accomplishment");
        }
    }

    createSummary(){
        ///backup//////////////////////////////////////////////////////
        // let summaryText:string = "";
        // this.donationInfo!.forEach((info,index,arr) => {
              
        //     summaryText = "Donated ";

        //     if(info.count!>1){
        //         summaryText = summaryText + ` ${info.count} ${this.getItemNameForSummary(info.type)}` + "s";
        //     }else{
        //         summaryText = summaryText + ` ${info.count} ${this.getItemNameForSummary(info.type)}`;
        //     }
        //     summaryText = summaryText +` to hospital.`;

        //     this.gameSummary.push(summaryText);
        //     summaryText = "";

        // });
        let summaryText:string = "";
        this.donationInfo!.forEach((info,index,arr) => {
              
            summaryText ="";// "Donated ";

            if(info.count!>1){
                summaryText = summaryText +`${info.count} ${this.getItemNameForSummary(info.type)}`;// + "s";
            }else{
                summaryText = summaryText +`${info.count} ${this.getItemNameForSummary(info.type)}`;
            }
            //summaryText = summaryText +` to hospital.`;

            this.gameSummary.push(summaryText);
            summaryText = "";

        });


        gameManager.getInstance().setGameSummary(this.gameSummary);
    }

    getItemNameForSummary(equipmentType:HEALTH_ITEM_TYPE|undefined){
        switch(equipmentType){
            case HEALTH_ITEM_TYPE.BED : return "سرير طبي";
            case HEALTH_ITEM_TYPE.CHAIR : return "كرسي";
            case HEALTH_ITEM_TYPE.CLOCK : return "ساعة";
            case HEALTH_ITEM_TYPE.CURTAINS : return "ستارة";
            case HEALTH_ITEM_TYPE.MONITOR : return "شاشة طبية";
            case HEALTH_ITEM_TYPE.PLANT : return "نبتة";
            case HEALTH_ITEM_TYPE.XRAY : return "جهاز أشعة";
            case HEALTH_ITEM_TYPE.MEDICINE : return "علبة أدوية";
            case HEALTH_ITEM_TYPE.OXYGEN : return "اسطوانة أكسجين";
        }
    }

    getPositionOnBG(item:Node){

        let rect:any = item.getComponent(UITransform)?.getBoundingBoxToWorld();
        let testingPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(rect.x + rect.width * 0.5 , rect.y + rect.height*0.5,0));
        return testingPosition;
    }

    getDonatbleItemPositionOnBG(item:Node){
        let rect2 :any =  item.getComponent(UITransform)?.getBoundingBoxToWorld();
        let testingPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(rect2.x + rect2.width * 0.5 ,rect2.y + rect2.height * 0.5 ,0));
        // this.graphics2.fillRect(testingPosition.x, testingPosition.y, rect2.width,rect2.width);
             return testingPosition;
    }

    runTutorial(){
        this.touchRestriction.active = true;
        let itemInHand:Node = instantiate(this.itemInHandPrefab);
        this.bg.node.addChild(itemInHand);
        itemInHand.active = false;
        
        let tutorial1InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[0].item.getChildByName("itemImage"));
        let tutorial1SpriteFrame:SpriteFrame = this.donateableItems[0].item!.getComponent("Item").getItemImage();

        let tutorial2InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[1].item.getChildByName("itemImage"));
        let tutorial2SpriteFrame:SpriteFrame = this.donateableItems[1].item!.getComponent("Item").getItemImage();

        let tutorial3InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[2].item.getChildByName("itemImage"));
        let tutorial3SpriteFrame:SpriteFrame = this.donateableItems[2].item!.getComponent("Item").getItemImage();

        tween(itemInHand)
            .call(()=>{
                this.updateVoiceOverMessage(this.voiceOverData.introduction);
                this.voiceOver.active = true;
                let clip:any = ResourceUtils.getInstance().getGameResources("Healthcare", "Vo1");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(17)
            .call(()=>{
                this.createRequest(true);
                this.doctorAnimation();

                this.voiceOver.active = false;
                itemInHand.active = true;
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial1SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial1InitPos!.x, tutorial1InitPos!.y,0)})
            .to(2, {position: this.getItem("سرير",1)?.position})
            .call(()=>{
                this.requestItems.splice(0,1);
                this.activeItem("سرير",1);
                this.updateDoctorMsg();
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial2SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial2InitPos!.x, tutorial2InitPos!.y,0)})
            .to(2, {position: this.getItem("جهاز أشعة",1)?.position})
            .call(()=>{
                this.requestItems.splice(0,1);
                this.activeItem("جهاز أشعة",1);
                this.updateDoctorMsg();
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial3SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial3InitPos!.x, tutorial3InitPos!.y,0)})
            .to(2, {position: this.getItem("شاشة",1)?.position})
            .call(()=>{
                this.requestItems.splice(0,1);
                this.activeItem("شاشة",1);
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                tween(this.doctor)
                        .call(()=>{
                            this.doctorMsg.string = "!أحسنت";
                        })
                        .delay(0.3)
                        .call(()=>{
                            this.doctor.getChildByName('doctorMsg')?.getComponent(Animation)?.play('docMessageExit');
                        })
                        .delay(0.5)
                        .call(()=>{
                            this.doctor.getComponent(Animation)?.play('exitDoc');
                        })
                        .delay(0.5)
                        .call(()=>{
                            this.inActiveAll();
                        })
                        .start();
                itemInHand.active = false;  
            })
            .delay(1.3)
            .call(()=>{
               
                let clip =ResourceUtils.getInstance().getAudioClip("threeTwoOne");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(0.1)
            .call(()=>{
                this.InactiveActivePopUp(false);
                this.voiceOver.active = true;
                this.updateVoiceOverCountDown("3");
            })
            .delay(0.8)
            .call(()=>{
                this.updateVoiceOverCountDown("2");
            })
            .delay(0.8)
            .call(()=>{
                this.updateVoiceOverCountDown("1");
            })
            .delay(0.8)
            .call(()=>{
                this.updateVoiceOverCountDown("!انطلق  ");
            })
            .delay(1)
            .call(()=>{
                this.InactiveActivePopUp(true);
                this.voiceOver.active = false;
                this.touchRestriction.active = false;
                this.startTimer();
                // this.showFactsPopUp();
                let clip = ResourceUtils.getInstance().getGameResources("Healthcare", "music");
                if(clip){
                    this.node.getComponent(AudioSource)!.clip = clip;
                    SoundManager.getInstance().playMusic(true);
                }
            })
            .start();
    }
    updateVoiceOverMessage(message:string){
        let voiceOverScript:any = this.voiceOver.getComponent("VoiceOver");
        voiceOverScript!.updateMessage(message);
    }
    InactiveActivePopUp(isActive:boolean){
        let voiceOverScript:any = this.voiceOver.getComponent("VoiceOver");
        voiceOverScript!.InactiveActivePopUp(isActive);
    }
    updateVoiceOverCountDown(message:string){
        let voiceOverScript:any = this.voiceOver.getComponent("VoiceOver");
        voiceOverScript!.updateCountDown(message);
    }


    addPausePopUp(){
        this.pausePopUp = instantiate(this.pausePopUpPrefab);
        this.pausePopUp.getComponent('Popup')?.init(this);
        this.node.addChild(this.pausePopUp);
        this.node.setSiblingIndex(10);
        this.pausePopUp.active = false;
    }

    onResume(){
        this.HUDLayer.getComponent("HUDLayer")!.resumeTimer();
        this.timeRunning();
        this.pausePopUp.active = false;
    }

    showPausePopUp(isPause: boolean){
        this.pausePopUp.getComponent('Popup')!.changeButtonState(isPause);
        this.pausePopUp.active = true;
    }

    playAudios(index : number, audioClips : any){
        if(index >= audioClips.length || audioClips.length ==0 ){
            return;
        }else{
            let wait = audioClips[index].getDuration();
            tween(this.node).call(()=>SoundManager.getInstance().playSoundEffect(audioClips[index]))
            .delay(wait).call(()=> this.playAudios(index+1, audioClips))
            .start();
        }
    }

    startQuiz(){
        this.gereranlFactsLayer.active  = true;
    }

    onFactEnd(){
        this.gereranlFactsLayer.active  = false;
        this.onResume();
    }

}