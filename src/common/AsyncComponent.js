/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, { Component } from 'react'

class AsyncComponent extends Component {
    constructor(){
        super()
        this.state = {
            mod: null
        }
    }
    componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null
        })
        props.load((mod) => {
            this.setState({
                // handle both es imports and cjs
                mod: React.createElement(mod.default ? mod.default : mod, props.props)
            })
        })
    }

    render() {
        return this.state.mod
    }
}

function isServerSide(){
    return typeof window=='undefined';
}

export default function(loader){
    return isServerSide() ? loader : (props) => (
        <AsyncComponent load={loader} props={props}/>
    )
}