# react-context-saga

Is a lightweight API to use easily async functions that modify the React Context State. Based in redux-saga.

# Motivation

There is a new React Context API that seems to be the evolution of redux. As a redux developer I want to try it but using my old way redux-saga functions, since I never use all the power of the generator functions, I change it to use async functions.

# Usage

1. Create reducer using the saga async functions

2. Create the provider using sagaName, the recently created reducer, and the initial values
	The state of this provider could be changed using dispatch method `{type: "saga_async_function", payload: {color: "blue"}}`

3. There are 2 reserved saga async functions, set and merge
	**set**: Change certain value i.e. {type: "set", key:"color", payload: "red"}
	**merge**: Merge Immutable map i.e. {type: "merge", payload: { color: "red"}}

# Example

As you can see in [React Context Saga + Websockets](https://github.com/DKbyo/websocket-react-context), the structure is very simple, instead of create a context folder you can declare your contexts in the App.js directly and import the saga functions and the initial values from somewhere else.

````jsx
import React from 'react';
import {createSagaProvider, createSagaReducer} from 'react-context-saga'
import {getConsumer} from 'react-context-saga'
import {useSagaState} from 'react-context-saga'
import Immutable from 'immutable';
import request from 'superagent';

const EXAMPLE_SAGA = {
    // In the saga functions you can do a lot of fun stuff
    // Call an API and save the response in the state
    getReactProyects: async (state, payload, dispatch)=>{
        return request.get("https://api.github.com/search/repositories?q=react&sort=stars&order=desc")
            .then((response)=>{
                return {
                    "reactProyects": response.body.total_count
                }
            })
    }
}
const exampleInitialValues =Immutable.fromJS({
  "reactProyects": 'n/a'
})
const exampleReducer = createSagaReducer(EXAMPLE_SAGA);
const ExampleProvider = createSagaProvider({sagaName:'example', reducer:exampleReducer, initialValues:exampleInitialValues })


function ExampleComponent() {
    // Get state and dispatch method, altought we will use only dispatch here
    const [state, dispatch] = useSagaState('example');
    return (                
        <div>
            <div>
                <button onClick={() => dispatch({type: 'getReactProyects'})}>Get React Proyects</button>
            </div>
            <div>
                React Proyects {state.get("reactProyects")}                
            </div>
        </div>
    )
}

// For non functional components
/*
const ExampleConsumer = getConsumer('example')
class ExampleComponent extends React.Component{
    render(){
        return ( 
            <ExampleConsumer>
                {([state, dispatch]) =>                
                    <div>
                        <div>
                            <button onClick={() => dispatch({type: 'getReactProyects'})}>Get React Proyects</button>
                        </div>
                        <div>
                            React Proyects {state.get("reactProyects")}                
                        </div>
                    </div>
                }
            </ExampleConsumer>
        )
    }
}
*/
function App(){  
  return (      
    <div className="App">      
      <section>     
          <ExampleProvider>
            <ExampleComponent/>
          </ExampleProvider>
      </section>
    </div>
  );
}

export default App;
/*
````