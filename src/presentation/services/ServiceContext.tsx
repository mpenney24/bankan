import { createContext, useContext } from 'react';

import { BoardServiceFacade } from '../../domain/application/facades/BoardServiceFacade.js';

interface ServiceContainer {
    boardServiceFacade: BoardServiceFacade;
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export const ServiceProvider = ServiceContext.Provider;

export const useServices = (): ServiceContainer => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
};
