import React, { useState, useEffect } from 'react';
import { runCommand, setToken } from '../services/restfulClient';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '../store/Helpers';
import ContextDetails from './ContextDetails';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faDownload } from '@fortawesome/free-solid-svg-icons';

/*
const notify = () => toast('save to redis ... done !', {
    duration: 2000,
    position: 'bottom-center',
    style: {
        background: '#8bc34a',
        color: 'white'

    },
    icon: '👏',
});
*/


const classNames = require('classnames');

const NewItemPage = (props: any) => {

    const { classes } = props;

    const dispatch = useDispatch();

    const [key, setKey] = useState('');

    const [field, setField] = useState('');

    const [itemType, setItemType] = useState('String');

    const [listDir, setListDir] = useState('Right');

    const [status, setStatus] = useState('');

    const newValue = useSelector((state: any) => state.newValue);

    const onValueChange = (event: any) => {
        setItemType(event.target.value);
    }

    const onKeyChange = (event: any) => {
        setKey(event.target.value);
    }

    const onFieldChange = (event: any) => {
        setField(event.target.value);
    }

    const onListDirChange = (event: any) => {
        setListDir(event.target.value);
    }


    const saveNewValue = async () => {

        //    setStatus('saving session...');

        switch (itemType) {
            case "String":
                await runCommand('api/cache/set', {
                    key: key,
                    value: newValue
                });
                break;
            case "Hashe":
                await runCommand('api/cache/hset', {
                    key: key,
                    field: field,
                    value: newValue
                });
                break;
            case "List":
                if (listDir === 'Right') {
                    await runCommand('api/cache/lrpush', {
                        key: key,
                        value: newValue
                    });
                } else if (listDir === 'Left') {
                    await runCommand('api/cache/llpush', {
                        key: key,
                        value: newValue
                    });
                };
                break;
        }

        dispatch({
            type: ActionType.SHOW_MESSAGE, payload: {
                time: new Date().toString(),
                payload: `save to redis ... done !`
            }
        })


        //   setStatus('completed');

    }


    useEffect(() => {

        // getIdList();

    }, []);


    return (

        <div className="flex-shrink-0 w-full">

            <div className="bg-blue-100 flex  ">
                <nav className="relative w-full flex flex-wrap items-center justify-between py-2 border-b 0  shadow-lg">
                    <div className="container-fluid px-2">
                        <div className="flex  items-center text-gray-900 hover:text-gray-900 focus:text-gray-900 mt-2 lg:mt-0 mr-1">
                            <span className="font-bold text-lg text-blue-600">{itemType}</span>
                            <span className="font-bold text-lg text-gray-600 ml-2">Key:</span>
                            <span className="font-medium text-sm text-gray-600 ml-1">{key}</span>

                            {itemType === 'Hashe' ? (
                                <div>
                                    <span className="font-bold text-lg text-gray-600 ml-2">Field:</span>
                                    <span className="font-medium text-sm text-gray-600 ml-1">{field}</span>
                                </div>
                            ) : (
                                <div />
                            )}

                            <span className="w-20 right-20 font-bold text-sm text-green-600">{status}</span>

                            <button className="bg-blue-400 active:bg-blue-500 rounded shadow hover:shadow-md outline-none focus:outline-none text-white ease-linear transition-all absolute w-9 mr-2 right-10" type="button"
                                onClick={saveNewValue} data-bs-toggle="tooltip" data-bs-placement="top" title="Save value" >
                                <FontAwesomeIcon icon={faFloppyDisk} />

                            </button>

                        </div>
                    </div>

                </nav>
            </div>

            <div className="flex w-full justify-center bg-gray-100 rounded overflow-hidden text-sm shadow-lg py-2 my-2">

                <div className="flex flex-col">
                    <div className="form-check">
                        <label className="form-check-label inline-block text-gray-800">
                            <input
                                type="radio"
                                value="String"
                                checked={itemType === 'String'}
                                onChange={onValueChange}
                            />
                            String
                        </label>
                    </div>
                    <div className="form-check">
                        <label className="form-check-label inline-block text-gray-800">
                            <input
                                type="radio"
                                value="Hashe"
                                checked={itemType === 'Hashe'}
                                onChange={onValueChange}
                            />
                            Hashe
                        </label>
                    </div>
                    <div className="form-check">
                        <label className="form-check-label inline-block text-gray-800">
                            <input
                                type="radio"
                                value="List"
                                checked={itemType === 'List'}
                                onChange={onValueChange}
                            />
                            List
                        </label>
                    </div>
                </div>

            </div>

            <div className="flex flex-col w-full border-b 0 text-sm shadow-lg py-2 my-2">

                <label className="form-label inline-block text-gray-700 font-bold"
                >Key</label>
                <input
                    type="text"
                    className="
        form-control
        block
        w-full
        px-3
        py-1.5
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        mb-3
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                    id="exampleFormControlInput1"
                    placeholder="Key"
                    value={key}
                    onChange={onKeyChange}
                />
                {itemType === 'Hashe' ? (
                    <div>
                        <label className="form-label inline-block text-gray-700 font-bold"
                        >Field</label>
                        <input
                            type="text"
                            className="
form-control
block
w-full
px-3
py-1.5
font-normal
text-gray-700
bg-white bg-clip-padding
border border-solid border-gray-300
rounded
transition
ease-in-out
mb-3
focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
"
                            id="exampleFormControlInput1"
                            placeholder="Field"
                            value={field}
                            onChange={onFieldChange}
                        />
                    </div>
                ) : (
                    <div />
                )
                }

                {itemType === 'List' ? (
                    <div>
                        <label className="form-label inline-block text-gray-700 font-bold"
                        >Push Direction</label>
                        <div className="flex w-full justify-center bg-gray-100 rounded overflow-hidden text-sm shadow-lg py-2 my-2">
                            <div className="flex flex-col">
                                <div className="form-check">
                                    <label className="form-check-label inline-block text-gray-800">
                                        <input
                                            type="radio"
                                            value="Left"
                                            checked={listDir === 'Left'}
                                            onChange={onListDirChange}
                                        />
                                        Left
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label inline-block text-gray-800">
                                        <input
                                            type="radio"
                                            value="Right"
                                            checked={listDir === 'Right'}
                                            onChange={onListDirChange}
                                        />
                                        Right
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div />
                )
                }


                <label className="form-label inline-block text-gray-700 font-bold"
                >Value</label>

                <div className="col-span-12 bg-white flex ">
                    <ContextDetails value={newValue} />
                </div>

            </div>
        </div>

    );
};

export default NewItemPage as any;

