
import { _decorator, Component, Node, EditBox, Button, director, SceneAsset, game, Sprite, Prefab, instantiate, AudioClip, Label, ProgressBar , Toggle, tween, AudioSource, ResolutionPolicy } from 'cc';
import { ResourceUtils } from '../common/managers/ResourceUtils';
import { NetworkManager } from '../common/network/NetworkManager';
import { REQUEST_TYPE, API_END_POINTS, DEPLOYMENT_MODE, SERVER } from '../common/network/NetworkConfig';
import { UserDetails } from '../common/managers/userDetails';
import { SoundManager } from '../common/managers/SoundManager';
import  {ERROR_MSG} from "../common/strings";
import { gameManager } from '../common/managers/gameManager';
const { ccclass, property } = _decorator;

@ccclass('Login')
export class Login extends Component {

  rememberMe    = false;
  loaderAction  = null!;
  
  errorLayer    : Node  = null!;
  nonerrorLayer    : Node  = null!;
  loaderLayer   : Node  = null!;

  @property({type: EditBox,  displayName : "Username Editbox"}) usernameEb = new EditBox();
  @property({type: EditBox, displayName : "Password Editbox"})  passwordEb = new EditBox();

  @property(Node)         loader      :Node       = null!;
  @property(Button)       logInButton :Button     = null!;
  @property(Prefab)       errorPrefab :Prefab     = null!;
  @property(Prefab)       nonerrorPrefab :Prefab     = null!;
  @property(Prefab)       loaderPrefab:Prefab     = null!;
  @property(Sprite)       startImage  :Sprite     = null!;
  @property(AudioClip)    buttonClick :AudioClip  = null!;
  @property(ProgressBar)  progressBar :ProgressBar= null!;

  start(){
   
    
    SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
    NetworkManager.getInstance().init(SERVER);

    // tween(this.node)
    // .call(()=>{
    //   this.loadGameSubPackage();
    // })
    // .delay(5)
    // .call(()=>{
    //   this.onLoginPageLoad(false);
    // })
    // .start();

    this.loadGameSubPackage();

    this.errorLayer = instantiate(this.errorPrefab); 
    this.nonerrorLayer = instantiate(this.nonerrorPrefab);
    this.node.addChild(this.errorLayer!);
    this.node.addChild(this.nonerrorLayer!);
    this.inActiveErrorLayer();
    this.inActivenonErrorLayer();
    
    this.loaderLayer = instantiate(this.loaderPrefab); 
    this.node.addChild(this.loaderLayer!);
    this.loaderLayer.active = false;

  }

  loadGameSubPackage () {
    //console.log("progressBar", this.progressBar);
    
    let time = 0;
    let interval = setInterval(()=>{
      time += 100;
      if(this.progressBar){
        this.progressBar.progress = Math.min(time/ 2000, 0.95) ;
        //console.log("inside this", this.progressBar.progress );
      }
    }, 2000);

    ResourceUtils.getInstance().loadGameResources("Education")
    .then( () =>  {
      ResourceUtils.getInstance().loadGameResources("Relief")
      // this.progressBar.progress = 10;
    })
    .then( () =>  {
      ResourceUtils.getInstance().loadGameResources("LiveliHood")
      // this.progressBar.progress = 30;
    })
    .then( () =>  {
      ResourceUtils.getInstance().loadGameResources("Healthcare")
      // this.progressBar.progress = 50;
    })
    .then((data)=> {
      ResourceUtils.getInstance().loadNumberAudio()
      // this.progressBar.progress = 70;
    })
    .then((data)=> {
      ResourceUtils.getInstance().loadCountriesAudio()
      // this.progressBar.progress = 90;
    })
    .then((data)=>{
      //console.log("data has been loaded");
      clearInterval(interval);
      this.progressBar.progress = 100;
      this.onLoginPageLoad(false);
    })
    .catch((error)=>{
      //console.log("error while laoding game data",  error);
    });

    director.preloadScene("home",()=>{
        //console.log("home scene loaded");
    });
  }

  onEditingDidEnded(editbox : EditBox){
    this.inActiveErrorLayer();
    let validate = editbox.node.getComponent("FieldValidator")!.doValidation(editbox.string);
    // if(!validate.isValid){
    //   this.activeErrorLayer(validate.message);
    // }
  }
  
