import { _decorator, Prefab, Component,instantiate, Node, Sprite, v2, v3, UITransform, SpriteFrame , Intersection2D, Vec3, Enum, tween, director, VideoPlayer, math, AudioClip, AudioSource, Widget, ProgressBar, Color, IColorLike} from 'cc';
const { ccclass, property } = _decorator;
import { gameManager,DonateableItem,ContainerItem, GAME_TYPE, SCENE_TYPE,LIVLI_ITEM_TYPE,LIVLI_CONTAINER_TYPE,IN_GAME_CURR_OP, randomEnum} from '../common/managers/gameManager';
import { ResourceUtils } from '../common/managers/ResourceUtils';

import { SoundManager } from '../common/managers/SoundManager';

import {getVoiceOvers} from '../common/strings';

class Truck
{
  public type           : LIVLI_CONTAINER_TYPE | undefined;
  public spriteFrame    : SpriteFrame | undefined | any;
}

@ccclass('Livelihood')
export class Livelihood extends Component {

    HUDLayer : Node = new Node();
    voiceOver : Node = new Node();
    factsPopUp : Node = new Node();
    touchRestriction : Node = new Node();
    voiceOverData:any;
    sideBarHeight :number|undefined;

    foodBoxCount :number=0;
    waterBoxCount :number=0;
    clothesBoxCount :number=0;

    gameSummary:Array<string> = new Array;
    trucksReady:Array<LIVLI_CONTAINER_TYPE> = new Array;

    donateableItemsInfo = new Array();
    //Use These Two arrays to Operate game.
    donateableItems: Array<DonateableItem> = new Array();
    containerItems: Array<ContainerItem> = new Array();

    // truck Detail
    trucksInfo:Array<Truck> = new Array();
    
    dragable = new DonateableItem();
    dragableItemInitPos :Vec3|undefined;
    canDragItem = false;
    canUpdateDragableItemData = true;

    requestFrom  : LIVLI_CONTAINER_TYPE = LIVLI_CONTAINER_TYPE.NONE;
    requestedFor : LIVLI_ITEM_TYPE = LIVLI_ITEM_TYPE.NONE;

    donationsDone : Array<any> = new Array();
    pausePopUp : Node = null!;

    gereranlFactsLayer : Node = null!;


    @property(Sprite)
    itemContainer = new Sprite;

    @property(Sprite)
    bg = new Sprite;

    @property(Sprite)
    sideBar = new Sprite;
    @property(Prefab)
    voiceOverPrefab = new Prefab;
    @property(Prefab)
    touchRestrictionPrefab = new Prefab;
    @property(Prefab)
    HUDLayerPrefab = new Prefab;
    @property(Prefab)
    itemPrefab = new Prefab;
    @property(Prefab)
    itemInHandPrefab = new Prefab;
    @property(Prefab)
    dragableItemPrefab = new Prefab;
    @property(Prefab)
    factsPopUpPrefab = new Prefab;

    @property(SpriteFrame)
    boxFrames = [];
    @property({type : Enum(LIVLI_ITEM_TYPE)})
    boxType   = [];

    @property(SpriteFrame)
    truckFrames = [];
    @property({type : Enum(LIVLI_CONTAINER_TYPE)})
    truckType   = [];

    @property(Node)
    containerItemsNode = [];

    //audios
    @property(AudioClip)
    truckStartAndMove : AudioClip = null!;
    @property(AudioClip)
    donationDone : AudioClip = null!;

    @property(AudioClip)
    buttonClick : AudioClip = null!;


    @property(Prefab)
    pausePopUpPrefab = new Prefab;

    @property(Prefab)
    gerenalFacts :Prefab = null!;



