
import { _decorator, Component, Node, EditBox, Button, director, SpriteFrame, AudioClip, game, Sprite, Prefab, AudioSource, TERRAIN_HEIGHT_BASE, Label, Toggle, tween } from 'cc';
import { UserDetails } from '../common/managers/userDetails';
import { NetworkManager } from '../common/network/NetworkManager';
import { REQUEST_TYPE, API_END_POINTS, DEPLOYMENT_MODE, SERVER } from '../common/network/NetworkConfig';
import { SoundManager } from '../common/managers/SoundManager';
import { gameManager, SCENE_TYPE } from '../common/managers/gameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerProfile')
export class PlayerProfile extends Component {
    
    errorLayer =  null;
    loaderLayer =  null;
    loaderAction = null;


    @property(Label)
    playerName = new Label;

    @property(Label)
    playerUserName = new Label;

    @property(Label)
    playerEmail = new Label;

    @property(Label)
    playerGender = new Label;

    @property(Sprite)
    playerProfilePic = new Sprite;

    @property(Prefab)
    errorPrefab = null;

    @property(Prefab)
    loaderPrefab = null;

    @property(SpriteFrame)
    gender : SpriteFrame[] = [];


  @property(AudioClip)
  buttonClick : AudioClip = null!;

    start () {

        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);


        let userDetails = UserDetails.getInstance().getUserDetails();
        this.playerName.string = userDetails.firstName;
        this.playerEmail.string = userDetails.email;
        this.playerUserName.string = userDetails.username;
        this.playerGender.string = userDetails.gender == 1 ? "male" : "female";
        
        this.playerProfilePic.spriteFrame = userDetails.gender == 1 ?   this.gender[0] : this.gender[1];


    }

    getPlayerProfileData () {


        let onSuccess = (data: any) =>{
            this.stopLoader();
            //console.log(" on success data",data);
            data = JSON.parse(data);

            this.playerName.string = data.data.firstName + ' ' + data.data.lastName;
            this.playerUserName.string = data.data.userName;
            this.playerEmail.string = data.data.email;
            this.playerGender.string = data.data.gender==0?'Girl':'Boy';
        } 

        let onError = (data : any) =>{
            this.stopLoader();
            this.activeErrorLayer(JSON.parse(data).msg);
            //console.log("on faiure data", data);
        }

        this.startLoader();

        NetworkManager.getInstance().sendRequest(API_END_POINTS.USER_PROFILE, 
        REQUEST_TYPE.GET, {},
        onSuccess,
        onError,
        true);
    }
    
    activeErrorLayer(errorMsg: string){
        this.errorLayer.getChildByName("ErrorMsg").getComponent(Label).string = errorMsg;
        this.errorLayer.active = true;
    }
    inActiveErrorLayer(){
        this.errorLayer.active = false;
    }
    
    startLoader(){
        this.loaderAction = tween(this.loaderLayer.getChildByName("LoaderIcon"))
        .by(0.1,{angle: -40})
        .repeatForever()
        .start();
        this.loaderLayer.active = true;
    }
    stopLoader(){
        this.loaderLayer.active = false;
        this.loaderAction.stop();
    }

    onBack(){
        SoundManager.getInstance().playSoundEffect(this.buttonClick);
        director.loadScene("home");
    }


    onLogout(){
        SoundManager.getInstance().playSoundEffect(this.buttonClick);
        sessionStorage.clear();
        gameManager.getInstance().setVoiceOverPlayed(SCENE_TYPE.HOME, false);
        director.loadScene('login');
    }

    
}
