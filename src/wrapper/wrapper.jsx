import React from "react";
import classes from "./wrapper.module.css";
import GeckoList from "../page_elements/geckoList";

function Wrapper() {
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
                                <div className={classes.dropDown}>
                                    <span>&emsp;Адреса пунктов самовывоза:<br /></span>
                                    <ul>
                                        <li>адрес1</li>
                                        <li>адрес2</li>
                                        <li>адрес3</li>
                                        <li>адрес4</li>
                                    </ul>
                                    <span>&emsp;Даставку осуществляют только высококлассные профессионалы своего дела. Ими были доставлены сотни животных
                                        со всех точек мира: Африка, Бразилия, Австралия и с доставкой Вашего чешуйчатого малыша в Новосибирске они справятся,
                                        уж поверьте.<br /></span>
                                </div>
                            </li>
                            <li className={classes.basket + " " + classes.navigationButtons}>
                                <img src={require("../images/basket_icon.png")} height="35px" alt="no" />
                                <span>Корзина</span>
                            </li>
                        </ul>
                    </div>

                </Container>
            </header>
            <main className={classes.main}>
                <Container>
                    <GeckoList></GeckoList>
                </Container>
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