    start () {
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        gameManager.getInstance().setSceneType(SCENE_TYPE.GAME);
        gameManager.getInstance().setGameType(GAME_TYPE.LIVLIHOOD);
        this.donateableItemsInfo = gameManager.getInstance().getGameItems(GAME_TYPE.LIVLIHOOD);
        gameManager.getInstance().incrementUserHearts(gameManager.getInstance().getGameTimeHeart(gameManager.getInstance().getGameType()).hearts);
        this.HUDLayer = instantiate(this.HUDLayerPrefab); 
        this.node.addChild(this.HUDLayer);
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.setDelegate(this);
       
        this.dragable.item = instantiate(this.dragableItemPrefab); 
        this.bg.node.addChild(this.dragable.item);
        this.dragable.item.active = false;

        this.createDonateableItems();
        this.setUpTrucksInfo();
        this.setupContanerItems();
        
        this.touchEvents();
        this.createVoiceOver();
        this.addTouchRestriction();
        this.addPausePopUp();
        this.setUpFactsPopUp();


        // this.gereranlFactsLayer = instantiate(this.gerenalFacts);
        // this.gereranlFactsLayer.getComponent('GeneralFacts')!.setDelegate(this);
        // this.gereranlFactsLayer.getComponent('GeneralFacts')!.setUpQuestioniers();
        // this.gereranlFactsLayer.setSiblingIndex(10);
        // this.gereranlFactsLayer.active = false;
        // this.node.addChild(this.gereranlFactsLayer);
        // this.runTutorial();

        this.showFactsPopUp();
        // this.runTutorial();
    }

    setUpFactsPopUp(){
        this.factsPopUp = instantiate(this.factsPopUpPrefab);
        this.bg.node.addChild(this.factsPopUp);
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.loadAccomplishments();
        factPopUpScript!.updateHeading('حقائق عامة عن قطاع تحسين المستوى المعيشي');
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
        // console.log("VO DAta "+this.voiceOverData);
    }
    addTouchRestriction(){
        this.touchRestriction = instantiate(this.touchRestrictionPrefab);
        this.node.addChild(this.touchRestriction);
    }

    loadVideo(){

      
    }

    startTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.startTimer();
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
        this.boxFrames.forEach((itemFrame,index,aar) =>{

            let itemDetail = this.donateableItemsInfo.find(i=>i.type === this.boxType[index]);
            
            let item = instantiate(this.itemPrefab); 
            let itemScript:any = item.getComponent("Item");
            itemScript!.setDelegate(this);
            itemScript!.upateItemData(itemDetail,itemFrame);
            
            let positionY = (this.sideBarHeight!/aar.length)*(index + 0.5);
            let scaleValue = (this.sideBarHeight!/(aar.length+1.5))*0.8/item.getComponent(UITransform)?.contentSize.height!;
            item.setScale(new Vec3(scaleValue,scaleValue,scaleValue));
            item.position.y = positionY;

            let border = item.getChildByName('itemImage')?.getChildByName("border");
            border!.active = true;
            border!.getComponent(Sprite)!.color = itemDetail.color;
            
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

    setUpTrucksInfo(){
        this.truckFrames.forEach((spriteFrame,index,aar) =>{
            this.trucksInfo.push({ 
                type           : this.truckType[index],
                spriteFrame    : spriteFrame
            });
            this.trucksReady.push(this.truckType[index]);
        });
    }

    setupContanerItems(){
        this.containerItemsNode.forEach((node,index,aar) =>{
            this.containerItems.push({ 
                type           : this.truckType[index],
                requiredItem   : LIVLI_ITEM_TYPE.NONE,
                item           : node,
                itemCount      : 0,
                name           : `truck${index}`
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
        var eventLocation = event.getUILocation()
        if(this.canUpdateDragableItemData){
            for(var i =0; i < this.donateableItems.length; i++){
                if(this.donateableItems[i].item!.getComponent(UITransform)?.getBoundingBoxToWorld().contains(v3(eventLocation.x, eventLocation.y,0))){
                    this.updateDragableItemData(this.donateableItems[i],v3(eventLocation.x, eventLocation.y,0),);
                   
                    break;
                }
            }
        }
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
        switch(this.dragable.type){
            case LIVLI_ITEM_TYPE.FOOD :{
                this.generateRequest(LIVLI_CONTAINER_TYPE.FOOD_TRUCK,LIVLI_ITEM_TYPE.FOOD);
            }break;
            case LIVLI_ITEM_TYPE.CLOTHES :{
                this.generateRequest(LIVLI_CONTAINER_TYPE.CLOTHES_TRUCK,LIVLI_ITEM_TYPE.CLOTHES);
            }break;
            case LIVLI_ITEM_TYPE.WATER :{
                this.generateRequest(LIVLI_CONTAINER_TYPE.WATER_TRUCK,LIVLI_ITEM_TYPE.WATER);
            }break;
        }

        this.canDragItem = true;
        this.dragable.item.active =  true;
    }

    resetDragableItemData(){
        this.canDragItem = false;
        this.dragable.item.active =  false;
        this.requestFrom = LIVLI_CONTAINER_TYPE.NONE;
        this.requestedFor = LIVLI_ITEM_TYPE.NONE;
        
        this.dragable.donationTo = LIVLI_CONTAINER_TYPE.NONE;
        this.dragable.price = 0;
        this.dragable.name = "";
        this.dragable.type = LIVLI_ITEM_TYPE.NONE;
        this.canUpdateDragableItemData = true;
    }
    
    generateRequest(pRequestFrom:LIVLI_CONTAINER_TYPE,pRequestedFor:LIVLI_ITEM_TYPE){
        this.requestFrom  = pRequestFrom;
        this.requestedFor = pRequestedFor;

        this.dragable.donationTo = pRequestFrom;
        // console.log("requestFrom "+ pRequestFrom + "requestedFor" + pRequestedFor );
    }

    itemTouchMoveCallback(event: { getUILocation: () => any; }){
        var eventLocation = event.getUILocation();

        if(this.canDragItem){
            let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(eventLocation.x, eventLocation.y,0));
            this.dragable.item.position = newPosition;
            // this.dragable.item.position.y = newPosition.y * this.bg.node.getScale().y;
            // console.log("New position : " + newPosition);
        }
    }

    //MARK: touch end callback
    itemTouchEndCallback(event: { getStartLocation: () => any; }){
        
        var eventLocation = event.getStartLocation();

        if(this.canDragItem){
            // console.log("Node array "+this.containerItems);
            // console.log("Item array "+this.donateableItems);

            let item = this.containerItems.find(i => i.type === this.requestFrom);
            
            // let requestfromContainer = this.containerItems.find(i => i.type === this.requestFrom);
            let requestfromContainer = this.containerItems.filter(i => i.type == this.requestFrom);
            // console.log("requestfromContainer : " , requestfromContainer ,".");

           

            let {container , isDragableIntersectContainer} = this.checkDragableIntersectWith(requestfromContainer);

            if(!requestfromContainer.length || !container){
                this.putDragableItemBack();
            }

          
            let isRequiredItemDragged = (this.requestedFor === this.dragable.type);
            
            // container && console.log("container is ", container.name);
            if(!container){
                this.putDragableItemBack();
                return;
            }
            // let ifContainerFull = this.getItemCountInContainer(this.requestFrom) == this.getContainerItemCapacity(this.requestFrom);
            let ifContainerFull = container.itemCount == this.getContainerItemCapacity(this.requestFrom);

            // console.log("isRequiredItemDragged && isDragableIntersectContainer &&!ifContainerFull", isRequiredItemDragged && isDragableIntersectContainer &&!ifContainerFull)


            if( isRequiredItemDragged && isDragableIntersectContainer &&!ifContainerFull){
                
                // console.log("container Contains"+ this.dragable.name +" Cost you " + this.dragable.price);
                
                let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
                let HUDResponse= HUDLayerScript!.updateHearts(IN_GAME_CURR_OP.DECREASE, this.dragable.price);
                if(HUDResponse.error !== ""){
                    this.putDragableItemBack();
                    // console.log(HUDResponse.error);
                }else{
                    // console.log("check 1");
                    container.itemCount++;
                    
                    SoundManager.getInstance().playSoundEffect(this.donationDone);
                    // console.log("tem count", container.itemCount);
                    if(container.itemCount == this.getContainerItemCapacity(this.requestFrom)){
                        // console.log("check 2");
                        this.addToCompletedDonation(this.requestFrom,this.requestedFor);
                        this.moveTruck(container,this.requestFrom);
                    }
                    
                    this.resetDragableItemData();

                    if(HUDResponse.gameover){
                        this.pauseTimer();
                        this.noMoreHeartsLeft();
                    }
                }
                
            }
            else{
                
                this.putDragableItemBack();
                // console.log("container not ContainsItem");
            }
        }
    }

    putDragableItemBack(){
        this.canDragItem = false;
        let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(this.dragableItemInitPos!.x, this.dragableItemInitPos!.y,0));
        tween(this.dragable.item)
            .to(0.2, {position: newPosition})
            .call(()=>{this.resetDragableItemData();})
            .start();
    }

    checkDragableIntersectExcept(exclude : any| LIVLI_CONTAINER_TYPE){
        let dragableItemRect = this.dragable.item.getComponent(UITransform)?.getBoundingBoxToWorld();
        for(let i=0;i<this.containerItems.length;i++){
            if(this.containerItems[i].type !== exclude){
                let container = this.containerItems[i].item;
                let containerRect = container.getComponent(UITransform)?.getBoundingBoxToWorld();
                if(Intersection2D.rectRect(containerRect,dragableItemRect!)){
                    return true;
                }
            }
        }
        return false;
    }

    checkDragableIntersectWith(containers :any| Node){
        for(let container of containers){
            let position =  container.item!.getComponent(UITransform)?.convertToWorldSpaceAR(v3(container.item.x, container.item.y,0));
            let nodePos = this.bg.node!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(position.x, position.y,0));
            let rect = new math.Rect(nodePos?.x - container.item.width*0.5, nodePos?.y - container.item.height*0.5, container.item.width, container.item.height); 
            let rect2 = this.dragable.item.getComponent(UITransform)?.getBoundingBox();

            // TODO: remove this after testing
            // this.graphics.clear();
            // this.graphics2.clear();
            // this.graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
            // this.graphics2.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
            if(container.item && this.dragable.item && Intersection2D.rectRect(rect2,rect)){
                    container.item.getComponent(UITransform)?.getBoundingBoxToWorld();
                    // this.graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
                    // this.graphics2.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
                    return {
                        "container" : container,
                        "isDragableIntersectContainer" : true
                    }
                }
                
        }
         return {
                "container" : null,
                "isDragableIntersectContainer" : false
        }
    }

    timePaused(){
        this.touchRestriction.active = true;
        this.showPausePopUp(true);
        // console.log("Call back from prefab");
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

    onItemButtonClick(){
        // console.log("Item Button click");
    }

    moveTruck(container :any| Node,truckType:LIVLI_CONTAINER_TYPE){

        // console.log("ready trucks before : "+this.trucksReady);
        this.trucksReady.splice(this.trucksReady.indexOf(truckType),1);
        // console.log("ready trucks after : "+this.trucksReady);
        let moveToPos = container.item.parent.getChildByName("MoveTo").position;
        let initPos = container.item.parent.getChildByName("initPos").position;
        SoundManager.getInstance().playSoundEffect(this.truckStartAndMove);
        tween(container.item)
            .delay(2)
            .to(4, {position: new Vec3(moveToPos!.x, moveToPos!.y,0)})
            .call(()=>{this.setRandomTruck(container);})
            .to(0, {position: new Vec3(initPos!.x, initPos!.y,0)})
            .call(()=>{this.setItemCountInContainer(truckType,0);})
            .start();
    }

    setRandomTruck(container:any| Node){

        let availableTruckTypes = this.truckType.filter(e => !this.trucksReady.includes(e));
        // console.log("Available trucks : " + availableTruckTypes);
        var randomType:LIVLI_CONTAINER_TYPE = availableTruckTypes[Math.floor(Math.random()*availableTruckTypes.length)];
        // console.log("randomType : " + randomType);

        var randomTruckData:Truck|any = this.trucksInfo.find(i=>i.type == randomType);
        container.item.getChildByName("Sprite").getComponent(Sprite).spriteFrame = randomTruckData.spriteFrame;
        container.type = randomTruckData.type;
        container.itemCount = 0;
        this.trucksReady.push(randomTruckData.type);
        // console.log(container.type);
    }



    gameOver(){
        this.touchRestriction.active = true;
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        let heartsConsumed = HUDLayerScript!.getHeartsConsumed();
        let amount = heartsConsumed < 100 ? [heartsConsumed] : [Math.floor(heartsConsumed/100) * 100, heartsConsumed%100];
        let result = amount.map(( name:string ) => ResourceUtils.getInstance().getAudioClip(name)).filter(item => item!=null);
        let waitAfterAmount = result.map(clip => clip?.getDuration()).reduce((a, b) => a! + b!, 0)

        if(this.donationsDone.length >0){
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
                let advancement = ResourceUtils.getInstance().getAudioClip("HeartsWord");
                SoundManager.getInstance().playSoundEffect(advancement!);
            
            })
            .delay(1)
            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("fullOf");
                SoundManager.getInstance().playSoundEffect(youDonated!);
                
            })
            .delay(7.9)
            /*.call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("toVulnerable");
                SoundManager.getInstance().playSoundEffect(youDonated!);
                
            })
            .delay(3.2)*/
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
        if(this.donationsDone.length >0){
            director.loadScene("gameSummary");
        }
        else{
            director.loadScene("accomplishment");
        }
    }

    addToCompletedDonation(donationTo:LIVLI_CONTAINER_TYPE,itemDonated:LIVLI_ITEM_TYPE){
        this.donationsDone.push({
            "requestFrom"  : donationTo,
            "requestedFor" : itemDonated,
        });
    }
    createSummary(){
        let clothesTruckCount:number = 0;
        let waterTruckCount:number = 0;
        let foodTruckCount:number = 0;

        this.donationsDone.forEach((donation:any) => {
            switch (donation.requestFrom){
                case LIVLI_CONTAINER_TYPE.CLOTHES_TRUCK:{
                    clothesTruckCount++;
                }break;
                case LIVLI_CONTAINER_TYPE.WATER_TRUCK:{
                    waterTruckCount++;
                }break;
                case LIVLI_CONTAINER_TYPE.FOOD_TRUCK:{
                    foodTruckCount++;
                }break;
            }
        });

        if(clothesTruckCount>0){
            this.gameSummary.push(`شاحنة معبأة بالملابس ${clothesTruckCount}`);
        }
        if(waterTruckCount>0){
            this.gameSummary.push(`شاحنة معبأة بالماء ${waterTruckCount}`);
        }
        if(foodTruckCount>0){
            this.gameSummary.push(`شاحنة معبأة بالطعام ${foodTruckCount}`);
        }

        gameManager.getInstance().setGameSummary(this.gameSummary);
    }

    getContainerItemCapacity(container:LIVLI_CONTAINER_TYPE){
        let capacity:number = 0;
        switch (container){
            case LIVLI_CONTAINER_TYPE.CLOTHES_TRUCK:{
                capacity = 2;
            }break;
            case LIVLI_CONTAINER_TYPE.WATER_TRUCK:{
                capacity = 2;
            }break;
            case LIVLI_CONTAINER_TYPE.FOOD_TRUCK:{
                capacity = 2;
            }break;
        }
        return capacity;
    }
    setItemCountInContainer(container:LIVLI_CONTAINER_TYPE,count:number){
        switch (container){
            case LIVLI_CONTAINER_TYPE.CLOTHES_TRUCK:{
                this.clothesBoxCount = count;
            }break;
            case LIVLI_CONTAINER_TYPE.WATER_TRUCK:{
                this.waterBoxCount = count;
            }break;
            case LIVLI_CONTAINER_TYPE.FOOD_TRUCK:{
                this.foodBoxCount = count;
            }break;
        }
    }
    getItemCountInContainer(container:LIVLI_CONTAINER_TYPE){
        let count:number = 0;

        switch (container){
            case LIVLI_CONTAINER_TYPE.CLOTHES_TRUCK:{
                count = this.clothesBoxCount;
            }break;
            case LIVLI_CONTAINER_TYPE.WATER_TRUCK:{
                count = this.waterBoxCount;
            }break;
            case LIVLI_CONTAINER_TYPE.FOOD_TRUCK:{
                count = this.foodBoxCount;
            }break;
        }
        return count;
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
        let itemInHand:Node = instantiate(this.itemInHandPrefab);
        this.bg.node.addChild(itemInHand);
        itemInHand.active = false;
        
        let tutorial1InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[0].item.getChildByName("itemImage"));
        let tutorial1EndPos = this.getPositionOnBG(this.containerItems[2].item); 
        let tutorial1SpriteFrame:SpriteFrame = this.donateableItems[0].item!.getComponent("Item").getItemImage();

        let tutorial2InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[1].item.getChildByName("itemImage"));
        let tutorial2EndPos = this.getPositionOnBG(this.containerItems[1].item); 
        let tutorial2SpriteFrame:SpriteFrame = this.donateableItems[1].item!.getComponent("Item").getItemImage();

