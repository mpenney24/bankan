import { BoardServiceFacade } from '@bankan/domain';
import { createContext, useContext } from 'react';

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
