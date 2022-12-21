
import {
    _decorator, instantiate,
    Component, Node, PhysicsSystem2D,
    EPhysics2DDrawFlags, Vec2, PHYSICS_2D_PTM_RATIO,
    Contact2DType, Collider2D, IPhysics2DContact,
    Prefab, SpriteFrame, UITransform, v3, Vec3, v2, tween, Intersection2D, Sprite, RigidBody, RigidBody2D, NodePool,Animation, Button, director, AudioSource, AudioClip
} from 'cc';

import { gameManager,DonateableItem,ContainerItem, GAME_TYPE, SCENE_TYPE,LIVLI_ITEM_TYPE,LIVLI_CONTAINER_TYPE,IN_GAME_CURR_OP, randomEnum} from '../common/managers/gameManager';

import { ResourceUtils } from '../common/managers/ResourceUtils';

import { SoundManager } from '../common/managers/SoundManager';

import {getVoiceOvers} from '../common/strings';

const enum ColliderGroup {
    PLATFORM = 1,
    BOX,
    BOUNDARY
}


const { ccclass, property } = _decorator
@ccclass('Relief')
export class Relief extends Component {

    voiceOverData:any;

    tutorial        : boolean = true;
    firstLanding    : boolean = true;
    isDragging      : boolean = false;
    gamePaused      : boolean = true;
    isGameOver      : boolean = false;
    isMovingBoxes   : boolean = false;
    
    touchRestriction    : Node = null!;
    voiceOver           : Node = null!;
    factsPopUp          : Node = null!;
    HUDLayer            : Node = null!;
    pausePopUp          : Node = null!;

    boxPositionXForTutorial : number = 0;
    tutorialCount           : number = 0;
    boxesDonateCount        : number = 0;
    
    reliefBoxs: NodePool = new NodePool();

    deportedBoxes   : Node[] = [];
    groundBoxes     : Node[] = [];
    groundBox       : Node[] = [];

    @property(Node)    sack     : Node = null!;
    @property(Node)    platform : Node = null!;
    @property(Node)    spriteBG : Node = null!;
    @property(Node)    boundary : Node = null!;
    @property(Node)    plane    : Node = null!;

    @property(Prefab)    hudPrefab              : Prefab = null!;
    @property(Prefab)    boxPrefab              : Prefab = null!;
    @property(Prefab)    touchRestrictionPrefab : Prefab = null!;
    @property(Prefab)    voiceOverPrefab        : Prefab = null!;
    @property(Prefab)    factsPopUpPrefab       : Prefab = null!;
    @property(Prefab)    pausePopUpPrefab       : Prefab = null!;

    @property([SpriteFrame])    boxSpriteFrams: SpriteFrame[] = [];

    //audios
    @property(AudioClip)
    donationDone : AudioClip = null!;

    onLoad() {
    }

    start() {
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        gameManager.getInstance().setSceneType(SCENE_TYPE.GAME);
        gameManager.getInstance().setGameType(GAME_TYPE.RELIEF);
        gameManager.getInstance().incrementUserHearts(gameManager.getInstance().getGameTimeHeart(gameManager.getInstance().getGameType()).hearts);

        this.sack.setSiblingIndex(10);
        PhysicsSystem2D.instance.enable = true;
        //PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.All;
        PhysicsSystem2D.instance.gravity = new Vec2(0, -25 * PHYSICS_2D_PTM_RATIO);

        const system = PhysicsSystem2D.instance;
        // Physics timestep, default fixedTimeStep is 1/60
        system.fixedTimeStep = 1/20;
        // The number of iterations per update of the Physics System processing speed is 10 by default
        system.velocityIterations = 5;
        // The number of iterations per update of the Physics processing location is 10 by default
        system.positionIterations = 5;


        this.platform.attr({ type: ColliderGroup.PLATFORM });
        this.boundary.attr({ type: ColliderGroup.BOUNDARY });
    
        this.setPhysicsSystem();
        this.setUpHUDLayer();
        
        this.touchEvents();
        this.createReflifPackages();
        this.createVoiceOver();
        // this.enterPlane();   
        this.addTouchRestriction();
        this.setUpFactsPopUp();
        this.showFactsPopUp();
        this.addPausePopUp();
        this.pauseGame();
    }

