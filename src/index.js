import React from "react";
import ReactDOM from 'react-dom';
import './index.css';

function Element(props) {
    return (
        <button className={props.classNames} onClick={props.onClick}>{props.value}</button>
    );
}

function Screen(props) {
    return (
        <div className="relative text-black bg-gray-100 h-20">
            <p className="absolute top-1 right-2 text-black text-opacity-50 text-base">{props.history}</p>
            <p className="absolute bottom-1 right-2 text-3xl">{props.value}</p>
        </div>
    );
}

class Calculator extends React.Component {
    constructor(props){ 
        super(props);
        this.state = {
            buttons: ["C", "<-", "mod", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="],
            screen_value: "0",
            screen_history: "",
            equals_pressed: false,

        };
    }
    
    handleClick(i){
        const button = i.target.outerText;
        var screen_value = this.state.screen_value;
        if(screen_value==="0"){
            screen_value="";
        }
        screen_value = screen_value+button;
        this.setState({
            screen_value: screen_value
        });
    }

    render() {
        const elements = [];
        this.state.buttons.forEach(element => {
            elements.push(<Element value={element} onClick={element => this.handleClick(element)} classNames="text-xl bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-1.5"/>)
        });
        elements[elements.length-1] = <Element onClick={element => this.handleClick(element)} classNames="text-xl bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-1.5" value={"="} />

        return (
            <div className="relative w-max">
                <Screen history={this.state.screen_history} value={this.state.screen_value}/>
                <div className="relative grid grid-cols-4 gap-1 w-64 h-80 pt-2.5">
                    {elements}
                </div>
            </div>
        );
    }
}
ReactDOM.render(
    <div className="absolute">
        <Calculator />
    </div>
,document.getElementById("root"));