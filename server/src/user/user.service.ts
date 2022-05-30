import * as os from 'os';
import internal from 'stream';
import moment from 'moment';
import { config } from '../config/config';

export const validateUser = (body: any) => {

    var result = null;

    const password: string = config.pass || '';

    if (body) {
        var username = body.username;
        var pass = body.pass;
        if (pass === password) {
            result = {
                user: username,
                access_token: "yes"
            };
        }
    }

    return result;

}


const getLimitedStatus = (data: any[]) => {

    var quot: number = ~~(data.length / 100);

    if (quot === 0)
        quot = 1;

    var limitedData = data.reduce((result: any[], item: any, index: number) => {
        if (index % quot === 0) {
            result.push(item);
        };
        return result;
    }, [])

  
    if (data.length > 0) {
        var first = data[0];
        var last = data[data.length - 1];

        limitedData = limitedData.filter(item => item.time !== first.time && item.time !== last.time);
        limitedData = [first].concat(limitedData).concat([last]);
    }


    return limitedData;

}