    setUpFactsPopUp(){
        this.factsPopUp = instantiate(this.factsPopUpPrefab);
        this.node.addChild(this.factsPopUp);
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.loadAccomplishments();
        factPopUpScript!.updateHeading(':حقائق عامة عن قطاع الاستجابة لحالات الطوارئ');
        factPopUpScript!.setDelegate(this);
        this.factsPopUp.active = false;
    }

    addPausePopUp(){
        this.pausePopUp = instantiate(this.pausePopUpPrefab);
        this.pausePopUp.getComponent('Popup')?.init(this);
        this.node.addChild(this.pausePopUp);
        this.node.setSiblingIndex(10);
        this.pausePopUp.active = false;
    }

    showPausePopUp(isPause : boolean){
        this.pausePopUp.getComponent('Popup')!.changeButtonState(isPause);
        this.pausePopUp.active = true;
    }

    showFactsPopUp(){
        this.pauseTimer();
        let factPopUpScript:any = this.factsPopUp.getComponent('FactsPopUp');
        factPopUpScript!.showFact();
    }

    updateFallBoxFromTheSack(){
        this.fallBoxFromTheSack();
    }



    fallBoxFromTheSack(){
        tween(this.node)
        .call(()=>this.repositionSack())
        .delay(1)
        .call(()=> this.fallBox())
        .start();
    }

    createReflifPackages() {
        for (let i = 0; i < 10; i++) {
            let box = instantiate(this.boxPrefab);
            let index = Math.floor(Math.random() * 3) - 0;
            box.getComponent(Sprite)!.spriteFrame = this.boxSpriteFrams[index];
            box.getComponent(Collider2D)?.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this)
            box.attr({ isonPlatform: false, type: ColliderGroup.BOX, id : i });
            let hand = box!.getChildByName("hand");
            hand!.active = false;
            this.reliefBoxs.put(box);
        }

