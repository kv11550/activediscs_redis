import { createClient } from 'redis';
import { delay } from '../utils/utils';

export default class ClientBox {

    private _config: any;

    private _db: number;

    private _client: any;

    private _status: any;
  
    public get db(): number {
        return this._db;
    }
    public set db(value: number) {
        this._db = value;
    }

    public get client(): any {
        return this._client;
    }
    public set client(value: any) {
        this._client = value;
    }

    public get config(): any {
        return this._config;
    }
    public set config(value: any) {
        this._config = value;
    }

    public get status(): any {
        return this._status;
    }
    public set status(value: any) {
        this._status = value;
    }


    public async connect(db: number, config?: any) {

        var result = "Error";

        var redisConfig = {};
        if (!config || !config.address || !config.port)
            return result;
        else
            redisConfig = {
                "socket": {
                    "host": config.address,
                    "port": config.port
                },
                "password": config.password
            }

        this._client = createClient(redisConfig);

        await this._client.connect();

        //  await delay(1000);

        await this._client.select(this._db);

        result = "Ok";

        return result;

    }

    /*
    
    public async test(config: any) {
    
        this._client = createClient(config);
    
        await this._client.connect();
    
    }
    */


    //Async/Await Class Constructor
    //https://stackoverflow.com/questions/43431550/async-await-class-constructor

    constructor(db: number, config?: any) {

        this._db = db;
        return (async (): Promise<ClientBox> => {

            this._status = await this.connect(db, config)
            return this;

        })() as unknown as ClientBox;

    }

}
