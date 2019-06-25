import React, {useReducer, useContext} from 'react';

const SAGAS = {}

const getContext = (sagaName) => {
    if (SAGAS[sagaName]){
        return SAGAS[sagaName];
    }    
    SAGAS[sagaName] =React.createContext();
    return SAGAS[sagaName]
}
const createSagaProvider = ({sagaName, reducer, initialValues }) => {
    const SagaContext = getContext(sagaName);    
    return ({children}) =>(
        <SagaContext.Provider value={useReducer(reducer, initialValues)}>
            {children}
        </SagaContext.Provider>
    );
}

const useSagaState =function(sagaName) {    
    const SagaContext = getContext(sagaName);    
    const useState = () => useContext(SagaContext);    
    const [state, dispatch ] = useState()
    const dispatchWithDispatch = (args)=> dispatch({...args, dispatch: dispatchWithDispatch})
    return [state, dispatchWithDispatch]
}

const getConsumer = (sagaName) => {
    const SagaContext = getContext(sagaName);    
    return (props)=> {
        return (
            <SagaContext.Consumer {...props}>
                 {([state, dispatch]) => {
                    const dispatchWithDispatch = (args)=> dispatch({...args, dispatch: dispatchWithDispatch})
                    return props.children([state, dispatchWithDispatch])
                }}
            </SagaContext.Consumer>
        )
    };    
}

const createSagaReducer = (sagas)=>{
    return (state, action) => {
        if (action.type === 'merge'){
            return state.merge(action.payload)
        }else if (action.type === 'set'){
            return state.set(action.key, action.payload)
        }else {
            sagas[action.type](state, action.payload, action.dispatch).then((stateResponse)=> {
                if(stateResponse){
                    action.dispatch({type: 'merge', payload: stateResponse});
                }
            })
        }
        return state;
    }
}

export {createSagaProvider, useSagaState, getConsumer, createSagaReducer};