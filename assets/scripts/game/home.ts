
import { _decorator, Component,director, Node, Sprite, Label, SpriteFrame, sys, AudioClip, AudioSource,VideoPlayer, VideoClip, tween, Tween, Button, Prefab, instantiate, TERRAIN_NORTH_INDEX, Widget, game, math, color, ColorKey, ScrollView, ScrollViewComponent } from 'cc';
import { gameManager, SCENE_TYPE } from '../common/managers/gameManager';
import { TIMER_STATE } from '../common/prefab/HUDLayer';
import { ResourceUtils } from '../common/managers/ResourceUtils';

import { SoundManager } from '../common/managers/SoundManager';
import { UserDetails } from '../common/managers/userDetails';
import { Education } from './education';
const { ccclass, property } = _decorator;
let     sceneRef = null;

let questionsEducation =['.ﻳﺴﺘﺤﻖ ﻛﻞ ﺍﻷﻃﻔﺎﻝ ﺍﻟﺬﻫﺎﺏ ﺇﻟﻰ ﺍﻟﻤﺪﺭﺳﺔ',

'.ﻳﻌﺘﺒﺮ ﺍﻟﺘﻌﻠﻴﻢ ﻓﻲ ﺍﻟﻤﻨﺎﻃﻖ ﺍﻟﻤﺴﺘﻀﻌﻔﺔ ﺃﻗﻞ ﺃﻫﻤﻴﺔ',

'.ﻳﻤﻜﻦ ﻟﺠﻤﻴﻊ ﺍﻷﻃﻔﺎﻝ ﺗﺤﻤﻞ ﺗﻜﻠﻔﺔ ﺍﻷﺩﻭﺍﺕ ﺍﻟﻤﺪﺭﺳﻴﺔ',

'.ﻳﺴﺘﻄﻴﻊ ﺟﻤﻴﻊ ﺍﻷﻃﻔﺎﻝ ﺍﻟﻘﺮﺍﺀﺓ ﻭﺍﻟﻜﺘﺎﺑﺔ',

'.التعليم للجميع، الغني والفقير',

`ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﻫﻲ ﻣﺆﺳﺴﺔ ﺧﻴﺮﻳﺔ ﻣﻘﺮﻫﺎ ﺩﻭﻟﺔ
.ﺍﻹﻣﺎﺭﺍﺕ ﺍﻟﻌﺮﺑﻴﺔ ﺍﻟﻤﺘﺤﺪﺓ`,

`ﺳﻤﻮ ﺍﻟﺸﻴﺨﺔ ﺟﻮﺍﻫﺮ ﺍﻟﻘﺎﺳﻤﻲ، ﻗﺮﻳﻨﺔ ﺣﺎﻛﻢ ﺍﻟﺸﺎﺭﻗﺔ، ﻫﻲ ﺭﺋﻴﺴﺔ
.ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ`

];

let answersEducation =['Y','N','N','N','Y','Y','Y'];

let questionsHealthCare =['.ﻳﻤﻜﻦ ﻷﻱ ﺷﺨﺺ ﺍﻟﺤﺼﻮﻝ ﻋﻠﻰ ﺍﻟﺪﻭﺍﺀ ﺍﻟﺬﻱ ﻳﺤﺘﺎﺟﻪ',
'.ﻣﻦ ﺍﻟﻤﻬﻢ ﺯﻳﺎﺭﺓ ﺍﻟﻄﺒﻴﺐ ﻋﻨﺪ ﺍﺻﺎﺑﺘﻚ ﺑﺎﻟﻤﺮﺽ',
'.ﻳﺘﻮﻓﺮ ﺍﻟﻄﻌﺎﻡ ﺍﻟﺼﺤﻲ ﻭﺍﻟﻤﻴﺎﻩ ﺍﻟﻨﻈﻴﻔﺔ ﻓﻲ ﻛﻞ ﻣﻨﺰﻝ',
'.ﻳﻌﺮﻑ ﺟﻤﻴﻊ ﺍﻷﻃﻔﺎﻝ ﻛﻴﻔﻴﺔ ﺍﺳﺘﺨﺪﺍﻡ ﻣﻌﻘﻤﺎﺕ ﺍﻟﻴﺪ',
'.ﺗﺒﻨﻲ ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﻣﺴﺘﺸﻔﻴﺎﺕ ﻭﻋﻴﺎﺩﺍﺕ ﻟﻠﻤﺤﺘﺎﺟﻴﻦ',
`ﻳﺴﻬﻢ ﺗﺪﺭﻳﺐ ﺍﻷﻃﺒﺎﺀ ﻓﻲ ﺗﺤﺴﻴﻦ ﺧﺪﻣﺎﺕ ﺍﻟﺮﻋﺎﻳﺔ
.ﺍﻟﺼﺤﻴﺔ ﻟﻤﻨﻄﻘﺔ ﺑﺄﻛﻤﻠﻬﺎ`
];
let answersHealthCare =['N','Y','N','N','Y','Y'];

