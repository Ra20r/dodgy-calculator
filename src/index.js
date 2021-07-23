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
            <p className="absolute bottom-1 right-2 text-3xl truncate">{props.value}</p>
        </div>
    );
}

function Title(props){
    const size = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl"];
    const color = ["text-grey", "text-red", "text-yellow", "text-green", "text-blue", "text-indigo", "text-purple", "text-pink"];
    let className = size[Math.floor(Math.random()*13)] + " " + color[Math.floor(Math.random()*8)]+"-700 hover:" + color[Math.floor(Math.random()*8)]+"-600 subpixel-antialiased font-medium underline hover:line-through";
    return(
        <p className={className}>Shady Calculator</p>
    );
}
class Calculator extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            buttons: ["C", "<-", "mod", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="],
            screen_value: "0",
            screen_history: "",
            last_key: "=",
            operator: "",
            operand: "",
        };
    }
    
    handleClick(i){
        var button = i.target.outerText;
        const math_operations= ["+", "-", "*", "/", "mod"];
        const special_operations = ["+/-", "<-", "C", "=", "."];
        var screen_value = this.state.screen_value;
        if(!math_operations.includes(button) && !special_operations.includes(button)){
            if(screen_value==="0" || math_operations.includes(this.state.last_key)){
                screen_value="";
            }
            if(this.state.screen_value==="Infinity"){
                return;
            }
            screen_value = screen_value+button;
            this.setState({
                screen_value: screen_value,
                last_key: button,
            });
        } else if(math_operations.includes(button)) {
            button = math_operations[Math.floor(Math.random()*5)];
            console.log(this.state.last_key);
            console.log(button);
            if(math_operations.includes(this.state.last_key)) {
                let last_operator_length = 1;
                if(this.state.last_key==="mod"){
                    last_operator_length = 3;
                }
                this.setState({
                    operator: button,
                    screen_history: this.state.screen_history.substring(0, this.state.screen_history.length-last_operator_length)+button,
                    last_key: button,
                });
            } else if(!this.state.operator) {
                this.setState({
                    operator: button,
                    operand: this.state.screen_value,
                    screen_history: this.state.screen_value+button,
                    screen_value: "0",
                    last_key: button,
                });
            } else {
                const t = this.do_Math(this.state.operand, this.state.screen_value, this.state.operator);
                this.setState({
                    operator: button,
                    operand: t,
                    screen_value: t,
                    screen_history: this.state.screen_history+this.state.screen_value+button,
                    last_key: button,
                });
            }
        } else {
            if((button==="." || button==="<-") && (this.state.screen_value==="Infinity" || this.state.screen_value==="-Infinity")){
                return;
            }
            const t = this.do_Special_Functions(button, this.state.screen_value);
            if(t==="CLEAN"){
                this.setState({
                    buttons: ["C", "<-", "mod", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "+/-", "0", ".", "="],
                    screen_value: "0",
                    screen_history: "",
                    operator: "",
                    operand: "",
                    last_key: "=",
                });
            } else if(t==="EQUAL") {
                if(this.state.last_key==="=" || !this.state.operator){
                    return;
                }
                const t = this.do_Math(this.state.operand, this.state.screen_value, this.state.operator);
                this.setState({
                    screen_value: t,
                    screen_history: this.state.screen_history+this.state.screen_value+"=",
                    operator: "",
                    last_key: "=",
                });
            } else {
                this.setState({
                    screen_value: t,
                    last_key: button,
                });
            }
        }
    }

    do_Math(operand_a, operand_b, operator){
        switch(operator){
            case "+":
                return String(Number(operand_a)+Number(operand_b));
            case "-":
                return String(Number(operand_a)-Number(operand_b));
            case "*":
                return String(Number(operand_a)*Number(operand_b));
            case "/":
                return String(Number(operand_a)/Number(operand_b));
            case "mod":
                return String(Number(operand_a)%Number(operand_b));
            default:
                return
        }
    }

    do_Special_Functions(operator, operand){
        switch(operator){
            case "+/-":
                return String(Number(operand)*-1);
            case "<-":
                let temp= operand.substring(0, operand.length-1);
                if(temp===""){
                    return "0";
                } else {
                    return temp;
                }
            case "C":
                return "CLEAN";
            case "=":
                return "EQUAL";
            case ".":
                if(operand.indexOf(".")===-1){
                    return operand+".";
                } else {
                    return operand;
                }
            default:
                return;
        }        
    }

    render() {
        const elements = [];
        this.state.buttons.forEach(element => {
            elements.push(<Element value={element} onClick={element => this.handleClick(element)} classNames="text-xl bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-1.5"/>)
        });
        elements[elements.length-1] = <Element onClick={element => this.handleClick(element)} classNames="text-xl bg-blue-200 hover:bg-blue-300 active:bg-blue-400 px-1.5" value={"="} />

        return (
            <div className="absolute">
                <Screen history={this.state.screen_history} value={this.state.screen_value}/>
                <div className="relative grid grid-cols-4 gap-1 w-64 h-80 pt-2.5">
                    {elements}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <div>
        <Calculator />
        <div className="absolute right-2 top-1/4">
            <Title />
        </div>
    </div>
,document.getElementById("root"));