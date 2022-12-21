import { _decorator, Prefab, Component,instantiate, Node, Sprite, v2, v3, UITransform, SpriteFrame , Intersection2D, Vec3, Enum, AudioClip, AudioSource, Widget, tween, director, Label, Graphics, Animation} from 'cc';
const  { ccclass, property } = _decorator;
import { gameManager,DonateableItem, GAME_TYPE, SCENE_TYPE,EDU_ITEM_TYPE,EDU_CONTAINER_TYPE, IN_GAME_CURR_OP}  from '../common/managers/gameManager'; 
import { ResourceUtils } from '../common/managers/ResourceUtils';
import { SoundManager } from '../common/managers/SoundManager';
import {getVoiceOvers} from '../common/strings';

class itemCount
{
  public type   : EDU_ITEM_TYPE | undefined | any;
  public count  : number | undefined;
}

class Request
{
    public from           : EDU_CONTAINER_TYPE | undefined;
    public for            : EDU_ITEM_TYPE | undefined;
    public generateTime   : Date|undefined;
    public weNeedPopUp    : Node | undefined | any;
}

class Country
{
    public type           : EDU_CONTAINER_TYPE | undefined;
    public requiredItem   : EDU_ITEM_TYPE | undefined;
    public item           : Node | undefined | any;
    public donationInfo   : Array<itemCount> | undefined;
}

@ccclass('Education')
export class Education extends Component {

    HUDLayer            : Node = null!;
    voiceOver           : Node = null!;
    factsPopUp          : Node = null!;
    pausePopUp          : Node = null!;
    touchRestriction    : Node = null!;
    gereranlFactsLayer  : Node = null!;
    
    voiceOverData:any;
    sideBarHeight :number|undefined;
    
    totalRequestsAtTime:number = 3;
    schoolCount:number = 0;
    donateableItemsInfo = new Array();
    
    donateableItems     : Array<DonateableItem> = new Array();
    countries           : Array<Country>        = new Array();
    donationRequests    : Array<Request>        = new Array();
    gameSummary         : Array<string>         = new Array();
    donationToCountries : Array<string>         = new Array();

    dragable = new DonateableItem();
    canDragItem = false;
    canUpdateDragableItemData = true;
    dragableItemInitPos :Vec3|undefined;

    requestFrom  : EDU_CONTAINER_TYPE = EDU_CONTAINER_TYPE.NONE;
    requestedFor : EDU_ITEM_TYPE = EDU_ITEM_TYPE.NONE;

    @property(Sprite)    map = new Sprite;
    @property(Sprite)    bg = new Sprite;
    @property(Sprite)    sideBar = new Sprite;

    @property(Prefab)    voiceOverPrefab        :Prefab = null!;
    @property(Prefab)    touchRestrictionPrefab :Prefab = null!;
    @property(Prefab)    HUDLayerPrefab         :Prefab = null!;
    @property(Prefab)    itemPrefab             :Prefab = null!;
    @property(Prefab)    itemInHandPrefab       :Prefab = null!;
    @property(Prefab)    dragableItemPrefab     :Prefab = null!;
    @property(Prefab)    weNeedPopUpPrefab      :Prefab = null!;
    @property(Prefab)    errorPopUpPrefab       :Prefab = null!;
    @property(Prefab)    factsPopUpPrefab       :Prefab = null!;
    @property(Prefab)    gerenalFacts           :Prefab = null!;
    @property(Prefab)    pausePopUpPrefab       :Prefab = null!;

    @property(SpriteFrame) itemFrames = [];
    @property(Node)        containerItemsNode = [];

    @property({type : Enum(EDU_ITEM_TYPE)})    itemType   = new Array;
    @property({type : Enum(EDU_CONTAINER_TYPE)})    containerType   = [];

    counteriesRequesting:Array<EDU_CONTAINER_TYPE> = new Array;
    counteriesRequestingFor:Array<EDU_ITEM_TYPE> = new Array;

    @property(AudioClip)    donationDone : AudioClip = null!;
    @property(AudioClip)    buttonClick : AudioClip = null!;
    @property(Graphics)    graphics2 : Graphics = null!;