let questionsEmergency =['.ﺗﻘﺪﻡ ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﺍﻟﺪﻋﻢ ﻓﻲ ﺣﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ',
'.ﻳﺠﺐ ﺗﻘﺪﻳﻢ ﺍﻟﺪﻋﻢ ﻓﻲ ﺣﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ ﻓﻲ ﺃﺳﺮﻉ ﻭﻗﺖ ﻣﻤﻜﻦ',
'.ﻳﻤﻜﻦ ﺃﻥ ﺗﻜﻮﻥ ﺣﺎﻟﺔ ﺍﻟﻄﻮﺍﺭﺉ ﻛﺎﺭﺛﺔ ﻃﺒﻴﻌﻴﺔ ﺃﻭ ﻣﻦ ﻋﻤﻞ ﺍﻹﻧﺴﺎﻥ',
'.ﺣﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ ﺗﺤﺪﺙ ﻓﻘﻂ ﻓﻲ ﺍﻟﺒﻠﺪﺍﻥ ﺍﻟﻔﻘﻴﺮﺓ',
`ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﻻ ﺗﻘﺪﻡ ﺍﻟﻤﺴﺎﻋﺪﺓ ﻟﻠﻌﺎﺋﻼﺕ
.ﺍﻟﺘﻲ ﻓﻘﺪﺕ ﻣﻨﺎﺯﻟﻬﺎ ﻓﻲ ﺣﺎﻻﺕ ﺍﻟﻄﻮﺍﺭﺉ`,
'.ﺍﻹﻣﺎﺭﺍﺕ ﺍﻟﻌﺮﺑﻴﺔ ﺍﻟﻤﺘﺤﺪﺓ ﻣﻦ ﺍﻟﺪﻭﻝ ﺍﻟﺮﺍﺋﺪﺓ ﻓﻲ ﻣﺴﺎﻋﺪﺓ ﺍﻟﻤﺤﺘﺎﺟﻴﻦ'
];
let answersEmergency =['Y','Y','Y','N','N','Y'];

let questionsLivlihood =['.ﺟﻤﻴﻊ الشباب ﻟﺪﻳﻬﻢ ﻭﻇﺎﺋﻒ',
'.ﺟﻤﻴﻊ العائلات ﻟﺪﻳﻬﻢ ﺍﻟﻤﺎﻝ ﻟﺸﺮﺍﺀ ﺍﺣﺘﻴﺎﺟﺎﺕ ﺃﻃﻔﺎﻟﻬﻢ',
'.ﻻ ﻳﺤﺼﻞ ﺑﻌﺾ ﺍﻷﻃﻔﺎﻝ ﻋﻠﻰ ﻭﺟﺒﺎﺕ ﺍﻟﻄﻌﺎﻡ ﻓﻲ ﺍﻟﺒﻠﺪﺍﻥ ﺍﻟﻔﻘﻴﺮﺓ',
'.ﺗﺴﺎﻋﺪ ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﺍﻟﻤﺸﺎﺭﻳﻊ ﺍﻟﻨﺎﺷﺌﺔ ﺍﻟﺘﻲ ﻳﺪﻳﺮﻫﺎ ﺍﻟﺸﺒﺎﺏ',
`ﺗﻘﺪﻡ ﻣﺆﺳﺴﺔ ﺍﻟﻘﻠﺐ ﺍﻟﻜﺒﻴﺮ ﺩﻭﺭﺍﺕ ﺗﺪﺭﻳﺒﻴﺔ ﻟﻠﻤﻌﻠﻤﻴﻦ
.ﻭﺍﻷﻃﺒﺎﺀ ﻟﺘﻄﻮﻳﺮ ﻣﻬﺎﺭﺍﺗﻬﻢ`,
'.ﻟﻴﺲ ﻣﻦ ﺍﻟﻤﻬﻢ ﻣﺴﺎﻋﺪﺓ ﺍﻟﻤﺤﺘﺎﺟﻴﻦ ﺣﻮﻝ ﺍﻟﻌﺎﻟﻢ'
];
let answersLivlihood=['N','N','Y','Y','Y','N'];

