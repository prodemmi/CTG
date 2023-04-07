const { exec } = require("child_process")
import _ from "lodash";
import { frameworks } from ".";
import { Framework } from "../types";

export const run = (command: string) => new Promise((r, e) => exec(command, (error, stdout, stderr) => {
    if (error) {

        r(error);
        return;
    }
    if (stderr) {

        r(stderr);
        return;
    }

    r(stdout);

}));

export const getFramework = (type: string): typeof Framework => {
    
    return _.find(frameworks, { name: type })

}

export const getNestedKeys = (array: any[]): string[] => {

    let keys = [] as string[];

    for (let key in array) {

        keys.push(key);

        const val = array[key];
        const valIsObject = typeof (val) === "object";
        const valIsNotNull = val !== null;
        const valIsNotArray = !Array.isArray(val);

        if (valIsObject && valIsNotNull && valIsNotArray) {
            const _keys = getNestedKeys(val);
            keys = keys.concat(_keys);
        }

    }

    return keys;
}

export const nestedKeyExists = (array: any[], keys: string[]): Boolean => {

    const nestedKeys = getNestedKeys(array);

    return keys.every(k => nestedKeys.indexOf(k) !== -1 );

}