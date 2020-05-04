export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private tokenExpirationDate: Date
    ) {}

    // If the users has expired we return a null value. if not, the token is valid
    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    //calculate the remaining time until a user is auto logged out
    get tokenDuration() {
        // if we dont have a token, return zero
        if(!this.token) {
            return 0;
        }
        //return 5000; test to see if auto logout occurs after 5 seconds
        // otherwise return new date/timestamp for duration in milliseconds
        return this.tokenExpirationDate.getTime() - new Date().getTime();

    }
}