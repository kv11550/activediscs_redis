import React, { useState, useEffect, useReducer } from 'react';
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

    const [idList, setIdList] = useState([0]);

    const [id, setId] = useState(0);

    const newValue = useSelector((state: any) => state.newValue);

    const getIdList = async () => {

        const max: any = await runCommand('api/cache/llen', {
            key: contextKey
        });

        var listIdList = [...Array(Number(max))].map((item: any, index: number) => index);

        //   setIdList(listIdList);

        //   if (listIdList.length > 0) {
        //       await getValue(0);
        //   }

        setListIds({
            idList: listIdList
        });


    }


    const [listIds, setListIds] = useReducer((state: any, action: any) => {

        console.log('debug');
        console.log(action);
        console.log(state);

        var newState = { ...state, filter: action.filter, idList: state.fullIdList };

        if (action.filter) {
            newState = {
                filter: action.filter,
                idList: state.fullIdList.filter((id: number) => id.toString().includes(action.filter)),
                fullIdList: state.fullIdList
            };
        };

        if (action.idList) {
            newState = {
                filter: '',
                idList: action.idList,
                fullIdList: action.idList
            }
        }

        console.log(newState);

        return newState;
    }, { filter: '', fullIdList: [], idList: [] });


    const handleFilterChange = async (event: any) => {

        setListIds({
            filter: event.target.value
        })

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

        dispatch({
            type: ActionType.SHOW_MESSAGE, payload: {
                time: new Date().toString(),
                payload: `List ${contextKey} Id: ${id} is saved`
            }
        })

    }


    const download = () => {
        var blob = new Blob([newValue], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `List_${contextKey}_${id}.txt`);
    }


    useEffect(() => {

        getIdList();

    }, [contextKey]);


    useEffect(() => {

        if (listIds.idList.length > 0) {
            getValue(listIds.idList[0]);
        } else {
            dispatch({
                type: ActionType.NEW_VALUE, payload: ''
            })
        }

    }, [listIds]);


    return (

        <div className="grid grid-cols-12 gap-2 flex-shrink-0 w-full">

            <div className="col-span-12 bg-blue-100 flex  ">
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

            <div className="col-span-1 bg-white flex flex-col">

                <textarea className="text-sm px-3 border-b border-gray-300 ml-1 my-2" style={{ resize: "none" }}
                    placeholder="Search" rows={1} value={listIds.filter}
                    onChange={handleFilterChange} />

                <ul className="bg-white rounded-lg border text-sm border-gray-200 w-full text-gray-900">
                    {
                        listIds.idList.map((item: any) => (
                            <li className={`px-2 py-1 mb-1 border-b border-gray-200 w-full overflow-x-auto ${id === item ? "bg-gray-200" : ''}  `} onClick={() => getValue(item)}>
                                {`${item}`}
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

