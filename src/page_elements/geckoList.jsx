import React, { useEffect, useState } from "react";
import classes from "./geckoList.module.css";

function GeckoList() {

    // 

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:2000/', { //http://217.71.129.139:5308/
                method: 'GET',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                // body: JSON.stringify()
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log('Ошибка запроса', error));
        }
        fetchData();

    }, []);

    return (
        <div className={classes.geckoList}>
            {/* {data && data.map((row) => (
                <div>
                    dsfasfsadfasd
                </div>
            ))} */}
        </div>
    );
}

export default GeckoList;