  checkIfFormIsValid(){
    this.inActiveErrorLayer();
    let isEmailValid    = this.usernameEb.getComponent("FieldValidator")!.doValidation(this.usernameEb.string);
    let isPasswordValid = this.passwordEb.getComponent("FieldValidator")!.doValidation(this.passwordEb.string);

    if(this.usernameEb.string.length == 0 || this.passwordEb.string.length ==0 ){
      return 
    }
    switch(false){
      case isEmailValid.isValid: this.activeErrorLayer(ERROR_MSG.INAVLIDE_CREDENTIALS);
        //console.log('isEmailValid');
        return false;
      case isPasswordValid.isValid: this.activeErrorLayer(ERROR_MSG.INAVLIDE_CREDENTIALS);
        //console.log('isPasswordValid');
        return false;
    }
    return true;
  }
  activeErrorLayer(errorMsg: string){
    this.errorLayer!.getChildByName("ErrorMsg").getComponent(Label).string = errorMsg;
    this.errorLayer!.active = true;
  }
  activenonErrorLayer(errorMsg: string){
    this.nonerrorLayer!.getChildByName("ErrorMsg").getComponent(Label).string = errorMsg;
    this.nonerrorLayer!.active = true;
  }
  inActiveErrorLayer(){
    this.errorLayer.active = false;
  }
  inActivenonErrorLayer(){
    this.nonerrorLayer.active = false;
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
  onRemeberMe(toggle :Toggle){
    //console.log(toggle.isChecked);
    this.rememberMe = toggle.isChecked;
  }
  showPassword(toggle :Toggle){
    if(toggle.isChecked){
      this.passwordEb.inputFlag = 5;
    }else{
      this.passwordEb.inputFlag = 0;
    }
  }
  //Change Scene methods
  onSignUp(event: Event){
    // open sign up module
    
    director.loadScene("registration");
  }
  onForgetPassword(){
    // open forget password module
    director.loadScene("forgotPassword");
  }

  //API calls
  onLogin(){
    SoundManager.getInstance().playSoundEffect(this.buttonClick);
    if(!this.checkIfFormIsValid()){
      return;
    }
    let onSuccess = (data: any) =>{
      this.stopLoader();
      //console.log("on success data",data);
      //console.log("on success json object", JSON.parse(data));
      data = JSON.parse(data);

      this.activenonErrorLayer(data.msg);
      const token = data.data.token;
      sessionStorage.setItem('jwtToken', token);
      // if(this.rememberMe){
      //   const token = data.data.token;
      //   //set Token to Local Storage
      //   localStorage.setItem('jwtToken', token);
      // }
      this.onLoginPageLoad(true);
    }
    let onError = (data : any) =>{
      this.stopLoader();
      //console.log("on faiure data", data);
      //console.log("on faiure json object", JSON.parse(data));
      data = JSON.parse(data);
      this.activeErrorLayer(data.msg);
    }
    this.startLoader();

    //console.log("username", this.usernameEb.string, this.passwordEb.string);
    NetworkManager.getInstance().sendRequest(API_END_POINTS.LOG_IN, 
    REQUEST_TYPE.POST, {
      emailOrUsername : this.usernameEb.string,
      password        : this.passwordEb.string
    },
    onSuccess,
    onError);
  }

  onLoginPageLoad(isAfterLogin: boolean){
    let onSuccess = (data: any) =>{
      this.stopLoader();
      //console.log("on success data",data);
      //console.log("on success json object", ); 
      data = JSON.parse(data)
      UserDetails.getInstance().setUserDetails(data.data);
      //console.log("userDetails", UserDetails.getInstance().getUserDetails() , data.data);
      // isAfterLogin ? director.loadScene("about") : director.loadScene("home");
      gameManager.getInstance().doNeedtoShowWelcomePopUp(!isAfterLogin);
      director.loadScene("about");
      // this.activeErrorLayer(data.msg);  
      // this.startImage.node.active = false;
    } 
  
    let onError = (data : any) =>{
      this.stopLoader();
      //console.log("on faiure data", data);
      //console.log("on faiure json object", JSON.parse(data));
      this.loader.active = false;
      // this.startImage.node.active = false;
    }

    this.startLoader();
    NetworkManager.getInstance().sendRequest(API_END_POINTS.USER_PROFILE, 
    REQUEST_TYPE.GET, {},
    onSuccess,
    onError,true);
  }
}
