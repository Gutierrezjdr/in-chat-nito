import React from 'react';
import ReactDOM from 'react-dom';

import styles from '../App.css';
import { Socket } from 'dgram';

const Message = props => (
    <div className={"Message" + (props.from === props.name ? ' ' + "MessageRight" : '')}>
        {/* group messages from which user they are */}
        <strong>{(props.last === props.from) ? '' :(props.from === props.name ? 'You' : props.from)}</strong>
        <span className = {"Cloud" + (props.from === props.name ? ' ' + "CloudRight" : '')}>{props.text}</span>
        {/* <span className = {props.from === props.name ? "Cloud" : "CloudRight" }>{props.text}</span> */}
    </div>
);

class MessageList extends React.Component {
    constructor(props) {
        super(props);
    }

    //scrolls messages list always to the bottom of it
    //based on http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
    // componentDidUpdate() {
    //     const node = ReactDOM.findDOMNode(this);
    //     node.scrollTop = node.scrollHeight;
    // }

    //scroll only if user was already at the bottom of messages list
    loadMessages(){
        Socket.emit('load messages', )
    }
    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }

    componentDidUpdate() {
        if(this.shouldScrollBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }

    render() {
        return (
            <div className="MessageList">
                {
                    this.props.messages.map( (messages, i) => {
                        return (
                            <Message 
                                key = {i}
                                from = {messages.from}        
                                text = {messages.text}
                                name = {this.props.name}
                                last = {(i > 0) ? this.props.messages[i-1].from : ''}
                            />    
                        );
                    })
                }
            </div>
        );
    }
}

export default MessageList;