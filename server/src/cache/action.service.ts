
import { IcacheHashKey, ItypeList } from "./action.interface";
import ClientBox from "../model/ClientBox"
import ServerInfo from '../utils/serverInfo';

const fs = require('fs');

//import * as asyncRedis from "async-redis";
import moment from 'moment';
//const asyncRedis = require("async-redis");
//const client: any = asyncRedis.createClient();

export default class ActionService {

    private _connConfig: any = null;
 
    private _clientBoxList: ClientBox[] = [];
   
    private _db: number = 0;

    private _serverInfo: ServerInfo = new ServerInfo(this);

    constructor() {
        this._serverInfo.start();
    }


    public get clientBoxList(): ClientBox[] {
        return this._clientBoxList;
    }
    public set clientBoxList(value: ClientBox[]) {
        this._clientBoxList = value;
    }

    public get connConfig(): any {
        return this._connConfig;
    }
    public set connConfig(value: any) {
        this._connConfig = value;
    }

    public get db(): number {
        return this._db;
    }
    public set db(value: number) {
        this._db = value;
    }


    public currentClient = async () => {

        if (!this._connConfig) {
            var hostList: any = await this.readHostList();
            this._connConfig = hostList.hostList[hostList.active];
        }

        var clientBox: ClientBox | undefined = this._clientBoxList.find(item => item.db === this._db);

        if (!clientBox) {
            clientBox = await new ClientBox(this._db, this._connConfig);
            this._clientBoxList.push(clientBox);
        }

        var client: any = clientBox.client;

        return client;

    }


    public set = async (body: any) => {

        var client = await this.currentClient();

        var key = body.key;
        var value = body.value;
        await client.set(key, value);

    }


    public get = async (body: any): Promise<string> => {

        var client = await this.currentClient();

        var key = body.key;

        var value: string = await client.get(key);

        return value;

    }


    public hmset = async (body: any) => {

        var client = await this.currentClient();

        var hasheName = body.key;

        var value = body.value;

        await client.hmset(hasheName, value);

    }


    public hset = async (body: any) => {

        var hasheName = body.key;

        var client = await this.currentClient();

        var field = body.field;

        var value = body.value;

        await client.HSET(hasheName, field, value);

    }

    public hvals = async (body: any): Promise<string[]> => {

        var hasheName = body.key;

        var client = await this.currentClient();

        var value = await client.hvals(hasheName);

        return value;

    }


    public hget = async (body: any): Promise<string> => {

        console.log(body);

        var hasheName = body.key;

        var client = await this.currentClient();

        var field = body.field;
        var value = await client.HGET(hasheName, field);

        console.log(value);

        console.log(typeof value);

        return value;

    }

    public keys = async (body: any): Promise<ItypeList> => {

        var client = await this.currentClient();

        var result: ItypeList = {
            string: [],
            hashe: [],
            list: []
        }

        var keys = await client.keys('*');

        //console.log(keys);

        for (let key of keys) {

            let type = await client.type(key);

            // console.log(type);

            switch (type) {

                case "string":
                    result.string.push(key);
                    break;
                case "hash":
                    result.hashe.push(key);
                    break;
                case "list":
                    result.list.push(key);
                    break;
            }
        }

        //console.log(result);

        return result;
    }

    public hkeys = async (body: any): Promise<string[]> => {

        var client = await this.currentClient();

        var hasheName = body.key;

        console.log('debug');
        console.log(client);

        var result = await client.HKEYS(hasheName);

        return result;

    }


    public lrpush = async (body: any) => {

        var client = await this.currentClient();

        var listName = body.key;

        var value = body.value;

        await client.RPUSH(listName, value);

    }

    public llpush = async (body: any) => {

        var client = await this.currentClient();

        var listName = body.key;

        var value = body.value;

        await client.LPUSH(listName, value);

    }

    public lrange = async (body: any): Promise<string[]> => {

        var client = await this.currentClient();

        var listName = body.key;

        var start = body.start;

        var end = body.end;

        var value = await client.LRANGE(listName, start, end);

        return value;

    }



    public llen = async (body: any): Promise<string> => {


        var client = await this.currentClient();

        var listName = body.key;

        var value = await client.LLEN(listName);

        return value.toString();

    }


    public lset = async (body: any) => {


        var client = await this.currentClient();

        var listName = body.key;

        var id = body.id;

        var value = body.value;

        await client.LSET(listName, id, value);


    }


    public getInternal = async (body: any): Promise<string> => {

        return this._serverInfo.serverStatus;

    }

    public getInfo = async () : Promise<string> => {

        var client = await this.currentClient();
        var info: string = await client.info();
        return info;

    }

    public selectDB = async (body: any) => {

        var db = body.db;
        this._db = db;

    }


    public testClient = async (config: any) => {

        var testingResult: boolean = false;

        try {

            var clientBox = await new ClientBox(0, config);

            console.log(clientBox);

            var client = clientBox.client;
    
            var info = await client.info();

            console.log(info);

            var infoDetails = info.split("\r\n");

            console.log(infoDetails);

            testingResult = true;

        } catch (err) {

            console.log(err);

        }

        return testingResult;
    
    }

    public saveHostList = async (hostList: any) => {

        try {
            var context = JSON.stringify(hostList);
            fs.writeFileSync('./hostList.json', context);
            var activeConfig = hostList.hostList[hostList.active];
            this._connConfig = activeConfig;
            this._clientBoxList.length = 0;

            // file written successfully
        } catch (err) {
            console.error(err);
        }

    }


    public readHostList = async () => {

        var hostList = {};

        try {
            const context = fs.readFileSync('./hostList.json');
            hostList = JSON.parse(context)
            // file written successfully
        } catch (err) {
            console.error(err);
        }

        return hostList;

    }

}
