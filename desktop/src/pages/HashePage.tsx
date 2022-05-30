import React, { useState, useEffect } from 'react';
import { runCommand, setToken } from '../services/restfulClient';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../store/Helpers';
import ContextDetails from './ContextDetails';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faDownload } from '@fortawesome/free-solid-svg-icons'

const classNames = require('classnames');

const HashePage = (props: any) => {


    const { classes, contextKey } = props;

    const dispatch = useDispatch();

    const [hasheKeyList, setHashKeyList] = useState([]);

    const [field, setField] = useState('');

    const newValue = useSelector((state: any) => state.newValue);

    const getHkeys = async () => {

        const result: any = await runCommand('api/cache/hkeys', {
            key: contextKey
        });

        setHashKeyList(result);

        if (result.length > 0) {
            await getValue(result[0]);
        }

    }

    const getValue = async (field: string) => {

        const result: any = await runCommand('api/cache/hget', {
            key: contextKey,
            field: field
        });

        dispatch({
            type: ActionType.NEW_VALUE, payload: result
        })

        setField(field);

    }

    const saveNewValue = async () => {

        await runCommand('api/cache/hset', {
            key: contextKey,
            field: field,
            value: newValue
        });
    }

    const download = () => {
        var blob = new Blob([newValue], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `Hashe_${contextKey}_${field}.txt`);
    }

    useEffect(() => {

        getHkeys();

    }, [contextKey]);

    return (

        <div className="grid grid-cols-12 gap-2 flex-shrink-0 w-full">

            <div className="col-span-12 bg-white flex  ">
                <nav className="relative w-full flex flex-wrap items-center justify-between py-2 border-b 0  shadow-lg">
                    <div className="container-fluid px-2">
                        <div className="flex items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mt-2 lg:mt-0 mr-1" >
                            <span className="font-bold text-lg text-blue-600">Hashe:</span>
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
                    </div>

                </nav>
            </div>

            <div className="col-span-1 bg-white flex ">

                <ul className="bg-white rounded-lg border text-sm border-gray-200 w-full text-gray-900">
                    {
                        hasheKeyList.map(item => (
                            <li className={`px-2 py-1 mb-1 border-b border-gray-200 w-full overflow-x-auto ${field === item ? "bg-gray-200" : ''}  `} onClick={() => getValue(item)}>
                                {item}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="col-span-11 bg-white flex ">
                <ContextDetails value={newValue} />
            </div>
        </div>


    );
};


export default HashePage as any;

