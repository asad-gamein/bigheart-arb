
import { _decorator, Component, Node, EditBox, Prefab, instantiate, Label, AudioSource, director, Button, AudioClip, tween, DebugMode } from 'cc';
import { NetworkManager } from '../common/network/NetworkManager';
import { REQUEST_TYPE, API_END_POINTS, DEPLOYMENT_MODE, SERVER } from '../common/network/NetworkConfig';
import { FieldValidator } from '../validators/FieldValidator';
import { SoundManager } from '../common/managers/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('ForgotPassword')
export class ForgotPassword extends Component {

    @property({ type: EditBox, displayName: "Email Editbox" })
    public emailEditBox = null;

    @property({ type: Button, displayName: "Submit Button" })
    public submitButton = null;

    @property(Prefab)
    errorPrefab = null;

    @property(Prefab)
    loaderPrefab = null;

   

@property(AudioClip)
buttonClick : AudioClip = null!;


    errorLayer = null;
    errorLabel = null;

    loaderLayer = null;
    loaderAction = null;

    fieldValidator = null;

    start() {
        SoundManager.getInstance().init(this.node.getComponent(AudioSource)!);
        NetworkManager.getInstance().init(SERVER);
        if (this.emailEditBox) {
            this.fieldValidator = this.emailEditBox.node.getComponent("FieldValidator")            
        } else {
            console.error("Email edit box refrence is NULL");
        }

        if (this.errorPrefab) {
            this.errorLayer = instantiate(this.errorPrefab);
            this.node.addChild(this.errorLayer);
            this.errorLayer.active = false;
            this.errorLabel = this.errorLayer.getChildByName("ErrorMsg").getComponent(Label);
        } else {
            console.error("Error prefab refrence is NULL");
        }

        if (this.loaderPrefab) {
            this.loaderLayer = instantiate(this.loaderPrefab);
            this.node.addChild(this.loaderLayer);
            this.loaderLayer.active = false;
        } else {
            console.error("LoaderLayer prefab refrence is NULL");
        }
    }
   
    SubmitButtonClicked() {

        let validate = this.fieldValidator.doValidation(this.emailEditBox.string);
        if (!validate.isValid) {
            this.errorLabel.string = validate.message;
            this.errorLayer.active = true;
            return;
        }
        else{
            this.errorLayer.active = false;
        }

        let onSuccess = (data: any) => {
            //console.log("SUCCESS " + data);
            try {                
                let ans = JSON.parse(data);
                //console.log(ans.msg);
                this.errorLabel.string = ans.msg;
                this.errorLayer.active = true;
            } catch (e) {
                //console.log("EXCEPTION ",e);
            }
            SoundManager.getInstance().playSoundEffect(this.buttonClick);
            this.stopLoader();
        }
        let onError = (data: any) => {
            //console.log("FAILURE " + data);
            try {                
                let ans = JSON.parse(data);
                //console.log(ans.msg);
                this.errorLabel.string = ans.msg;
                this.errorLayer.active = true;
            } catch (e) {
                //console.log("EXCEPTION ",e);
            }
            this.stopLoader();
        }


        try {
            this.startLoader();
            NetworkManager.getInstance().sendRequest(API_END_POINTS.FORGET_PASSWORD,
                REQUEST_TYPE.POST, {
                email: this.emailEditBox.string,
            },
                onSuccess,
                onError);
        } catch (e) {
            //console.log("EXCEPTION " , e);
            this.stopLoader();
        }
        
    }


    onEditingEnd(editbox: EditBox) {
        
        let validate = editbox.node.getComponent("FieldValidator").doValidation(editbox.string);
        if (!validate.isValid) {
            this.errorLabel.string = validate.message;
        }
        this.errorLayer.active = !validate.isValid;
    }

    OnBackButtonPressed() {
        director.loadScene("login");
    }

    startLoader() {
        this.loaderAction = tween(this.loaderLayer.getChildByName("LoaderIcon"))
            .by(0.1, { angle: -40 })
            .repeatForever()
            .start();
        this.loaderLayer.active = true;
    }

    stopLoader() {
        this.loaderLayer.active = false;
        this.loaderAction.stop();
    }
}