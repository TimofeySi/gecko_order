import React, { useEffect, useState } from "react";
import classes from "./geckoList.module.css";
import wrapperClasses from "../wrapper/wrapper.module.css";

function GeckoList({ basketCallback, basket_state }) {

    const url = "http://217.71.129.139:5308" //http://217.71.129.139:5308/  http://localhost:2000/

    const [data, setData] = useState();

    const [curTasks, setCurTasks] = useState(1);

    useEffect(() => {
        const fetchData = () => {
            let options = {
                method: 'GET',
                mode: 'cors',
            }
            fetch(url, options)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => console.log('Ошибка запроса', error));
        }
        function scrollEvt() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (documentHeight - (scrollTop + windowHeight) < 500) {
                console.log("конец");
                if (data && ((curTasks * 8) > data.length))
                    return;

                setCurTasks(curTasks + 1);
            }
        }

        fetchData();
        window.addEventListener("scroll", scrollEvt);

        return () => {
            window.removeEventListener("scroll", scrollEvt);
        }

    }, [basket_state, curTasks]);

    function outputGeckoList() {
        if (data) {

            let items_array = data;

            let indx = ((curTasks * 8) >= items_array.length) ? (items_array.length) : (curTasks * 8);
            items_array = items_array.slice(0, indx);
            console.log(curTasks);

            return (
                <div>
                    {items_array.map((item) => (
                        <GeckoItem id={item.id} count={item.count} desc={item.description} price={item.price} url={item.url} name={item.name} basketCallback={basketCallback} basketState={basket_state}>
                        </GeckoItem>
                    ))}
                </div>
            )
        }
        else {
            return (
                <EmptyItem>
                </EmptyItem>
            )
        }
    }

    return (
        <div className={classes.geckoList}>

            {outputGeckoList()}

        </div>
    );
}

export default GeckoList;


function GeckoItem({ id, count, desc, price, url, name, basketCallback, basketState }) {

    const [curCount, setCount] = useState(0);

    const [buyButtonClassName, setBuyButtonClassName] = useState(classes.addToBasket + " " + classes.buttonStyle);

    const [fullDescription, setFullDescrition] = useState(false);

    useEffect(() => {
        if (!basketState[id])
            setCount(0);

        if (!count)
            setBuyButtonClassName(buyButtonClassName + " " + classes.disableButton);
    }, [basketState, count, fullDescription]);

    function addToBasket() {
        if (curCount == count)
            return;
        basketCallback(id, curCount + 1, price, name);
        setCount(curCount + 1);
    }

    function removeFromBasket() {
        if (!curCount)
            return;
        basketCallback(id, curCount - 1, price, name);
        setCount(curCount - 1);
    }


    return (
        <div className={classes.geckoItem}>
            <div className={classes.imageBlock}>
                <img src={require("../gecko_url/" + url + ".png")} width="300px" />
            </div>
            <div className={classes.textBlock}>
                <span className={classes.itemName}><b>{name}</b></span>
                <span className={classes.itemPrice}>Цена: {price}₽</span>
                <span className={classes.itemCount}>{count ? `В наличии: ${count}шт.`: "Нет в наличии"}</span>
                <div className={classes.itemDescription}>
                    <span className={classes.itemDesc + " " + (fullDescription ? classes.fullDescription : "")}>&emsp;{desc}</span>
                    <button className={classes.fullDescriptionButton + " " + classes.buttonStyle} onClick={() => setFullDescrition(!fullDescription)}>
                        {fullDescription ? "Свернуть" : "Развернуть"}
                    </button>
                </div>
                <div className={classes.buttonRow}>
                    <div className={classes.buttonBlock}>
                        <button className={classes.minusButton + " " + classes.addremoveButtons + " " + classes.buttonStyle} onClick={removeFromBasket}>&#45;</button>
                        <span className={classes.countNumber}>{curCount}</span>
                        <button className={classes.plusButton + " " + classes.addremoveButtons + " " + classes.buttonStyle} onClick={addToBasket}>&#43;</button>
                        <div className={buyButtonClassName}>
                            <span>Добавить в корзину</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

function EmptyItem() {
    return (
        <div className={classes.emptyItem}>
            <span>
                нет соединения с сервером
            </span>
        </div>
    );
}
