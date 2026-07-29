import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BoardView } from './presentation/views/BoardView.js';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <BoardView />
        </React.StrictMode>
    );
}