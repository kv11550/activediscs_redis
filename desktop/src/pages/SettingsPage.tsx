import React, { useState, useReducer, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { runCommand, setToken } from '../services/restfulClient';
// import { store } from '../store/Store';
import { ActionType } from '../store/Helpers';
import { Redirect, useLocation, Route } from "react-router-dom";
import * as querystring from 'querystring';
import { convertCompilerOptionsFromJson } from 'typescript';

const SettingsPage = (props: any) => {

    const { classes } = props;

    const dispatch = useDispatch();

    const location = useLocation();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    // const [testing, setTesting] = useState(false);

    // const [testingResult, setTestingResult] = useState(false);

    const [testState, setTestState] = useReducer((testState: any, newTestState: any) => ({ ...testState, ...newTestState }), { testing: false, testingResult: false })

    const [serverList, setServerList] = useState([
        {
            name: 'localhost',
            address: '127.0.0.1',
            port: 6379,
            password: ''
        }
    ]);

    const [no, setNo] = useState(0);

    const stateResult = useSelector((state: any) => state.user);

    setToken(stateResult.access_token);

    const newServer = () => {

        const coloneServerList = [...serverList];
        coloneServerList.push({
            name: 'localhost',
            address: '127.0.0.1',
            port: 6379,
            password: ''
        })

        setServerList(coloneServerList);
    }

    const deleteServer = () => {

        const coloneServerList = [...serverList];
        coloneServerList.splice(no, 1);

        if (no > 0) {
            setNo(no - 1);
            setServerList(coloneServerList);
        }

    }

    const selectServer = (no: number) => {
        setNo(no);
        setTestState({ testing: false, testingResult: false });

    }

    const handleName = (event: any) => {
        serverList[no].name = event.target.value;
        const coloneServerList = [...serverList];
        setServerList(coloneServerList);
    }

    const handleAddress = (event: any) => {
        serverList[no].address = event.target.value;
        const coloneServerList = [...serverList];
        setServerList(coloneServerList);
    }

    const handlePort = (event: any) => {
        serverList[no].port = Number(event.target.value);
        const coloneServerList = [...serverList];
        setServerList(coloneServerList);
    }

    const handlePassword = (event: any) => {
        serverList[no].password = event.target.value;
        const coloneServerList = [...serverList];
        setServerList(coloneServerList);
    }

    const handleTest = async () => {

        console.log(serverList[no]);

        //  setTesting(true);
        //  setTestingResult(false);

        setTestState({ testing: true, testingResult: false });

        try {
            const result: any = await runCommand('api/cache/testClient', serverList[no]);
            console.log(result);
            if (result === true)
                setTestState({ testingResult: true });
        } catch (err) {
            console.log(err);
        }
        setTestState({ testing: false });

    }


    const handleSave = async () => {

        try {
            const hostList = {
                hostList: serverList,
                active: no
            }

            await runCommand('api/cache/saveHostList', hostList);

            var serverName = serverList[no].name;

            dispatch({
                type: ActionType.SERVER_NAME, payload: serverName
            })


        } catch (err) {
            console.log(err);
        }

    }

    const initState = async () => {

        const hostList: any = await runCommand('api/cache/readHostList', {});

        if (hostList && hostList.hostList) {
            setServerList(hostList.hostList);
            setNo(hostList.active);
        }

    }

    useEffect(() => {

        initState();

    }, []);


    return (
        <div className="bg-white font-family-karla h-screen">

            <div className="w-full flex flex-wrap h-screen">

                <div className="w-full md:w-1/2 flex flex-col shadow-inner">

                    <div className="py-2 px-6 border-b shadow-lg border-gray-300 bg-gray-300">
                        <span className="font-bold text-lg text-blue-500 ">Server List</span>
                    </div>


                    <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                        <button className="bg-green-500 text-white font-bold text-lg p-3 ml-2 w-10" data-bs-toggle="tooltip" data-bs-placement="top" title="Add new server" onClick={newServer}>+</button>
                        <button className="bg-red-500 text-white font-bold text-lg p-3 ml-2 w-10" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove current server" onClick={deleteServer}>-</button>
                        <button className="bg-blue-500 text-white font-bold text-lg p-3 ml-2 w-10" data-bs-toggle="tooltip" data-bs-placement="top" title="Save server list" onClick={handleSave}>S</button>
                    </div>

                    <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">

                        <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
                            {

                                serverList.map((item, index) => (
                                    <li className={`px-6 py-2 border-b border-gray-200 w-full ${index === no ? 'bg-blue-100' : ''}`} onClick={() => selectServer(index)}>
                                        <div className="relative h-6 w-42">
                                            <div className="absolute left-0 top-0">{item.name}</div>
                                            {
                                                index === no ? (
                                                    <div className="absolute right-0 mt-2">
                                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download"
                                                            className="w-3 mx-auto" role="img" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 512 512">
                                                            <path fill="currentColor"
                                                                d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z">
                                                            </path>
                                                        </svg>
                                                    </div>
                                                ) : (<div />)
                                            }
                                        </div>
                                    </li>
                                ))

                            }
                        </ul>


                    </div>

                </div>

                <div className="w-full md:w-1/2 flex flex-col bg-white  shadow-inner">

                    <div className="px-6 border-b shadow-lg py-2 border-gray-300">
                        <span className="font-bold text-lg text-blue-400">Server Details</span>
                    </div>

                    <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                    </div>

                    <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">


                        <div className="grid grid-cols-12 gap-1 flex-shrink-0 pt-4">
                            <div className="col-span-4 pt-3">
                                <label htmlFor="name" className="text-sm">Server Name</label>
                            </div>
                            <div className="col-span-8">
                                <input type="text" id="name" placeholder="Server Name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                                    value={serverList[no].name} onChange={handleName} />
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-1 flex-shrink-0 pt-4">
                            <div className="col-span-4 pt-3">
                                <label htmlFor="address" className="text-sm">Address</label>
                            </div>
                            <div className="col-span-8">
                                <input type="text" id="address" placeholder="Address" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                                    value={serverList[no].address} onChange={handleAddress} />
                            </div>
                        </div>


                        <div className="grid grid-cols-12 gap-1 flex-shrink-0 pt-4">
                            <div className="col-span-4 pt-3">
                                <label htmlFor="port" className="text-sm">Port</label>
                            </div>
                            <div className="col-span-8">
                                <input type="text" id="port" placeholder="Address" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                                    value={serverList[no].port} onChange={handlePort} />
                            </div>
                        </div>



                        <div className="grid grid-cols-12 gap-1 flex-shrink-0 pt-4">
                            <div className="col-span-4 pt-3">
                                <label htmlFor="password" className="text-sm">Password</label>
                            </div>
                            <div className="col-span-8">
                                <input type="text" id="password" placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                                    value={serverList[no].password} onChange={handlePassword} />
                            </div>
                        </div>

                        <button type="button" className="bg-blue-500 text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8" onClick={handleTest}>
                            {testState.testing ? (
                                <div className="flex justify-center">
                                    <div className="pt-2 mr-6">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download"
                                            className="animate-spin w-3 mx-auto" role="img" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512">
                                            <path fill="currentColor"
                                                d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <span>Testing</span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {testState.testingResult ? (
                                        <span className="text-green-400">Success</span>
                                    ) :
                                        (
                                            <span>Test</span>
                                        )}

                                </div>)
                            }
                        </button>


                    </div>
                </div>
            </div>

        </div >
    );


}


export default SettingsPage as any;

