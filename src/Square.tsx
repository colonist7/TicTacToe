import * as React from 'react';
import { DefaultTheme } from 'styled-components'
import styled from 'styled-components';

const Theme: DefaultTheme = {
    borderRadius: '10px',
    colors: {
        main: 'red',
        secondary: 'blue'
    },
}

interface SquareState {
    player: number,
    sign: string,
    active: boolean,
}

interface SquareProps {
    id: string,
    player: number,
    turn: (id:string, player:number) => void,
    gameOver: boolean
    disabled: boolean;
}

let initialState:SquareState = {
    player: 0,
    sign: "",
    active: true
};

const signColor = (props: any) => {return props.children === "x" ?  props.theme.colors.main : props.theme.colors.secondary};

const Button = styled.button`
    color: ${(props) => signColor(props)};
    border-radius: ${props => props.theme.borderRadius};
    background: #fff;
    outline: none;
    cursor: pointer;
`;

export default class Square extends React.Component<SquareProps,SquareState> {
    state: SquareState = {
        player: 0,
        sign: "",
        active: true
    }

    UNSAFE_componentWillReceiveProps(next:SquareProps) {
        if (next.disabled) {
            this.setState({active: false})
        }
        if(next.gameOver) { 
            this.setState(initialState);
        }
    }

    signs: string[] = ["","x", "o"];

    setSign = () => { 
        if(this.state.active) {
           this.props.turn(this.props.id, this.props.player);
           this.setState({active: false, sign: this.signs[this.props.player]});
        }
    }

    render() {
        return (
            <Button className="square" 
                id={this.props.id} 
                onClick={this.setSign} 
                theme={Theme}>
                {this.state.sign}
            </Button>
        );
    }
}