    start () {
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        gameManager.getInstance().setSceneType(SCENE_TYPE.GAME);
        gameManager.getInstance().setGameType(GAME_TYPE.EDUCATION);
        this.donateableItemsInfo = gameManager.getInstance().getGameItems(GAME_TYPE.EDUCATION);
        gameManager.getInstance().incrementUserHearts(gameManager.getInstance().getGameTimeHeart(gameManager.getInstance().getGameType()).hearts);

        this.HUDLayer = instantiate(this.HUDLayerPrefab); 
        this.node.addChild(this.HUDLayer);
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.setDelegate(this);

        this.dragable.item = instantiate(this.dragableItemPrefab); 
        this.bg.node.addChild(this.dragable.item);
        this.dragable.item.active = false;

        this.setUpDonateableItems();
        this.setUpCountries();
        this.touchEvents();
        this.createVoiceOver();
        this.addTouchRestriction();
        this.addPausePopUp();
        this.setUpFactsPopUp();

        this.showFactsPopUp();
        // this.runTutorial();z
    }

    setUpFactsPopUp(){
        this.factsPopUp = instantiate(this.factsPopUpPrefab);
        this.bg.node.addChild(this.factsPopUp);
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.loadAccomplishments();
        factPopUpScript!.setDelegate(this);
        factPopUpScript!.updateHeading(':حقائق عامة عن قطاع التعليم');
        this.factsPopUp.active = false;
    }

    showFactsPopUp(){
        this.pauseTimer();
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.showFact();
    }

    addRequest(){
        let counteriesNotRequesting = this.containerType.filter(e => !this.counteriesRequesting.includes(e));
        var randomCountryType:EDU_CONTAINER_TYPE = counteriesNotRequesting[Math.floor(Math.random()*counteriesNotRequesting.length)];
        this.counteriesRequesting.push(randomCountryType);
        
        // var loop:boolean = false;
        // do{
        let counteriesNotRequestingFor = this.itemType.filter(e => !this.counteriesRequestingFor.includes(e));
        var randomItemType:EDU_ITEM_TYPE = counteriesNotRequestingFor[Math.floor(Math.random()*counteriesNotRequestingFor.length)];

        // if(randomItemType == EDU_ITEM_TYPE.SCHOOL){
        //     loop = true;
        //     this.schoolCount++;
        //     console.log(this.schoolCount);
        //     if(this.schoolCount == 1000)
        //     {
        //         loop = false;
        //         this.schoolCount = 0;
        //     }
        // }
        
        // }while(loop);
        if(randomItemType == EDU_ITEM_TYPE.SCHOOL){

            this.schoolCount++;

            if(this.schoolCount == 2)
                this.itemType.splice(this.itemType.indexOf(EDU_ITEM_TYPE.SCHOOL),1);
        }

        this.counteriesRequestingFor.push(randomItemType);
        
        this.donationRequests.push({
            from : randomCountryType,
            for  : randomItemType,
            generateTime : new Date(), 
            weNeedPopUp : this.addWeNeedPopUp(randomCountryType,randomItemType)
        });
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
        this.touchRestriction.setSiblingIndex(10);
    }
    
