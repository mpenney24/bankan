import 'reflect-metadata';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { boardServiceFacade } from './infrastructure/serviceContainer.js';
import { ServiceProvider } from './presentation/services/ServiceContext.js';
import { BoardView } from './presentation/views/BoardView.js';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ServiceProvider
                value={{
                    boardServiceFacade,
                }}
            >
                <BoardView />
                <Toaster position="bottom-right" />
            </ServiceProvider>
        </React.StrictMode>
    );
}
