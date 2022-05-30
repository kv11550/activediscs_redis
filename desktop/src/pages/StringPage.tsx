import React, { useState, useEffect } from 'react';
import { runCommand, setToken } from '../services/restfulClient';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../store/Helpers';
import ContextDetails from './ContextDetails';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faDownload } from '@fortawesome/free-solid-svg-icons'

const classNames = require('classnames');

const StringPage = (props: any) => {

    const { classes, contextKey } = props;

    const dispatch = useDispatch();

    const newValue = useSelector((state: any) => state.newValue);

    const getValue = async () => {

        const result: any = await runCommand('api/cache/get', {
            key: contextKey
        });

        dispatch({
            type: ActionType.NEW_VALUE, payload: result
        })

    }

    const download = () => {
        var blob = new Blob([newValue], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `String_${contextKey}.txt`);
    }

    const saveNewValue = async () => {

        await runCommand('api/cache/set', {
            key: contextKey,
            value: newValue
        });
    }

    useEffect(() => {

        getValue();

    }, [contextKey]);


    return (
        <div>
            <nav className="relative w-full flex flex-wrap py-2 border-b 0  shadow-lg">

                <div className="container-fluid px-2">

                    <span className="font-bold text-lg text-blue-600">String:</span>
                    <span className="font-medium text-sm text-gray-600 ml-1">{contextKey}</span>

                    <button className="bg-blue-400 active:bg-blue-500 rounded shadow hover:shadow-md outline-none focus:outline-none text-white ease-linear transition-all absolute w-9 right-2" type="button"
                        onClick={download} data-bs-toggle="tooltip" data-bs-placement="top" title="download" >
                        <FontAwesomeIcon icon={faDownload} />

                    </button>

                    <button className="bg-blue-400 active:bg-blue-500 rounded shadow hover:shadow-md outline-none focus:outline-none text-white ease-linear transition-all absolute w-9 mr-2 right-10" type="button"
                        onClick={saveNewValue} data-bs-toggle="tooltip" data-bs-placement="top" title="Save value" >
                        <FontAwesomeIcon icon={faFloppyDisk} />

                    </button>

                </div>

            </nav>

            <ContextDetails contextKey={contextKey} value={newValue} />

        </div>
    );
};


export default StringPage as any;
