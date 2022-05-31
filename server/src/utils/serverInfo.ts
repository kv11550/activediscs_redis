
import moment from 'moment';
import { delay } from '../utils/utils';
import ActionService from "../cache/action.service";

export default class ServerInfo {

    private _memory: number;

    private _memoryList: any[] = [];
    
    private _version: string;

    private _uptime_in_days: number;

    private _actionService: ActionService;

    private _commands_processed: number;

    private _connected_clients: number;

    private _serverName: string;


    public get memory(): number {
        return this._memory;
    }
    public set memory(value: number) {
        this._memory = value;
    }

    public get version(): string {
        return this._version;
    }
    public set version(value: string) {
        this._version = value;
    }

    public get memoryList(): any[] {
        return this._memoryList;
    }
    public set memoryList(value: any[]) {
        this._memoryList = value;
    }

    public get uptime_in_days(): number {
        return this._uptime_in_days;
    }
    public set uptime_in_days(value: number) {
        this._uptime_in_days = value;
    }

    public get serverName(): string {
        return this._serverName;
    }
    public set serverName(value: string) {
        this._serverName = value;
    }

    public get serverStatus() : any {
        return {
            memory: this._memory,
            version: this._version,
            uptime_in_days: this._uptime_in_days,
            commands_processed: this._commands_processed,
            connected_clients: this._connected_clients,
            memoryList: this._memoryList,
            serverName: this._serverName
        }
    }


    constructor(actionService: ActionService) {
        this._memory = 0;
        this._version = "";
        this._uptime_in_days = 0;
        this._commands_processed = 0;
        this._connected_clients = 0;
        this._actionService = actionService;
        this._serverName = '';
    }

    public async start() {

        while (1 === 1) {

            await delay(5000);

         //   var info = await this._actionService.getInfo();

         //   console.log(info);
            await this.processInfo()

        }
    } 
    
    
    private async processInfo() {

        var info = await this._actionService.getInfo();

        this._serverName = this._actionService.connConfig.name;

       // console.log(info);

        var infoList = info.split("\r\n");

        this._memory = Number(this.convertValue(infoList, "used_memory"));

        this._version = this.convertValue(infoList, "redis_version");

        this._uptime_in_days = Number(this.convertValue(infoList, "uptime_in_days"));

        this._commands_processed = Number(this.convertValue(infoList, "total_commands_processed"));

        this._connected_clients = Number(this.convertValue(infoList, "connected_clients"));


        var newItem = {
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            value: this._memory
        }

        this._memoryList.push(newItem);

      //  console.log(this._memory);

    }

    private convertValue(infoList: string[], name: string) {

        var valueString = "";
        valueString += infoList.find(item => item.includes(`${name}:`))?.replace(`${name}:`, '');
        return valueString;

    }

}