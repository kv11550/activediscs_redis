import React, { useState, useEffect } from 'react';
import { runCommand, setToken } from '../services/restfulClient';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../store/Helpers';
import ContextDetails from './ContextDetails';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faDownload } from '@fortawesome/free-solid-svg-icons'


const classNames = require('classnames');

const NewItemPage = (props: any) => {

    const { classes, contextKey } = props;

    const dispatch = useDispatch();

    const [idList, setIdList] = useState([0]);

    const [id, setId] = useState(0);

    const newValue = useSelector((state: any) => state.newValue);

    const getIdList = async () => {

        const max: any = await runCommand('api/cache/llen', {
            key: contextKey
        });

        var listIdList = [...Array(Number(max))].map((item: any, index: number) => index);

        setIdList(listIdList);

        if (listIdList.length > 0) {
            await getValue(0);
        }

    }

    const getValue = async (id: number) => {

        const result: any = await runCommand('api/cache/lrange', {
            key: contextKey,
            start: id,
            end: id
        });

        if (Array.isArray(result) && result.length > 0) {
            var context: string = typeof result[0] !== 'string' ? JSON.stringify(result[0]) : result[0];
            dispatch({
                type: ActionType.NEW_VALUE, payload: context
            })
        }

        setId(id);

    }


    const saveNewValue = async () => {

        await runCommand('api/cache/lset', {
            key: contextKey,
            id: id,
            value: newValue
        });
    }



    const download = () => {
        var blob = new Blob([newValue], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `List_${contextKey}_${id}.txt`);
    }



    useEffect(() => {

       // getIdList();

    }, []);


    return (

        <div className="grid grid-cols-12 gap-2 flex-shrink-0 w-full">

            <div className="col-span-12 bg-white flex  ">
                <nav className="relative w-full flex flex-wrap items-center justify-between py-2 border-b 0  shadow-lg">
                    <div className="container-fluid px-2">
                        <div className="flex items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mt-2 lg:mt-0 mr-1">
                            <span className="font-bold text-lg text-blue-600">List:</span>
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

            <div className="col-span-12 bg-white flex ">

                <div className="flex justify-center">
                    <div>
                        <div className="form-check">
                            <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
                                    String
                                </label>
                            </input>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
                                    Hash
                                </label>
                            </input>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="flexRadioDefault" id="flexRadioDefault3" checked>
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault3">
                                    List
                                </label>
                            </input>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 bg-white flex ">
                <ContextDetails value={newValue} />
            </div>
        </div>

    );
};

export default NewItemPage as any;