let curQuestions:string[]=[];
let curAnswers:string[]=[];
let curGame = '';
let curQuestionNo =0;
let curAnswer = '';
let answerPoints =0;
@ccclass('Home')
export class Home extends Component {


    currentScene = ""

    isVideoPlaying = false;
    currentGame:Prefab|any  = null!;

    
    @property(Sprite)
    profilePicture : Sprite = null!;

    @property(Label)
    Name : Label = null!;

    @property(Label)
    email : Label = null!;

    @property(SpriteFrame)
    gender : SpriteFrame[] = [];

    @property(AudioClip)
    buttonClick : AudioClip = null!;

    @property(AudioClip)
    homeVoiceOver : AudioClip = null!;

    @property(Node)
    welcomeBack : Node = null!;

    @property(Label)
    heartCount : Label = null!;


    @property(AudioClip)
    homeMusic : AudioClip = null!;

    @property(VideoPlayer)
    videoPlayer :VideoPlayer =  null!;

    @property(Node)
    videoBg :Node =  null!;

    @property(Node)
    questionsBg :Node =  null!;
    @property(Label)
    question : Label = null!;
    @property(Button)       yesButton :Button     = null!;
    @property(Button)       noButton :Button     = null!;

    @property(Node)
    involvesBg :Node =  null!;

    @property(ScrollView)   InvolveScrollView :ScrollView= null;

    @property(Button)       closeInvolveButton :Button     = null!;
    
    @property(Button)       schoolInvolveButton :Button     = null!;
    @property(Button)       communityInvolveButton :Button     = null!;
    @property(Button)       parentsInvolveButton :Button     = null!;

    @property(Button)       schoolInvolveButtonTab :Button     = null!;
    @property(Button)       communityInvolveButtonTab :Button     = null!;
    @property(Button)       parentsInvolveButtonTab :Button     = null!;

    @property(Label)        mainInvolveLabel :Label     = null!;
    @property(Label)        schoolsInvolveLabel :Label     = null!;
    @property(Label)        communityInvolveLabel :Label     = null!;
    @property(Label)        parentsInvolveLabel :Label     = null!;


    @property([Node])
    sceneButtons: Node[] = [];


    start () {   
       gameManager.getInstance().setSceneType(SCENE_TYPE.HOME); 
       SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
       this.setUpUserProfile();   
       this.playHomeVoiceOver();
       this.videoEvents();
       
       switch (gameManager.getInstance().gameAutoAdvance){
            case 1:
                gameManager.getInstance().gameAutoAdvance=0;
                this.onEducation(true);
                break;
            case 2:
                gameManager.getInstance().gameAutoAdvance=0;
                this.onLivelihood(true);
                break;
            case 3:
                gameManager.getInstance().gameAutoAdvance=0;
                this.onRelief(true);
                break;
            case 4:
                gameManager.getInstance().gameAutoAdvance=0;
                this.onHealthcare(true);
                break;
        }
        gameManager.getInstance().gameAutoAdvance=0;
    //    this.heartCount.string =  `${gameManager.getInstance().getuserHeartCount()}`;
    }

    OnYes(){ 
        curAnswer='Y';
        this.checkAnswer();
    }
    OnNo(){
        curAnswer='N';
        this.checkAnswer();
    }

    MoveInvolveButtons(up:boolean){
        this.InvolveScrollView.scrollToTop(0.3);
        if (up){
            this.schoolInvolveButton.node.active=false
            this.parentsInvolveButton.node.active=false
            this.communityInvolveButton.node.active=false

            this.schoolInvolveButtonTab.node.active=true
            this.parentsInvolveButtonTab.node.active=true
            this.communityInvolveButtonTab.node.active=true
        }else{
            this.schoolInvolveButton.node.active=true
            this.parentsInvolveButton.node.active=true
            this.communityInvolveButton.node.active=true
            
            this.schoolInvolveButtonTab.node.active=false
            this.parentsInvolveButtonTab.node.active=false
            this.communityInvolveButtonTab.node.active=false
        }
    }

