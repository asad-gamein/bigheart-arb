export class UserDetails {
   


    private static intance : UserDetails;
    private firstName : string = "";
    private lastName : string = "";
    private username : string = "";
    private gender : number = 2;
    private email : string = "";
    private numberOfHeart : number = 0;




    static getInstance(){
        if(!UserDetails.intance){
            UserDetails.intance = new UserDetails();
        }
        return UserDetails.intance;
    }

    setUserDetails({firstName, lastName, userName, gender, email, noOfHearts} :
         {firstName : string, lastName : string, userName : string, gender : number, email: string, noOfHearts : number}){

            //console.log(firstName, lastName, userName, gender, email, noOfHearts);
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = userName;
        this.gender = gender;
        this.email = email;
        this.numberOfHeart = noOfHearts;
    }


    getUserDetails(){
        return {
            firstName : this.firstName,
           lastName : this.lastName,
            username: this.username,
            gender : this.gender,
           email : this.email,
        }
    }


}