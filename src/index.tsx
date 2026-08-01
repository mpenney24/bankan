import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BoardView } from './presentation/views/BoardView.js';
import './index.css';
import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <BoardView />
            <Toaster position="bottom-right" />
        </React.StrictMode>
    );
}