        // console.log("relefa bacake",  this.reliefBoxs);
    }


    setPhysicsSystem() {
        const system = PhysicsSystem2D.instance;
        system.fixedTimeStep = 1 / 60;
        system.velocityIterations = 8;
        system.positionIterations = 8;
    }

    setUpHUDLayer() {
        this.HUDLayer = instantiate(this.hudPrefab); 
        this.node.addChild(this.HUDLayer);
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.setDelegate(this);
    }

    startTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.startTimer();
        this.resumeGame();
    }
    pauseTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.pauseTimer();
    }
    resumeTimer(){
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        HUDLayerScript!.resumeTimer();
    }
    onResume(){
        this.resumeTimer();
        this.resumeGame();
        this.pausePopUp.active = false;
    }

    timeRunning(){}
    
    timePaused(){
        this.pauseGame();
        this.showPausePopUp(true);
    }

    timeOver(){
        this.pauseGame();
        this.createSummary();
        this.gameOver();
    }

    touchEvents() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }


    fallBox() {
        let box = this.reliefBoxs.get();
        box!.active = true;
        // console.log("this.box", box);
        this.spriteBG.addChild(box!);
        box!.setPosition(this.sack.getPosition());
        box!.setScale(new Vec3(0.5,0.5,0.5));

        let rigidBody = box?.getComponent(RigidBody2D);
        rigidBody?.sleep();
        box!.angle = 0;
        rigidBody?.wakeUp();
    }


    checkBoxIntersectWithPlatform(box: any | Node) {
        return Intersection2D.rectRect(box.getComponent(UITransform)?.getBoundingBoxToWorld(),
            this.platform.getComponent(UITransform)?.getBoundingBoxToWorld()!);
    }


    // Mark : touch listener
    onTouchStart(event: { getUILocation: () => any; }) {

        if (this.platform!.getComponent(UITransform)?.getBoundingBoxToWorld().contains(v2(event.getUILocation().x, event.getUILocation().y))) {
            this.isDragging = true;
        }
        // console.log("touch started")
    }

    onTouchMove(event: { getUILocation: () => any; }) {



        let eventLocation = event.getUILocation();
        // if ((event.getUILocation().x < (this.platform!.getComponent(UITransform)!.width) * 0.5) || (event.getUILocation().x > (this.node.getComponent(UITransform)!.width - (this.platform!.getComponent(UITransform)!.width) * 0.5))) {
        //     return;
        // }
        if (!this.gamePaused && this.isDragging) {
            // for(let child of this.platform.children){

            //     child.getComponents(RigidBody2D).enabled = false;
            // }
            let newPosition = this.platform.parent!.getComponent(UITransform)?.convertToNodeSpaceAR(v3(eventLocation.x, eventLocation.y, 0));

            let dx = newPosition!.x - this.platform.position.x;

            this.platform.setPosition(new Vec3(newPosition!.x, this.platform.position.y, 0));
            this.deportedBoxes.forEach((box) => {
                box.setPosition(new Vec3(box.position.x + dx, box.position.y, 0));
            });
        }

    }

    onTouchEnd() {
        this.isDragging = false;
    }


    repositionSack(){
        var ranNum = Math.ceil(Math.random() * 800) * (Math.round(Math.random()) ? 1 : -1);
        this.boxPositionXForTutorial = ranNum;
        // console.log("sack position : "+this.boxPositionXForTutorial);
        
        tween(this.sack)
        .to(0.5,{position : new Vec3(ranNum,this.sack.position.y,0)})
        .start();
    }

    onCollisionBegin(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        if(this.isMovingBoxes){
            return;
        }
        
        if ((selfCollider.node.type == ColliderGroup.BOX && otherCollider.node.type == ColliderGroup.PLATFORM) || 
        (selfCollider.node.type == ColliderGroup.PLATFORM && otherCollider.node.type == ColliderGroup.BOX || selfCollider.node.type == ColliderGroup.BOX && otherCollider.node.type == ColliderGroup.BOX)) {
            let target = selfCollider.node.type == ColliderGroup.PLATFORM ? otherCollider : selfCollider;
            if (target.node.isonPlatform) {
                // console.log("return");
                return;
            } else {
                target.node.isonPlatform = true;

                let rigidBody = target.node?.getComponent(RigidBody2D);
                if (rigidBody?.isAwake()) {
                    rigidBody?.sleep();
                }
                this.deportedBoxes.push(target.node);
            }
            if(this.deportedBoxes.length == 5){
                this.pauseGame();
                this.pauseTimer();
                tween(this.spriteBG)
                    .call(()=>{
                        this.voiceOver.active = true;
                        this.updateVoiceOverMessage(".ﻦﺤﺸﻟﺍ ﺓﺮﺋﺎﻃ ﻰﻟﺇ ﻖﻳﺩﺎﻨﺼﻟﺍ ﻊﻴﻤﺟ ﻞﻴﻤﺤﺘﺑ ﻡﻮﻘﻧ ﻰﺘﺣ ﺮﻈﺘﻧﺍ");
                    })
                    .delay(2)
                    .call(()=>{
                        this.voiceOver.active = false;
                        this.isMovingBoxes = true;
                        this.allBoxesCollected();
                    })
                    .start();
            }
        }
        else if((selfCollider.node.type == ColliderGroup.BOX && otherCollider.node.type == ColliderGroup.BOUNDARY) ||
        (selfCollider.node.type == ColliderGroup.BOUNDARY && otherCollider.node.type == ColliderGroup.BOX)){

            let target = selfCollider.node.type == ColliderGroup.BOUNDARY ? otherCollider : selfCollider;
            // console.log("target body", target);
            let center = new Vec2(0,0);
            target.body?.getWorldCenter(center)
            target.body?.applyTorque(0, true );

            // check if box was palaced on isOnPlatform
            if(target.node.isonPlatform){
                target.node.isonPlatform = false;
                
                let index = this.deportedBoxes.findIndex(box => box.id == target.node.id);
                if(index!=-1){
                    this.deportedBoxes.splice(index, 1);
                }
            }
            this.groundBoxes.push(target.node);
        }
    }
    runTutorial(){
        tween(this.spriteBG)
        .call(()=>{
            this.updateVoiceOverMessage(this.voiceOverData.introduction);
            this.voiceOver.active = true;
            let clip = ResourceUtils.getInstance().getGameResources("Relief", "Vo1");
            // console.log("Relief Introduction"+clip);
            clip && SoundManager.getInstance().playSoundEffect(clip);
        })
        .delay(13)
        .call(()=>{
            let clip = ResourceUtils.getInstance().getGameResources("Relief", "music");
            if(clip){
                this.node.getComponent(AudioSource)!.clip = clip;
                SoundManager.getInstance().playMusic(true);
            }
            this.voiceOver.active = false;
            this.collectBoxTutorial();
            this.schedule(this.collectBoxTutorial, 4);
        })
        .start();
    }

    collectBoxTutorial(){

        if (this.tutorialCount === 5) {
            // Cancel this timer at the sixth call-back
            this.unschedule(this.collectBoxTutorial);
            let hand = this.platform.getChildByName("hand");
            hand!.active = false;
            // this.platform.removeChild(hand);
        }
        else{
            this.tutorialCount++;
            this.fallBoxFromTheSack();
            tween(this.spriteBG)
            .delay(1)
            .call(()=>{
                this.deportedBoxes.forEach((box) => {
                    tween(box)
                    .to(0.5,{position: new Vec3(this.boxPositionXForTutorial,box.position.y,0)})
                    .start();
                });

                tween(this.platform)
                .to(0.5,{position: new Vec3(this.boxPositionXForTutorial,this.platform.position.y,0)})
                .call(()=>{
                    // console.log("platform position : "+this.platform.position.x);
                })
                .start();
            })
            .start();
        }
    }

    movePlatformToCenter(){

        let hand = this.platform.getChildByName("hand");
        hand!.active = true;
        let platformPos = this.platform.position.x+500;
        tween(this.spriteBG)
        .call(()=>{
            this.deportedBoxes.forEach((box) => {
                tween(box)
                .to(0.5,{position: new Vec3(box.position.x - platformPos,box.position.y,0)})
                .start();
            });

            tween(this.platform)
            .to(0.5,{position: new Vec3(-500,this.platform.position.y,0)})
            .call(()=>{
                let hand = this.platform.getChildByName("hand");
                hand!.active = false;
                this.moveBoxesToPlane();
            })
            .start();
        })
        .start();
    }

    moveBoxesToPlane(){
        let box = this.deportedBoxes.pop();
        let hand = box!.getChildByName("hand");
        hand!.active = true;
        box.isonPlatform = false;
        let rigidBody = box?.getComponent(RigidBody2D);
        PhysicsSystem2D.instance.gravity = new Vec2();
        tween(box)
        .call(()=>{
            if (rigidBody?.isAwake()) {
                rigidBody?.sleep();
            }
        })
        .to(0.125,{position: new Vec3(box?.position.x,box?.position.y! + 300,0)})
        .to(0.25,{position: new Vec3(498,-400,0),scale: new Vec3(0.4,0.4,0.4)})
        .to(0,{angle : 10})
        .to(0.125,{position: new Vec3(680,-400,0),scale: new Vec3(0.2,0.2,0.2)})
        .to(0,{angle : 30})
        .to(0.125,{position: new Vec3(900,-320,0),scale: new Vec3(0.0,0.0,0.0)})
        .to(0,{angle : 0})
        .call(()=>{
            SoundManager.getInstance().playSoundEffect(this.donationDone);
            if(!this.tutorial){
                let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
                this.boxesDonateCount++;
                let HUDResponse= HUDLayerScript!.updateHearts(IN_GAME_CURR_OP.DECREASE,50);
                if(HUDResponse.gameover){
                    this.isGameOver = true;
                    this.noMoreHeartsLeft();
                }
            }
            hand!.active = false;
            this.reliefBoxs.put(box!);
            if(this.deportedBoxes.length == 0){
                this.isMovingBoxes = false;
                this.unschedule(this.moveBoxesToPlane);
                this.exitPlane();
                this.tutorial = false;
            }
        })
        .start(); 
    }
    update(){

        while(this.groundBoxes.length >  0){
            // console.log("insdei this shit", this.groundBoxes.length);
            this.reliefBoxs.put(this.groundBoxes.pop()!);
        }
    }
    allBoxesCollected(){
        this.movePlatformToCenter();
        this.schedule(this.moveBoxesToPlane, .8);
    }
    enterPlane(){
        tween(this.plane)
        .call(()=>{
            this.plane.getComponent(Animation)?.play('enterPlane');
        })
        .delay(1)
        .call(()=>{
            this.plane.getChildByName('door')?.getComponent(Animation)?.play('doorOpen');
        })
        .delay(0.5)
        .call(()=>{
            if(this.tutorial)
                this.runTutorial();
            else if(this.isGameOver){
                // this.noMoreHeartsLeft();
            }
            else{
                PhysicsSystem2D.instance.gravity = new Vec2(0, -60 * PHYSICS_2D_PTM_RATIO);
                if(this.firstLanding){
                    this.firstLanding = false;
                    tween(this.spriteBG)
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
                        this.startTimer();
                        // this.showFactsPopUp();
                    })
                    .start();
                } 
                else{
                    tween(this.spriteBG)
                    .call(()=>{
                        this.updateVoiceOverMessage("!ﻉﺮﺳﺃ .ﻥﻵﺍ ﻊﻤﺠﻟﺍ ﻲﻓ ﺀﺪﺒﻟﺍ ﻚﻨﻜﻤﻳ");
                        this.voiceOver.active = true;
                    })
                    .delay(2)
                    .call(()=>{
                        this.voiceOver.active = false;
                        this.touchRestriction.active = false;
                        this.resumeTimer();
                        this.resumeGame();
                    })
                    .start();
                }
            }
                
        })
        .start();
    }
    exitPlane(){
        tween(this.plane)
        .call(()=>{
            this.plane.getChildByName('door')?.getComponent(Animation)?.play('doorClose'); 
        })
        .delay(0.5)
        .call(()=>{
            this.plane.getComponent(Animation)?.play('exitPlane');
        })
        .delay(0.5)
        .call(()=>{
            this.enterPlane();
        })
        .start();
    }
    addTouchRestriction(){
        this.touchRestriction = instantiate(this.touchRestrictionPrefab);
        this.node.addChild(this.touchRestriction);
        this.touchRestriction.active = false;
    }
    createVoiceOver(){
        this.voiceOver = instantiate(this.voiceOverPrefab);
        this.node.addChild(this.voiceOver);
        this.voiceOver.active = false;
        this.voiceOverData = getVoiceOvers(gameManager.getInstance().getGameType());
        // console.log("VO DAta "+this.voiceOverData);
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

    clickCallback (event: Button, data: any) {
        // console.log(event);
    }


    pauseGame(){
        this.gamePaused = true;
        this.touchRestriction.active = true;
        this.unschedule(this.updateFallBoxFromTheSack);
    }

    resumeGame(){
        this.gamePaused = false;
        this.touchRestriction.active = false;
        this.updateFallBoxFromTheSack();
        this.schedule(this.updateFallBoxFromTheSack,2);
    }

    noMoreHeartsLeft(){
        this.pauseGame();
        this.createSummary();
        this.gameOver();
    }

    onItemButtonClick(){
    }

    gameOver(){
        this.unschedule(this.moveBoxesToPlane);
        let HUDLayerScript:any = this.HUDLayer.getComponent("HUDLayer");
        let heartsConsumed = HUDLayerScript!.getHeartsConsumed();
        let amount = heartsConsumed < 100 ? [heartsConsumed] : [Math.floor(heartsConsumed/100) * 100, heartsConsumed%100];
        let result = amount.map(( name:string ) => ResourceUtils.getInstance().getAudioClip(name)).filter(item => item!=null);
        let waitAfterAmount = result.map(clip => clip?.getDuration()).reduce((a, b) => a! + b!, 0);
        if(amount[0] > 0){
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
                SoundManager.getInstance().stopMusic();
                SoundManager.getInstance().playSoundEffect(your!); 
            })
            .delay(3)
            .call(()=>{
                let youDonated = ResourceUtils.getInstance().getAudioClip("youDonated");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(1)
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
                let youDonated = ResourceUtils.getInstance().getAudioClip("worthOf");
                SoundManager.getInstance().playSoundEffect(youDonated!);
            })
            .delay(8.45)
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

        let gameSummary:Array<string> = new Array;
        gameSummary.push(" ﺻﻨﺎﺩﻳﻖ ﻣﻦ ﺍﻟﻀﺮﻭﺭﻳﺎﺕ ﺍﻟﻴﻮﻣﻴﺔ ﺍﻷﺳﺎﺳﻴﺔ" + this.boxesDonateCount);
        gameManager.getInstance().setGameSummary(gameSummary);
    }
}