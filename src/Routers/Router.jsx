/* using react-router-dom for implementing multi-page application with a router component */
import React from 'react';
import Homepage from '../Components/HomePage/jsx/Homepage'
import Store from '../Components/VirtualStore/jsx/VirtualStore'
import QA from '../Components/FAQ/jsx/QA'
import Contact from '../Components/ContactUs/jsx/Contact'
import About from '../Components/About/jsx/About'
import Sign from '../Components/Login/sign-in-side/SignInSide'
import WithAdmin from '../HOC/WithAdmin'
import Admin from '../Components/Admin/Admin'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import NotFound from '../Components/NotFound/NotFound'
import BasicTable from '../Components/Admin/StockTable/jsx/StockTable';
import DeliveryTable from '../Components/Admin/DeliveryCheck/jsx/DeliveryFile';
import SellTable from '../Components/Admin/SellTable/jsx/SellTable';
import AdminContact from '../Components/Admin/ContactData/jsx/ContactData'
import PredictForm from '../Components/Admin/PredictPrice/PredictPrice'

const RedirectToHome = () => <Redirect to="home" />;

const SignAdmin = () => <WithAdmin><Sign /><Admin /></WithAdmin>;


function RouterComponent({ routing, relUrl }) {

    const regPaths = [
        { path: '/', exact: true, component: RedirectToHome },
        { path: '/home', component: Homepage },
        { path: '/store', component: Store },
        { path: '/about', component: About },
        { path: '/qa', component: QA },
        { path: '/contact', component: Contact },
        { path: '/admin', component: SignAdmin },
        { path: '', component: NotFound },
    ];

    const adminPaths = [
        { path: relUrl + '/reports', component: BasicTable },
        { path: relUrl + '/delivery', component: DeliveryTable },
        { path: relUrl + '/sell', component: SellTable },
        { path: relUrl + '/contact', component: AdminContact },
        { path: relUrl + '/ml-price', component: PredictForm },

    ];

    var path;
    switch (routing) {
        case 'Admin':
            path = adminPaths;
            break;
        case 'User':
            path = regPaths;
            break;
        default:
            throw Error("Unknown path for router");
    }
    const switchContainer =
        <Switch>
            {path.map((item, index) =>
                <Route
                    key={index}
                    {...item} />
            )}
        </Switch>;
    return switchContainer;
}

export default RouterComponent;