    ShowInvolveLabel(which:number){
        this.mainInvolveLabel.node.active=which==0;
        this.schoolsInvolveLabel.node.active=which==1;
        this.communityInvolveLabel.node.active=which==2;
        this.parentsInvolveLabel.node.active=which==3;
    }

    OnCloseInvolve(){
        this.playButtonClickSound();
        this.involvesBg.active = false;
        this.ShowInvolveLabel(0);
        this.MoveInvolveButtons(false);
    }

    OnSchoolsInvolve(){
        this.playButtonClickSound();
        this.ShowInvolveLabel(1);
        this.MoveInvolveButtons(true);
        this.MoveInvolveButtons(true);
    }

    OnCommunityInvolve(){
        this.playButtonClickSound();
        this.ShowInvolveLabel(2);
        this.MoveInvolveButtons(true);
    }

    OnParentsInvolve(){
        this.playButtonClickSound();
        this.ShowInvolveLabel(3);
        this.MoveInvolveButtons(true);
    }

    OnShowInvolve(){
        this.involvesBg.active = true;
    }
   
    playHomeVoiceOver(){
        sceneRef = this;
        //console.log("gameManager.getInstance().isVoiceOverPlayer(SCENE_TYPE.HOME)", gameManager.getInstance().isVoiceOverPlayer(SCENE_TYPE.HOME));
        if(!gameManager.getInstance().isVoiceOverPlayer(SCENE_TYPE.HOME)){     
            let delay = this.homeVoiceOver.getDuration();
            //console.log("homeVoiceOver", this.homeVoiceOver,delay);
       tween(this.node).call(()=>{
                this.node.getComponent(AudioSource)!.clip= this.homeVoiceOver
                SoundManager.getInstance().playMusic(false);
                gameManager.getInstance().setVoiceOverPlayed(SCENE_TYPE.HOME, true);
            }).delay(8).call(()=>{
                this.playMusic();
            }).start();
        }else{
            this.playMusic();
        }

    }

    enableHomeButtons(index: number, target:any){
        //console.log("targte", target, target.sceneButtons);
        if(target && target.sceneButtons){
            target.sceneButtons[index].getComponent(Button)!.interactable = true;
            target.sceneButtons[index].getComponent(Sprite)!.grayscale = false;
        }
       
    }


    playMusic(){
        if(this.isVideoPlaying) {
            return;
        }
        SoundManager.getInstance().init(this.node.getChildByName("spriteBG")!.getComponent(AudioSource)!);
        this.node.getChildByName("spriteBG")!.getComponent(AudioSource)!.clip = this.homeMusic;
        SoundManager.getInstance().playMusic(true);
    }
  

    setUpUserProfile(){
        let userDetails = UserDetails.getInstance().getUserDetails();
        this.Name.string = userDetails.firstName;
        this.email.string = userDetails.email;
        this.profilePicture.spriteFrame = userDetails.gender == 1 ?   this.gender[0] : this.gender[1];
    }

