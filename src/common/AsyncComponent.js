/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, { Component } from 'react'
import AnimatedWrapper from './AnimatedWrapper';
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
                mod: React.createElement(mod.default ? mod.default : mod, props)
            })
        })
    }

    render() {
        return this.state.mod||<h2>加载中</h2>
    }
}

function isServerSide(){
    return typeof window=='undefined'
}
export default function(loader){
    return isServerSide() ? loader : (props) => (
        React.createElement(AnimatedWrapper(AsyncComponent), {
            load: loader,
            ...props
        })

    )
}
// export default function(loader){
//     return isServerSide() ? loader : (props) => (
//         <AsyncComponent load={loader} props={props}/>
//     )
// }