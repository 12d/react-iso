/**
 * @author xuweichen@meitu.io
 * @date 2017/8/24
 */
global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';



test('renders correctly', ()=>{
    const component = renderer.create(
        <App/>
    )

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

})