import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Admin from './pages/admin';
import { Cart } from './pages/cart';
import Catalog from "./pages/catalog";
import LoginPage from "./pages/login";
import Main from "./pages/main";
import Privacy from "./pages/privacy";
import Profil from "./pages/profil";
import Registr from "./pages/registr";
import Page from "./templates/page";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page />}>
                    <Route index element={<Main />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/avtoriz/login" element={<LoginPage />} />
                    <Route path="/avtoriz/registr" element={<Registr />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/cart" element={<Cart />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);

