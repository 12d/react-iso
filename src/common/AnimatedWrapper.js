import React, { Component } from "react";
import * as Animated from "react-dom-animated";
import Easing from 'animated/lib/Easing';
const AnimatedWrapper = WrappedComponent => class AnimatedWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animate: new Animated.Value(1)
        };
    }
    isBack(){
        return this.props.history.action=='POP';

    }
    componentWillAppear(cb) {
        console.log('componentWillAppear','AnimatedWrapper');
        this.setState({
            animate: new Animated.Value(0)
        })
        // Animated.spring(this.state.animate, { toValue: 0 }).start();
        cb();
    }
    componentWillEnter(cb) {
        console.log('componentWillEnter',this.props,0);
        // setTimeout(
        //     () => Animated.spring(this.state.animate, { toValue: 0 }).start(),
        //     1000
        // );
        Animated.timing(this.state.animate, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease
        }).start()
        cb();
    }
    componentWillLeave(cb) {
        console.log('componentWillLeave',this.props,-1);
        Animated.timing(this.state.animate, {
            toValue: -1,
            duration: 400,
            easing: Easing.ease
        }).start();
        setTimeout(() => cb(), 400);
        // cb()
    }
    render() {
        const style = {
           opacity: Animated.template`${this.state.animate.interpolate({
               inputRange: [0, 1],
               outputRange:[1,0]
           })}`,

            transform: Animated.template`
    translate3d(${this.state.animate.interpolate({
                inputRange: [-1, 1],
                outputRange: this.isBack() ?["100%", "-100%"]  : ["-100%", "100%"]
            })},0,0)
   `
        };
        return (
            <Animated.div style={style} className="animated-page-wrapper">
                <WrappedComponent {...this.props} />
            </Animated.div>
        );
    }
};
export default AnimatedWrapper;