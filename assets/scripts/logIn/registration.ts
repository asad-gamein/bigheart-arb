
import { _decorator, Component, Node, EditBox, Button, director, SceneAsset, AudioClip, Sprite, Prefab, instantiate, AudioSource, Label, Toggle, tween } from 'cc';

import { NetworkManager } from '../common/network/NetworkManager';
import { REQUEST_TYPE, API_END_POINTS, DEPLOYMENT_MODE, SERVER } from '../common/network/NetworkConfig';
import { UserDetails } from '../common/managers/userDetails';
import { SoundManager } from '../common/managers/SoundManager';
const { ccclass, property } = _decorator;


@ccclass('Registration')
export class Registration extends Component {

    selectedGender = 2;
    errorLayer : Node =  null!;
    loaderLayer : Node =  null!;
    loaderAction : Node = null!;


    @property({type: EditBox,  displayName : "Fist Name Editbox"})
    fName = new EditBox();

    @property({type: EditBox, displayName : "Last Name Editbox"})
    lName = new EditBox();

    @property({type: EditBox, displayName : "User Name Editbox"})
    username = new EditBox();

    @property({type: EditBox, displayName : "Email  Editbox"})
    email = new EditBox();

    @property({type: EditBox, displayName : "Password  Editbox"})
    password = new EditBox();

    @property({type: Button, displayName : "Girl Button"})
    girl = new Button();

    @property({type: Button, displayName : "Boy Button"})
    boy = new Button();

    @property(Prefab)
    errorPrefab = null;

    @property(Prefab)
    loaderPrefab = null;

    @property(Button)
    signUpButton = null;

    @property(AudioClip)
   buttonClick : AudioClip = null!;  


    start () {

        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        NetworkManager.getInstance().init(SERVER);
        this.errorLayer = instantiate(this.errorPrefab); 
        this.node.addChild(this.errorLayer);
        this.inActiveErrorLayer();
        this.loaderLayer = instantiate(this.loaderPrefab); 
        this.node.addChild(this.loaderLayer);
        this.loaderLayer.active = false;
        if(sessionStorage.getItem('jwtToken')){
            // that is user has already loged in In that case show home screen
            //console.log("inside this jwttojkn");
            director.loadScene('home');

        }




    }

    openLogin () {
        director.loadScene("login");

    }

    onSignUp () {
        SoundManager.getInstance().playSoundEffect(this.buttonClick);
        if(!this.checkIfFormIsValid()){
            return;
        }

  

        let onSuccess = (data: any) =>{
            this.stopLoader();
            data = JSON.parse(data)
            //console.log("inisde thie",data );
            const token = data.user.token;
            sessionStorage.setItem('jwtToken', token);
            //console.log(" on success data",data, sessionStorage.getItem('jwtToken'));
            UserDetails.getInstance().setUserDetails(data.user);
           
            director.loadScene("about",);
           
        } 

        let onError = (data : any) =>{
            this.stopLoader();
            this.activeErrorLayer(JSON.parse(data).msg);
            //console.log("on faiure data", data);
        }

        this.startLoader();
    

        NetworkManager.getInstance().sendRequest(API_END_POINTS.REGISTER, 
        REQUEST_TYPE.POST, {
            firstName       : this.fName.string,
            lastName        : this.lName.string,
            userName        : this.username.string,
            gender          : this.selectedGender,
            profilePicture  : 0,
            email           : this.email.string,
            password        : this.password.string
        },
        onSuccess,
        onError);
    }

    onEditingDidEnded(editbox : EditBox){
        this.inActiveErrorLayer();
        let validate = editbox.node.getComponent("FieldValidator").doValidation(editbox.string);
        if(!validate.isValid){
            this.activeErrorLayer(validate.message);
        }
    }

 

    showPassword(toggle :Toggle){
        if(toggle.isChecked){
            this.password.inputFlag = 5;
        }else{
            this.password.inputFlag = 0;
        }
    }

    onGenerSelection(event: Event, option:string){
        let gender = parseInt(option);
        this.selectedGender = gender;
        if( gender == 1){
            this.boy.node.getComponent(Sprite)!.enabled = true;
            this.girl.node.getComponent(Sprite)!.enabled = false;
        }else{
            this.boy.node.getComponent(Sprite)!.enabled = false;
            this.girl.node.getComponent(Sprite)!.enabled = true;
        }
    }

    checkIfFormIsValid(){
        this.inActiveErrorLayer();
        let isFNameValid    = this.fName.getComponent("FieldValidator").doValidation(this.fName.string);
        let isLNameValid    = this.lName.getComponent("FieldValidator").doValidation(this.lName.string);
        let isUsernameValid = this.username.getComponent("FieldValidator").doValidation(this.username.string);
        let isEmailValid    = this.email.getComponent("FieldValidator").doValidation(this.email.string);
        let isPasswordValid = this.password.getComponent("FieldValidator").doValidation(this.password.string);

        switch(false){
            case isFNameValid.isValid: this.activeErrorLayer(isFNameValid.message);
                //console.log('isFNameValid');
                return false;
            case isLNameValid.isValid: this.activeErrorLayer('Please enter an appropriate last name');
                //console.log('isLNameValid');
                return false;
            case isUsernameValid.isValid: this.activeErrorLayer(isUsernameValid.message);
                //console.log('isUsernameValid');
                return false;
            case isEmailValid.isValid: this.activeErrorLayer(isEmailValid.message);
                //console.log('isEmailValid');
                return false;
            case isPasswordValid.isValid: this.activeErrorLayer(isPasswordValid.message);
                //console.log('isPasswordValid');
                return false;
        }
        return true;
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
}