        let tutorial3InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[2].item.getChildByName("itemImage"));
        let tutorial3EndPos = this.getPositionOnBG(this.containerItems[0].item); 
        let tutorial3SpriteFrame:SpriteFrame = this.donateableItems[2].item!.getComponent("Item").getItemImage();

        tween(itemInHand)
            .call(()=>{
                this.updateVoiceOverMessage(this.voiceOverData.introduction);
                this.voiceOver.active = true;
                let clip = ResourceUtils.getInstance().getGameResources("LiveliHood", "Vo1");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(8)
            .call(()=>{
                this.voiceOver.active = false;
                itemInHand.active = true;
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial1SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial1InitPos!.x, tutorial1InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial1EndPos!.x, tutorial1EndPos!.y,0)})
            .call(()=>{
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial2SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial2InitPos!.x, tutorial2InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial2EndPos!.x, tutorial2EndPos!.y,0)})
            .call(()=>{
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial3SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial3InitPos!.x, tutorial3InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial3EndPos!.x, tutorial3EndPos!.y,0)})
            .call(()=>{
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.active = false;
                let clip = ResourceUtils.getInstance().getGameResources("LiveliHood", "Vo2");
                clip && SoundManager.getInstance().playSoundEffect(clip);
                this.updateVoiceOverMessage(this.voiceOverData.tutorial);
                this.voiceOver.active = true;   
            })
            .delay(10.5)
            .call(()=>{
               
                let clip =ResourceUtils.getInstance().getAudioClip("threeTwoOne");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(0.1)
            .call(()=>{
                this.InactiveActivePopUp(false);
                this.updateVoiceOverCountDown("3");
            })
            .delay(0.9)
            .call(()=>{
                this.updateVoiceOverCountDown("2");
            })
            .delay(0.9)
            .call(()=>{
                this.updateVoiceOverCountDown("1");
            })
            .delay(0.9)
            .call(()=>{
                this.updateVoiceOverCountDown("!انطلق  ");
            })
            .delay(1)
            .call(()=>{
                this.InactiveActivePopUp(true);
                this.voiceOver.active = false;
                // this.touchRestriction.active = false;
                this.startTimer(); 
                // this.showFactsPopUp();
                let clip = ResourceUtils.getInstance().getGameResources("LiveliHood", "music");
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

    onReload(){
        director.loadScene('education');
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

    playResultVoiceOver(audioClips : any){
        let your = ResourceUtils.getInstance().getAudioClip("your");
        let result = audioClips.map( ( name:string ) => ResourceUtils.getInstance().getAudioClip(name));
        let sectorHelp = ResourceUtils.getInstance().getAudioClip("sectorHelp");
        if(audioClips.length == 1){
            tween(this.node).call(()=> SoundManager.getInstance().playSoundEffect(your))
           .delay(1).call(()=>{
                SoundManager.getInstance().playSoundEffect(result[0]);
            }).delay(1).call(()=>{

                
                SoundManager.getInstance().playSoundEffect(sectorHelp);
            }).start();
        }else{
            tween(this.node)
            .call(()=>{
                SoundManager.getInstance().playSoundEffect(your);})
            .delay(2).call(()=> SoundManager.getInstance().playSoundEffect(result[0]))
            .delay(2).call(()=> SoundManager.getInstance().playSoundEffect(result[1]))
            .delay(2).call(()=>{
                SoundManager.getInstance().playSoundEffect(sectorHelp);
            }).start();
        }
        
    }


    playAudios(index : number, audioClips : any){
        if(index >= audioClips.length || audioClips.length ==0 ){
            // tween.stop();
            return;
        }else{

            let wait = audioClips[index].getDuration();
            // console.log("wait", index, wait);
            tween(this.node).call(()=>SoundManager.getInstance().playSoundEffect(audioClips[index]))
            .delay(wait).call(()=> this.playAudios(index+1, audioClips))
            .start();
        }
    }

    startQuiz(){
        // console.log('inside this start quiz',this.gereranlFactsLayer )
        this.gereranlFactsLayer.active  = true;
    }


    onFactEnd(){
        this.gereranlFactsLayer.active  = false;
        this.onResume();
    }


}