    startTimer(){
        for(let i=0; i< this.totalRequestsAtTime;i++){
            this.addRequest();
            this.schedule(this.requestTimeUp, 0.5);
        }
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

    setUpDonateableItems(){

        this.sideBarHeight = this.sideBar.getComponent(UITransform)?.contentSize.height;
        this.itemFrames.forEach((itemFrame,index,aar) =>{

            let itemDetail = this.donateableItemsInfo.find(i=>i.type === this.itemType[index]);
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
                donationTo      : EDU_CONTAINER_TYPE.NONE, 
                item            : item,
                price           : itemDetail.price,
                name            : itemDetail.name
            });
        });
    }

    setUpCountries(){
        this.containerItemsNode.forEach((node,index,aar) =>{
            this.countries.push({ 
                type           : this.containerType[index],
                requiredItem   : EDU_ITEM_TYPE.NONE,
                item           : node,
                donationInfo   : []
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

        this.unschedule(this.requestTimeUp);

        this.canUpdateDragableItemData = false;
        this.dragable.item.getComponent(Sprite)!.spriteFrame =  itemData.item!.getComponent("Item").getItemImage();
        this.dragable.item.setScale(itemData.item!.getComponent("Item").getItemImageScale());
        this.dragable.item.position = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(pos);
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
        
        this.dragable.donationTo = EDU_CONTAINER_TYPE.NONE;
        this.dragable.price = 0;
        this.dragable.name = "";
        this.dragable.type = EDU_ITEM_TYPE.NONE;
        this.canUpdateDragableItemData = true;

        this.schedule(this.requestTimeUp, 0.5);
    }
    
    addWeNeedPopUp(addto:EDU_CONTAINER_TYPE|any,add:EDU_ITEM_TYPE|any){
        let requestfromContainer = this.countries.find(i => i.type === addto)?.item;
        let requestedForContainer = this.donateableItems.find(i => i.type === add)?.item;
        let requestedItemImage:any = requestedForContainer!.getComponent("Item").getItemImage();

        let weNeedPopUp = instantiate(this.weNeedPopUpPrefab);

        let item:any =  weNeedPopUp.getChildByName("item")?.getComponent(Sprite);
        item.spriteFrame = requestedItemImage;

        let text:Label|any = weNeedPopUp.getChildByName("text")?.getComponent(Label);
        text.string = "نحن بحاجة إلى\n"+ this.getItemNameForWeNeed(add);
        // let scaleValue = (this.sideBarHeight!/(aar.length+1.5))*0.8/item.getComponent(UITransform)?.contentSize.height!;
        // item.setScale(new Vec3(scaleValue,scaleValue,scaleValue));

        weNeedPopUp.position = new Vec3(0,0,0);
        requestfromContainer.addChild(weNeedPopUp);

        weNeedPopUp.getComponent(Animation)?.play('weNeedEnter');

        return weNeedPopUp;
        // let Position = this.map.getComponent(UITransform)?.convertToWorldSpaceAR(xxxx.position);
        // Position = this.bg.getComponent(UITransform)?.convertToNodeSpaceAR(Position!);
    }

    itemTouchMoveCallback(event: { getUILocation: () => any; }){
        var eventLocation = event.getUILocation();

        if(this.canDragItem){
            let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(eventLocation.x, eventLocation.y,0));
            this.dragable.item.position = newPosition;
        }
    }

    itemTouchEndCallback(event: { getStartLocation: () => any; }){
        
        var eventLocation = event.getStartLocation();

        if(this.canDragItem){
            let request:Request|any = this.donationRequests.find(i => i.for === this.dragable.type);
            let country:Country|undefined = this.countries.find(i => i.type === request?.from);
            let requestfromContainer = country?.item;
            let isDragableIntersectContainer = this.checkDragableIntersectWith(requestfromContainer);
            let isDragableIntersectOther = false;//this.checkDragableIntersectExcept(request?.from);
            let isRequiredItemDragged = true;//(this.requestedFor === this.dragable.type);

            if(!isDragableIntersectOther && isRequiredItemDragged && isDragableIntersectContainer ){     
                let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
                let HUDResponse= HUDLayerScript!.updateHearts(IN_GAME_CURR_OP.DECREASE, this.dragable.price);
                if(HUDResponse.error !== ""){
                    this.putDragableItemBack();
                    if("لا تملك قلوبا كافية لشراء هذا الشيء"==HUDResponse.error){
                        this.showErrorPopUp(String("لا تكلك قلوبا كافية للتبرع ب"+this.getItemNameForWeNeed(this.dragable.type)));
                    }
                }else{

                    SoundManager.getInstance().playSoundEffect(this.donationDone);
                    
                    

                    let donation = country?.donationInfo?.find(item => item.type == this.dragable.type);
                    if(donation){
                        donation.count!++;
                    }
                    else{
                        country?.donationInfo?.push({
                            type : this.dragable.type,
                            count : 1
                        });
                    }

                    tween(this.bg)
                    .call(()=>{
                        requestfromContainer.getChildByName("weNeedPopUp")?.getComponent(Animation)?.play('weNeedExit');
                        this.resetDragableItemData();
                    })
                    .delay(0.2)
                    .call(()=>{
                        var weNeedPopUp:Node = requestfromContainer.getChildByName("weNeedPopUp");
                        while(weNeedPopUp){
                            weNeedPopUp.removeFromParent();
                            weNeedPopUp = requestfromContainer.getChildByName("weNeedPopUp");
                        }

                        this.createNewRequest(request);
                    })
                    .start();

                    if(HUDResponse.gameover){

                        HUDLayerScript!.pauseTimer();
                        this.noMoreHeartsLeft();
                    }
                }
                
            }
            else{
                this.putDragableItemBack();
            }
        }
    }

    showErrorPopUp(Message:String){

        let erroPopUp = instantiate(this.errorPopUpPrefab);
        let text:Label|any = erroPopUp.getChildByName("message")?.getComponent(Label);
        text.string = Message;
        this.bg.node.addChild(erroPopUp);
        tween(this.node)
            .delay(2)
            .call(()=>{
                erroPopUp.removeFromParent();
            })
            .start();
    }

    createNewRequest(deleteRequest:Request|any){
        this.counteriesRequestingFor.splice(this.counteriesRequestingFor.indexOf(deleteRequest?.for!),1);
        this.counteriesRequesting.splice(this.counteriesRequesting.indexOf(deleteRequest?.from!),1);
        this.donationRequests.splice(this.donationRequests.indexOf(deleteRequest),1);
        this.addRequest();
    }

    requestTimeUp(){

        // if(!this.dragable.item.active){
            var currentTime:Date = new Date();
            this.donationRequests.forEach((Request) => {
                var seconds = (currentTime.getTime() - Request.generateTime!.getTime()) / 1000; 
                if(seconds > 2){
                    tween(this.bg)
                    .call(()=>{
                        Request.weNeedPopUp.getComponent(Animation)?.play('weNeedExit');
                    })
                    .delay(0.2)
                    .call(()=>{
                        if(Request.weNeedPopUp){
                            Request.weNeedPopUp.removeFromParent();
                            this.createNewRequest(Request);
                        }
                    })
                    .start();
                }
            });
        // }
    }

    putDragableItemBack(){
        this.canDragItem = false;
        let newPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(this.dragableItemInitPos!.x, this.dragableItemInitPos!.y,0));
        tween(this.dragable.item)
            .to(0.2, {position: newPosition})
            .call(()=>{this.resetDragableItemData();})
            .start();
    }

    checkDragableIntersectExcept(exclude : any| EDU_CONTAINER_TYPE){
        let dragableItemRect = this.dragable.item.getComponent(UITransform)?.getBoundingBoxToWorld();
        for(let i=0;i<this.countries.length;i++){
            if(this.countries[i].type !== exclude){
                let container = this.countries[i].item;
                let containerRect = container.getComponent(UITransform)?.getBoundingBoxToWorld();
                if(Intersection2D.rectRect(containerRect,dragableItemRect!)){
                    return true;
                }
            }
        }
        return false;
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

    onItemButtonClick(){
    }

    gameOver(){

        this.unschedule(this.requestTimeUp);

        this.touchRestriction.active = true;
        let countries:string="";
      //  this.donationToCountries.forEach((countryName,index,arr)=>{
      //      countries = countries + countryName;
      //      if(index+1 < arr.length){
       //         countries = countries + ", ";
       //     }
      //  });
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        let heartsConsumed = HUDLayerScript!.getHeartsConsumed();
        let amount = heartsConsumed < 100 ? [heartsConsumed] : [Math.floor(heartsConsumed/100) * 100, heartsConsumed%100];
        let result = amount.map(( name:string ) => ResourceUtils.getInstance().getAudioClip(name)).filter(item => item!=null);
        let waitAfterAmount = result.map(clip => clip?.getDuration()).reduce((a, b) => a! + b!, 0)
        let cRsult = this.donationToCountries.map(( name:string ) => ResourceUtils.getInstance().getCountryClip(name));
        let dureations = cRsult.map(clip => clip?.getDuration())
        let waitTime = dureations.reduce((a, b) => a! + b!, 0)
        // console.log({waitAfterAmount, waitTime});
        if(amount[0] > 0){
        tween(this.node)
            .call(()=>{
                var str =this.voiceOverData.end;
                gameManager.getInstance().setLastScore(heartsConsumed);
                str = str.replace("xxx", String(heartsConsumed));               
                str = str.replace("yyy", countries);
                this.updateVoiceOverMessage(str);
                this.voiceOver.active = true;   
                let goodjob = ResourceUtils.getInstance().getAudioClip("GoodJob");
                SoundManager.getInstance().playSoundEffect(goodjob!);
            })
            .delay(3)
            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("youDonated");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(1.5)
            .call(()=>{
                this.playAudios(0,result);
            })
            .delay(2)

            
            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("HeartsWord");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(1)

            .call(()=>{
                let advancement = ResourceUtils.getInstance().getAudioClip("toHelp");
                SoundManager.getInstance().playSoundEffect(advancement!);
            })
            .delay(11.6)
            /*.call(()=>{
               let advancement1 = ResourceUtils.getInstance().getAudioClip("toReceive");
                SoundManager.getInstance().playSoundEffect(advancement1!);
             })
            .delay(3)*/
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
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        if(HUDLayerScript!.getHeartsConsumed() > 0){
            director.loadScene("gameSummary");
        }
        else{
            director.loadScene("accomplishment");
        }
    }

    createSummary(){
        this.countries.forEach((country:Country)=>{
            /////////////Backup code////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // let countryName:string|any = this.getCountyName(country.type);
            // let summaryText:string = "You donated ";
            // country.donationInfo!.forEach((info,index,arr) => {
            //      if(info.count!>1){
            //         summaryText = summaryText + ` ${info.count} ${this.getItemNameForSummary(info.type)}` + "s " ;
            //     }else{
            //         summaryText = summaryText + ` ${info.count} ${this.getItemNameForSummary(info.type)}`  ;
            //     }
            //     if(index +1 < arr.length){
            //         summaryText = summaryText + ','
            //     }
                
            // });
            // summaryText = summaryText +` to help underprivileged students in  ${countryName}`;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            let countryName:string|any = this.getCountyName(country.type);
            let summaryText:string = "";//"You donated ";
            country.donationInfo!.forEach((info,index,arr) => {
                 if(info.count!>1){
                    summaryText = summaryText + `${this.getItemNameForSummary(info.type)} ${info.count}`.replace("TTT","");
                }else{
                    summaryText = summaryText + `${this.getItemNameForSummary(info.type)} ${info.count}`.replace("TTT","");
                }
                summaryText = summaryText +` في ${countryName}\n`;
                if(index +1 < arr.length){
                    summaryText = summaryText 
                }
            });
            //summaryText = summaryText +` to help underprivileged students in  ${countryName}`;



            if(country.donationInfo?.length!>0){
                this.gameSummary.push(summaryText);
              //  this.donationToCountries.push(countryName);
            }
        });

        gameManager.getInstance().setGameSummary(this.gameSummary);
    }

    getCountyName(countryType:EDU_CONTAINER_TYPE|undefined){
        switch(countryType){
            case EDU_CONTAINER_TYPE.ALGERIA : return "الجزائر";
            case EDU_CONTAINER_TYPE.EGYPT : return "مصر";
            case EDU_CONTAINER_TYPE.IRAQ : return "العراق";
            case EDU_CONTAINER_TYPE.LIBYA : return "ليبيا";
            case EDU_CONTAINER_TYPE.MORROCO : return "المغرب";
            case EDU_CONTAINER_TYPE.OMAN : return "عمان";
            case EDU_CONTAINER_TYPE.SAUDIARABIA : return "المملكة العربية السعودية";
            case EDU_CONTAINER_TYPE.SYRIA : return "سوريا";
            case EDU_CONTAINER_TYPE.UAE : return "الامارات";
            case EDU_CONTAINER_TYPE.YEMEN : return "اليمن";
            case EDU_CONTAINER_TYPE.PALESTINE : return "فلسطين";
            case EDU_CONTAINER_TYPE.PAKISTAN : return "باكستان";
            case EDU_CONTAINER_TYPE.INDIA : return "الهند";
        }
    }

    getItemNameForSummary(countryType:EDU_ITEM_TYPE|undefined){
        switch(countryType){
            case EDU_ITEM_TYPE.BOOK : return "كتاب دراسي و قرطاسية لإحدى المدارس";
            case EDU_ITEM_TYPE.COMPUTER : return "حاسوب لإحدى المدارس";
            case EDU_ITEM_TYPE.FURNITURE : return "قطعة أثاث مدرسي لإحدى المدارس";
            case EDU_ITEM_TYPE.SCHOOL : return "مبنى دراسي ";
        }
    }
    
    getItemNameForWeNeed(countryType:EDU_ITEM_TYPE|undefined|any){
        switch(countryType){
            case EDU_ITEM_TYPE.BOOK : return "كتب";
            case EDU_ITEM_TYPE.COMPUTER : return "حواسيب";
            case EDU_ITEM_TYPE.FURNITURE : return "قطع أثاث";
            case EDU_ITEM_TYPE.SCHOOL : return "مدارس";
        }
    }

    getPositionOnBG(item:Node){
        let rect:any = item.getComponent(UITransform)?.getBoundingBoxToWorld();
      
        let testingPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(rect.x + rect.width * 0.5, rect.y + rect.height*0.5,0));
        return testingPosition;
    }

    getDonatbleItemPositionOnBG(item:Node){
        let rect2 :any =  item.getComponent(UITransform)?.getBoundingBoxToWorld();
        let testingPosition = this.bg!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(rect2.x + rect2.width * 0.5 ,rect2.y + rect2.height * 0.5 ,0));

        // console.log({testingPosition});
        // this.graphics2.fillRect(testingPosition.x, testingPosition.y, rect2.width,rect2.width);
        return testingPosition;
    }

    runTutorial(){
        let country1:number = 0;
        let country2:number = 2;
        let country3:number = 4;
      
        this.addWeNeedPopUp(this.countries[country1].type,this.donateableItems[0].type);
        this.addWeNeedPopUp(this.countries[country2].type,this.donateableItems[1].type);
        this.addWeNeedPopUp(this.countries[country3].type,this.donateableItems[2].type);

        let itemInHand:Node = instantiate(this.itemInHandPrefab);
        this.node.addChild(itemInHand);
        itemInHand.active = false;
        
        let tutorial1InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[0].item.getChildByName("itemImage"));
        let tutorial1EndPos = this.getPositionOnBG(this.countries[country1].item); 
        let tutorial1SpriteFrame:SpriteFrame = this.donateableItems[0].item!.getComponent("Item").getItemImage();

        let tutorial2InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[1].item.getChildByName("itemImage"));
        let tutorial2EndPos = this.getPositionOnBG(this.countries[country2].item); 
        let tutorial2SpriteFrame:SpriteFrame = this.donateableItems[1].item!.getComponent("Item").getItemImage();

        let tutorial3InitPos = this.getDonatbleItemPositionOnBG(this.donateableItems[2].item.getChildByName("itemImage"));
        let tutorial3EndPos = this.getPositionOnBG(this.countries[country3].item); 
        let tutorial3SpriteFrame:SpriteFrame = this.donateableItems[2].item!.getComponent("Item").getItemImage();

        tween(itemInHand)
            .call(()=>{
                this.updateVoiceOverMessage(this.voiceOverData.introduction);
                this.voiceOver.active = true;
                let clip = ResourceUtils.getInstance().getGameResources("Education", "Vo1");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(7)
            .call(()=>{
                this.voiceOver.active = false;
                itemInHand.active = true;
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial1SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial1InitPos!.x, tutorial1InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial1EndPos!.x, tutorial1EndPos!.y,0)})
            .call(()=>{
                this.countries[country1].item.getChildByName("weNeedPopUp")?.removeFromParent();
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial2SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial2InitPos!.x, tutorial2InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial2EndPos!.x, tutorial2EndPos!.y,0)})
            .call(()=>{
                this.countries[country2].item.getChildByName("weNeedPopUp")?.removeFromParent();
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.getComponent(Sprite)!.spriteFrame = tutorial3SpriteFrame;
            })
            .to(0, {position: new Vec3(tutorial3InitPos!.x, tutorial3InitPos!.y,0)})
            .to(2, {position: new Vec3(tutorial3EndPos!.x, tutorial3EndPos!.y,0)})
            .call(()=>{
                this.countries[country3].item.getChildByName("weNeedPopUp")?.removeFromParent();
                SoundManager.getInstance().playSoundEffect(this.donationDone);
                itemInHand.active = false;
                this.updateVoiceOverMessage(this.voiceOverData.tutorial);
                let clip = ResourceUtils.getInstance().getGameResources("Education", "Vo2");
                clip && SoundManager.getInstance().playSoundEffect(clip);
                this.voiceOver.active = true;   
            })
            .delay(13.4)
            .call(()=>{
                this.InactiveActivePopUp(false);
                let clip =ResourceUtils.getInstance().getAudioClip("threeTwoOne");
                clip && SoundManager.getInstance().playSoundEffect(clip);
            })
            .delay(0.1)
            .call(()=>{
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
                // this.touchRestriction.active = false;
                this.startTimer(); 
                // this.showFactsPopUp();
                let clip = ResourceUtils.getInstance().getGameResources("Education", "music");
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

    showPausePopUp(isPause : boolean){
        this.pausePopUp.getComponent('Popup')!.changeButtonState(isPause);
        this.pausePopUp.active = true;
    }

    onDestroy(){
        SoundManager.getInstance().stopMusic();
    }

    playAudios(index : number, audioClips : any){
        // console.log("play Audiop", index, audioClips);
        if(index >= audioClips.length || audioClips.length ==0 ){
            // tween.stop();
            return;
        }else{

            let wait = audioClips[index].getDuration();
            // console.log("play next clip", index, wait);
            tween(this.node).call(()=>SoundManager.getInstance().playSoundEffect(audioClips[index]))
            .delay(wait).call(()=> this.playAudios(index+1, audioClips))
            .start();
        }
    }
}