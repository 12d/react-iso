/**
 * @author xuweichen@meitu.io
 * @date 2017/8/24
 */
import React,{Component} from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
// import css from './css/base.css';
import {
    Route,
    Link
} from 'react-router-dom'
import Home from './Home';
import List from './List';
import Detail from './pages/Detail';
import AsyncComponent from './common/AsyncComponent';
import TransitionGroup from 'react-transition-group/TransitionGroup'

const FirstChild = props => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
};
export default class App extends Component {
    render(){
        return (
                <div>
                    <Route exact path="/" children={({ match, ...rest }) => {
                        return (
                            <TransitionGroup component={FirstChild} >
                              {match && <Home {...rest}/>}
                            </TransitionGroup>
                        )
                    }}/>
                    <Route exact path="/list" children={({ match, ...rest }) => {
                        return (
                            <TransitionGroup component={FirstChild}>
                              {match && <List {...rest} />}
                            </TransitionGroup>
                        )
                    }}/>
                    {
                        /*
                    <Route exact path="/detail/:id" children={({ match, ...rest }) => {
                        return (
                            <TransitionGroup component={FirstChild}>
                              {match && <Detail {...rest} match={{...match}}/>}
                            </TransitionGroup>
                        )
                    }}/>
                         */
                    }
                        <Route path="/detail/:id" children={({ match, ...rest }) => {
                            return (
                                <TransitionGroup component={FirstChild}>
                                  {match && AsyncComponent(Detail)({match,...rest})}
                                </TransitionGroup>
                            )
                        }}/>


                </div>
        )
    }
    constructor(){
        super()
    }
    componentDidMount(){

    }
}