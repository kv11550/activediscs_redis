import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionType } from '../store/Helpers';

const ContextDetails = (props: any) => {

    const { classes, value } = props;

    const dispatch = useDispatch();

  //  const [newValue, setNewValue] = useState(value);

    const handleNewValue = (event: any) => {

        var newValue = event.target.value;
      //  setNewValue(newValue);

        
        dispatch({
            type: ActionType.NEW_VALUE, payload: newValue
        })
        

    }

    console.log(value);


    useEffect(() => {
        console.log('debug');
      //  setNewValue(value);
    }, [value]);


    return (

        <textarea className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-sm
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none
      "
            id="exampleFormControlTextarea1"

            onChange={handleNewValue}

            value={value}

        >

        </textarea>

    );
};


export default ContextDetails as any;
