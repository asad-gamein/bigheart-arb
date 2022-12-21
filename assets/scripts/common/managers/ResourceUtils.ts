
import { _decorator,  Constructor, Asset, error,  resources,LoadCompleteCallback, AudioClip, Prefab } from "cc";
import { PREVIEW } from "cc/env";
const { ccclass, property } = _decorator;
export type AssetType<T = Asset> = Constructor<T>;
@ccclass('ResourceUtils')
export class ResourceUtils {
    _countAudioFiles : AudioClip[] = [];
    _countryAudioFiles : AudioClip[] = [];
    _VideosFiles = [];
    _musicClips =[];

    gameRresoucesIndex = 0;
    prefabs = ["Education", "Livelihood"];

    _gamesResources : Record<string , any> = {};
    // _gamesPrefabs : Record<string, any> ={};

     public static _instance : ResourceUtils;
     public static getInstance(){
         if(!ResourceUtils._instance){
            ResourceUtils._instance = new ResourceUtils();  
         }

         return ResourceUtils._instance;
     }


    
    public loadNumberAudio(){
        // console.log("Audio Check1");
        return new Promise((resolve, reject) => {
            // console.log("Audio Check2");
            if (this._countAudioFiles.length > 0) {
                // console.log("Audio Check3");
                resolve(this._countAudioFiles);
            } else {
                // console.log("Audio Check4");
                resources.loadDir(`Audio/Numbers` , (err: Error|null, data: AudioClip[]) => {
                    // console.log("Audio Check5");
                    if (err) {
                        // console.log("Audio Check6");
                        reject(err);
                        error("load audio files :" + err);
                    }else{
                        this._countAudioFiles = data; 
                        // console.log("Audio Check7");
                        // console.log("audio files downlaoded", this._countAudioFiles)    
                    }
                    resolve(this._countAudioFiles);
                });
            }
        });
    }


    public loadCountriesAudio(){
        return new Promise((resolve, reject) => {
            if (this._countryAudioFiles.length > 0) {
                resolve(this._countryAudioFiles);
            } else {
               resources.loadDir(`Audio/Countries` , (err: Error|null, data: AudioClip[]) => {
                   
                    if (err) {
                        reject(err);
                        error("load audio files :" + err);
                    }else{
                       
                            this._countryAudioFiles = data;       
                            // console.log("audio his._countryAudioFiles  downlaoded", this._countryAudioFiles );
                    }
                    resolve(this._countryAudioFiles);
                });
            }
        });
    }



    public loadGameResources(gameName:string){
       
        return new Promise((resolve, reject)=>{
            if(this._gamesResources[gameName]){
                return resolve(this._gamesResources[gameName]);
            }else{
                resources.loadDir(gameName, (err: Error|null, data: Asset[]) => {    
                    if (err){
                        reject(err);   
                    }else{
                        this._gamesResources[gameName] = data;   
                        //console.log("game resources",   this._gamesResources);
                    }
                    resolve(this._gamesResources[gameName]);
                });
            }
        })
    }
  

    public getAudioClip(name:string) : AudioClip|undefined{
        if(this._countAudioFiles){
            let clip : AudioClip|undefined= this._countAudioFiles.find(clip => clip.name == name);
            return clip ;
        }

        return undefined;
    }


    public getCountryClip(name:string){
        if(this._countryAudioFiles){
            //console.log("clip", name,this._countryAudioFiles)
            let clip = this._countryAudioFiles.find(clip => clip.name == name);
            return clip || null;
        }
    }

    getGameResources(gameName: string, reseouceName:string){
        if(this._gamesResources[gameName]){
            let resource : Asset[] = this._gamesResources[gameName];
            let clip = resource.find(clip => clip.name == reseouceName);
            return clip || null;
        }
    }


    getGamePrefab(gameName: string){
        if(this._gamesResources[gameName]){
             let resource : Asset[] = this._gamesResources[gameName];
            //console.log("resource",resource);
            let prefab : Prefab = resource.find(asset => asset instanceof Prefab);
            //console.log("prefab",prefab);
            return prefab || null;
            // return clip || null;
        }
    }


    public static loadRes<T extends Asset>(url: string, type: AssetType<T> | null, cb?: LoadCompleteCallback<T>) {
        if(type){
            resources.load(url, type, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res);
                    }

                    return;
                }

                if (cb) {
                    cb(err, res);
                }
            });
        } else {
            resources.load(url, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res as T);
                    }

                    return;
                }

                if (cb) {
                    cb(err, res as T);
                }
            });
        }
    }



    
}


