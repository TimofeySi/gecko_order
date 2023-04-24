import React, { useEffect, useState } from "react";
import classes from "./wrapper.module.css";
import GeckoList from "../page_elements/geckoList";
import { CSSTransition } from "react-transition-group";

function Wrapper() {

    const [basketState, setBasketState] = useState({});

    const [isShow, setShowMessage] = useState(false);
    const [isShowError, setShowError] = useState(false);

    const [CardNumber, setCardNumber] = useState("");
    const [Address, setAddress] = useState("");
    const [Email, setEmail] = useState("");

    const [{ emptyBasketError, notConfirmedInputs }, setErrorState] = useState({ emptyBasketError: false, notConfirmedInputs: false });

    useEffect(() => {

        if (isShow || isShowError)
            setTimeout(() => {
                setShowMessage(false);
                setShowError(false);
            }, 5000);


        if (Address && Address !== -1)
            document.querySelector("." + classes.addressInput).style.border = "2px solid green";
        else if (Address === -1)
            document.querySelector("." + classes.addressInput).style.border = "2px solid red";
        else
            document.querySelector("." + classes.addressInput).style.removeProperty("border");

        if (CardNumber && CardNumber !== -1)
            document.querySelector("." + classes.cardNumberInput).style.border = "2px solid green";
        else if (CardNumber === -1)
            document.querySelector("." + classes.cardNumberInput).style.border = "2px solid red";
        else
            document.querySelector("." + classes.cardNumberInput).style.removeProperty("border");

        if (Email && Email !== -1)
            document.querySelector("." + classes.emailInput).style.border = "2px solid green";
        else if (Email === -1)
            document.querySelector("." + classes.emailInput).style.border = "2px solid red";
        else
            document.querySelector("." + classes.emailInput).style.removeProperty("border");

    }, [Address, Email, CardNumber, isShow, isShowError]);

    const updateBasket = (id, count, price, name) => {
        if (count) {
            setBasketState(prevState => ({ ...prevState, [id]: { count: count, price: price, name: name } }));
        }
        else {
            setBasketState(prevState => {
                const newData = { ...prevState }
                delete newData[id]
                return newData;
            });
        }
    }

    const createBusketList = () => {
        if (Object.keys(basketState).length !== 0) {

            let items_array = [];
            for (let key in basketState)
                items_array.push(basketState[key]);
            console.log(items_array);

            let total_price = 0;

            for (let key in basketState)
                total_price += basketState[key].count * basketState[key].price;

            return (
                <div>
                    <table className={classes.geckoTable}>
                        <thead>
                            <tr>
                                <th>Имя</th><th>Кол-во</th><th>Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_array.map((elem, index) =>
                                // console.log(elem);
                                // if (!elem.buyCount) {
                                <tr className={classes.basketItem}>
                                    <td>{elem.name}</td>
                                    <td>{elem.count.toString()}</td>
                                    <td>{(elem.price * elem.count).toString()}</td>
                                </tr>
                                // }
                            )}
                        </tbody>
                    </table>
                    <div className={classes.totalPrice}>
                        <span>Общая сумма заказа: </span>
                        <span className={classes.totalAmount}>{total_price.toString()}</span>
                    </div>
                </div>


            )

        }
        else {
            // console.log(basketState);
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <span >Корзина пуста</span>
                </div>
            )
        }
    };

    const clearList = () => {
        setBasketState({});
    };

    const showMessage = () => {
        setShowMessage(!isShow);
        setBasketState({});
    }

    const showError = () => {
        setShowError(!isShowError);
        setBasketState({});
    }

    const createOrder = () => {

        if (Object.keys(basketState).length === 0) {
            setErrorState({ emptyBasketError: "Корзина пуста!", notConfirmedInputs });
            return;
        }
        else setErrorState({ emptyBasketError: "", notConfirmedInputs: "" });


        const is_not_valid = (variable) => (Boolean(variable === -1 || variable === ""))

        if (is_not_valid(CardNumber) || is_not_valid(Address) || is_not_valid(Email)) {
            setErrorState({ emptyBasketError: false, notConfirmedInputs: "Заполните все поля!" });
            return;
        }
        else setErrorState({ emptyBasketError: false, notConfirmedInputs: false });

        let sendingData = JSON.parse(JSON.stringify(basketState));

        for (let key in sendingData) {
            sendingData[key].buyCount = sendingData[key].count;
            delete sendingData[key].count;
            delete sendingData[key].price;
            delete sendingData[key].name;
        }

        fetch("http://217.71.129.139:5308", {
            method: 'POST',
            mode: "cors",
            body: JSON.stringify(sendingData)
        })
            .then(result => showMessage())
            .catch(error => showError());
    };

    function allowCardNumber() {
        let input = document.querySelector("." + classes.cardNumberInput);
        let value = input.value.trim();
        // checking
        if ((value.length !== 16) || !(/^[0-9]+$/.test(value))) {
            setCardNumber(-1);
            return;
        }

        input.style.pointerEvents = "none";
        input.style.color = "#666";
        setCardNumber(value);
    };

    function allowAddress() {
        let input = document.querySelector("." + classes.addressInput);
        let value = input.value.trim();
        // checking
        const reg = /^[а-я\s.]+?\d+/i;
        if (!reg.test(value)) {
            setAddress(-1);
            return;
        }

        input.style.pointerEvents = "none";
        input.style.color = "#666";
        setAddress(value);
    };

    function allowEmail() {
        let input = document.querySelector("." + classes.emailInput);
        let value = input.value.trim();

        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (!EMAIL_REGEXP.test(value)) {
            setEmail(-1);
            return;
        }

        input.style.pointerEvents = "none";
        input.style.color = "#666";
        setEmail(value);
    }

    function resetCardNumber() {
        let input = document.querySelector("." + classes.cardNumberInput);
        input.value = "";
        input.style.pointerEvents = "auto";
        input.style.color = "#000"

        setCardNumber("");
    }

    function resetAddress() {
        let input = document.querySelector("." + classes.addressInput);
        input.value = "";
        input.style.pointerEvents = "auto";
        input.style.color = "#000"

        setAddress("");
    }

    function resetEmail() {
        let input = document.querySelector("." + classes.emailInput);
        input.value = "";
        input.style.pointerEvents = "auto";
        input.style.color = "#000"

        setEmail("");
    }

    function cardNumberKeys(e) {
        if (e.key === "Enter") allowCardNumber();
        if (e.key === "ArrowDown") document.querySelector("." + classes.addressInput).focus();
    }

    function addressKeys(e) {
        if (e.key === "Enter") allowAddress();
        if (e.key === "ArrowDown") document.querySelector("." + classes.emailInput).focus();
        if (e.key === "ArrowUp") document.querySelector("." + classes.cardNumberInput).focus();
    }


    function emailKeys(e) {
        if (e.key === "Enter") allowEmail();
        if (e.key === "ArrowUp") document.querySelector("." + classes.addressInput).focus();
    }

    return (
        <div className={classes.Wrapper}>
            <header className={classes.header + " " + classes.panel}>
                <Container>
                    <div className={classes.logoBlock}>
                        <img src={require("../images/gecko_house_logo.png")} height="80px" alt="no" />
                    </div>
                    <div className={classes.buttonsBlock}>
                        <ul>
                            <li className={classes.delivery + " " + classes.navigationButtons}>
                                <img src={require("../images/delivery_icon.png")} height="35px" alt="no" />
                                <span>Доставка</span>
                                <div className={classes.deliveryDropDown}>
                                    <span>&emsp;Даставку осуществляют только высококлассные профессионалы своего дела. Ими были доставлены сотни животных
                                        со всех точек мира: Африка, Бразилия, Австралия и с доставкой Вашего чешуйчатого малыша в Новосибирске они справятся,
                                        уж поверьте.<br /></span>
                                    <span>&emsp;Доставим в день заказа, при условии, что он был совершён не позднее 19:00!</span>
                                </div>
                            </li>
                            <li className={classes.basket + " " + classes.navigationButtons}>
                                <img src={require("../images/basket_icon.png")} height="35px" alt="no" />
                                <span>Корзина</span>
                                <div className={classes.basketDropDown}>
                                    <span className={classes.basketTitle}>Корзина</span>
                                    {Boolean(emptyBasketError) && <ErrorMessage>{emptyBasketError}</ErrorMessage>}
                                    {Boolean(notConfirmedInputs) && <ErrorMessage>{notConfirmedInputs}</ErrorMessage>}
                                    <div className={classes.basketItems}>
                                        {createBusketList()}
                                    </div>
                                    <div className={classes.userData}>
                                        <div className={classes.cardNumberBlock + " " + classes.inputBlock}>
                                            <input className={classes.cardNumberInput + " " + classes.basketInput} type="text" placeholder="Введите номер карты" onKeyDown={(e) => cardNumberKeys(e)} />
                                            <button className={classes.cardNumberButton + " " + classes.inputButton + " " + classes.basketButton} onClick={allowCardNumber}>
                                                <span>Подтвердить</span>
                                            </button>
                                            <button className={classes.resetButton + " " + classes.basketButton} onClick={resetCardNumber}>
                                                <img src={require("../images/undo.png")} />
                                            </button>
                                        </div>
                                        <div className={classes.addressBlock + " " + classes.inputBlock}>
                                            <input className={classes.addressInput + " " + classes.basketInput} type="text" placeholder="Введите адрес доставки" onKeyDown={(e) => addressKeys(e)} />
                                            <button className={classes.addressButton + " " + classes.inputButton + " " + classes.basketButton} onClick={allowAddress}>
                                                <span>Подтвердить</span>
                                            </button>
                                            <button className={classes.resetButton + " " + classes.basketButton} onClick={resetAddress}>
                                                <img src={require("../images/undo.png")} />
                                            </button>
                                        </div>
                                        <div className={classes.emailBlock + " " + classes.inputBlock}>
                                            <input className={classes.emailInput + " " + classes.basketInput} type="email" placeholder="Введите Ваш e-mail" onKeyDown={(e) => emailKeys(e)} />
                                            <button className={classes.emailButton + " " + classes.inputButton + " " + classes.basketButton} onClick={allowEmail}>
                                                <span>Подтвердить</span>
                                            </button>
                                            <button className={classes.resetButton + " " + classes.basketButton} onClick={resetEmail}>
                                                <img src={require("../images/undo.png")} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={classes.basketButtons}>
                                        <button onClick={clearList} className={classes.basketButton}><span>Очистить корзину</span></button>
                                        <button onClick={createOrder} className={classes.basketButton}><span>Совершить заказ</span></button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </Container>
            </header>
            <main className={classes.main}>
                <Container>
                    <GeckoList basketCallback={updateBasket} basket_state={basketState}></GeckoList>
                </Container>
                <CSSTransition in={isShow} timeout={500} classNames={{
                    enterActive: classes.successMessageEnterActive,
                    enterDone: classes.successMessageEnterDone,
                    exitActive: classes.successMessageExitActive,
                    exitDone: classes.successMessageExitDone
                }} unmountOnExit>
                    <div className={classes.successMessage}>
                        <span>
                            Покупка совершена успешно!
                        </span>
                        <span>
                            Ваш новый питомец прибудет в ближайшее время!
                        </span>
                        <span>
                            Ожидайте информации по указанному адресу электронной почты
                        </span>
                    </div>
                </CSSTransition>
                <CSSTransition in={isShowError} timeout={500} classNames={{
                    enterActive: classes.successMessageEnterActive,
                    enterDone: classes.successMessageEnterDone,
                    exitActive: classes.successMessageExitActive,
                    exitDone: classes.successMessageExitDone
                }} unmountOnExit>
                    <div className={classes.failureMessage}>
                        <span>
                            Произошла ошибка при совершении заказа!
                        </span>
                        <span>
                            Попробуйте повторить позже!
                        </span>
                    </div>
                </CSSTransition>
            </main>
            <footer className={classes.footer + " " + classes.panel}>
                <Container>
                    <div className={classes.footerFirstRow}>
                        <h5><b>О нас</b></h5>
                        <p>&emsp;Наша компания занимается продажей гекконов по всей России, но в связи с сокращением популяции гекконов в дикой природе,
                            нами было принято решение об ограничении отлова этих милых созданий и закрытии всех наших фелиалов, за исключением Новосибирского.</p>
                    </div>
                    <div className={classes.footerFirstRow}>
                        <h5><b>Контакты</b></h5>
                        <ul>
                            <li><b>email:</b> sinyushkin.2021@stud.nstu.ru</li>
                            <li><b>Основной номер телефона:</b> +7 800 555-35-35</li>
                            <li><b>Дополнительный номер телефона:</b> +7 952 939-22-17</li>
                            <li><b>Офис компании располагается по адресу:</b> г. Новосибирск, ул. Блюхера 32/1</li>
                        </ul>
                    </div>
                    <div className={classes.location}>
                        <h5><b>Наше расположение</b></h5>
                        <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A79eb594d7e3b5ae88fbb6fefa27e9f6cb71034abea9b35ab6703d2b45e40c5ce&amp;source=constructor" width="1100" height="300" frameBorder="0"></iframe>
                    </div>
                </Container>
            </footer>
        </div>
    );
}

export default Wrapper;


function Container({ children, ...props }) {
    return (
        <div className={classes.container}>
            {children}
        </div>
    );
}

function ErrorMessage({ children }) {
    return (
        <div className={classes.errorMessage}>
            <span>
                {children}
            </span>
        </div>
    );
}