    onEducation(startWithoutVideo :boolean= false){
        this.playButtonClickSound();
        if (startWithoutVideo!=true){
            let clip = ResourceUtils.getInstance().getGameResources("Education", 'video' );
            this.playVideoCallback(clip);
        }
        let prefab = ResourceUtils.getInstance().getGamePrefab("Education" );
        this.currentGame = instantiate(prefab);
        this.currentGame.active = startWithoutVideo===true;
        this.node.addChild( this.currentGame);
        curGame = 'Education';

       
    }
    onLivelihood(startWithoutVideo:boolean=false){
        this.playButtonClickSound();
        if (startWithoutVideo!=true){
        let clip = ResourceUtils.getInstance().getGameResources("LiveliHood", 'video' );
        this.playVideoCallback(clip);
        }
        let prefab = ResourceUtils.getInstance().getGamePrefab("LiveliHood");
        //console.log("prefabe", prefab);
        this.currentGame = instantiate(prefab);
        this.currentGame.active = startWithoutVideo===true;
        this.node.addChild( this.currentGame);
        curGame = 'Livlihood';
        // director.loadScene();
    }
    onRelief(startWithoutVideo :boolean= false){
        this.playButtonClickSound();
        if (startWithoutVideo!=true){
        let clip = ResourceUtils.getInstance().getGameResources("Relief", 'video' );
        this.playVideoCallback(clip);   
        }
        let prefab = ResourceUtils.getInstance().getGamePrefab("Relief");
        //console.log("prefabe", prefab);
        this.currentGame = instantiate(prefab);
        this.currentGame.active = startWithoutVideo===true;
        this.node.addChild( this.currentGame);
        curGame = 'Emergency';
        // this.playButtonClickSound();
        // director.loadScene("relief");
    }
    onHealthcare(startWithoutVideo :boolean= false){
        this.playButtonClickSound();
        if (startWithoutVideo!=true){
            let clip = ResourceUtils.getInstance().getGameResources("Healthcare", 'video' );
            this.playVideoCallback(clip);
        }
        let prefab = ResourceUtils.getInstance().getGamePrefab("Healthcare");
        //console.log("prefabe", prefab);
        this.currentGame = instantiate(prefab);
        this.currentGame.active = startWithoutVideo===true;
        this.node.addChild( this.currentGame);
        curGame = 'Healthcare';
        // this.playButtonClickSound();
        // director.loadScene("healthcare");
    }

    onProfileView(){
        this.playButtonClickSound();
        director.loadScene('playerProfile');
    }

    onDonate(){
     this.playButtonClickSound();
     this.involvesBg.active = true;
     // sys.openURL(" https://tbhf.ae/donate/");
    }


    playButtonClickSound(){
        this.node.getComponent(AudioSource)!.currentTime = this.homeVoiceOver.getDuration();
        SoundManager.getInstance().stopSoundEffect();
        SoundManager.getInstance().playSoundEffect(this.buttonClick);
    }
    
    videoEvents(){
        // this.videoPlayer.node.on('ready-to-play', this.playVideoCallback, this);
        this.videoPlayer.node.on('completed', this.videoEndCallback, this);
        this.videoPlayer.node.on('clicked', this.videoEndCallback, this);
    }

    playVideoCallback(clip : VideoClip){
        this.videoBg.active = true;
        this.isVideoPlaying = true;
        SoundManager.getInstance().stopMusic();
        this.videoPlayer.clip = clip;
        this.videoPlayer.node.active = true;
        this.videoPlayer.play();
    }

    videoEndCallback(){
        if(this.videoPlayer.node.active){
            this.videoBg.active = false;
            this.videoPlayer.node.active =false;
          // this.currentGame.active = true;
          this.questionsBg.active = true;
          this.StartQuestions();
        }
    }

    StartQuestions(){

        tween(this.node)
            .call(()=>{ 
                let hearts = ResourceUtils.getInstance().getAudioClip("hearts");
                SoundManager.getInstance().playSoundEffect(hearts!);
            })
            .delay(7)
            .call(()=>{
                this.playMusic();
            })
            .start();
       

        curQuestionNo=0;
        answerPoints=0;

        switch(curGame){
            case 'Education':
                curQuestions = questionsEducation;
                curAnswers = answersEducation;

                break;
            case 'Livlihood':
                curQuestions = questionsLivlihood;
                curAnswers = answersLivlihood;
                break;
            case 'Emergency':
                curQuestions = questionsEmergency;
                curAnswers = answersEmergency;
                break;
            case 'Healthcare':
                curQuestions = questionsHealthCare;
                curAnswers = answersHealthCare;
                break;
        }

        this.nextQuestion();

    }

    nextQuestion(){

        if(curQuestionNo<curQuestions.length)
        {
            this.question.string=curQuestions[curQuestionNo];

        }
        else
        {
            this.questionsBg.active = false;
            this.currentGame.active = true;
        }
    }

    checkAnswer(){
        this.playButtonClickSound();
        
        if(curAnswer === curAnswers[curQuestionNo])
        {
            answerPoints++;
            curQuestionNo++;
            this.noButton.node.active=true;
            this.yesButton.node.active=true;
            this.nextQuestion();
        }
        else{
            if (curAnswer === "N")
                this.noButton.node.active=false;
            else
                this.yesButton.node.active=false;

            //alert("Your answer wasn't correct, try agian!");
            
        }
        

    }

   
}