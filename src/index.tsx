import 'reflect-metadata';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BoardView } from './presentation/views/BoardView.js';
import { Toaster } from 'react-hot-toast';
import { ServiceProvider } from './presentation/services/ServiceContext.js';
import { boardServiceFacade } from './infrastructure/serviceContainer.js';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ServiceProvider value={{ boardServiceFacade }}>
                <BoardView />
                <Toaster position="bottom-right" />
            </ServiceProvider>
        </React.StrictMode>
    );
}