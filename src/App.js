import React, { Component, Text } from 'react';
import Timestamp from 'react-timestamp';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lotteryFactory from './lotteryFactory';
import lotteryAt from './lottery';


//When starts to run, the render component is called, 
//this.state.owner is empty because we set it empty inside the constructor(line 14)
//then componentDidMount runs and we call the method owner of the contract 
//and set the state equals to the owner and renders it again in render()

class App extends Component {
  state = {
    //states for the lotteryFactory
    manager: '',
    currentLottery: '',
    //states for the lottery
    deadline: '',
    lotteryValue: '',
    jackPot:'',
    winningNumber:'',
    probability:'',
    lastLottery:'',
    newLottery:'',
    message:'',
    currentLottery:''
    //lotteryNumber
  };

  async componentDidMount() {
    //Lottery Factory
    let owner = await lotteryFactory.methods.owner().call(); //owner address
    let currentLotteryAddress = await lotteryFactory.methods.deployedLottery().call();
    //Current Lottery
    let currentLottery = lotteryAt(currentLotteryAddress);
    let deadline = await currentLottery.methods.deadline().call();
    let lotteryValue = web3.utils.fromWei(await currentLottery.methods.lotteryValue().call(), 'ether');
    let jackPot = web3.utils.fromWei(await currentLottery.methods.jackPot().call(), 'ether');
    let winningNumber = await currentLottery.methods.winningNumber().call();
    let probability = await currentLottery.methods.probability().call();
    let lastLottery = await currentLottery.methods.lastLottery().call();
    let newLottery = await currentLottery.methods.newLottery().call();
    let lotteryNumber;
    let lotteryValueToEnter;
    this.setState({ owner, currentLotteryAddress, currentLottery, deadline, lotteryValue, jackPot, winningNumber, probability, 
      lastLottery, newLottery, lotteryNumber, lotteryValueToEnter });
  }

  onCreate = async () => {
    
    
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await this.state.currentLottery.methods.enter(this.state.lotteryNumber).send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.lotteryValueToEnter, 'ether')
    });
    let newJackpot = await this.state.currentLottery.methods.jackPot().call();
    newJackpot = web3.utils.fromWei(newJackpot, 'ether');
    console.log(newJackpot);
    this.setState({ jackPot : newJackpot});
    this.setState({ message: 'You have been entered!'});
  }

  onChange = async (event) => {
    /*
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await currentLottery.methods.enter(this.state.value).send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({ message: 'You have been entered!'});
    */
  }

  render() {
    return (
      <div>
        <div>
          <h2>LotteryFactory Contract</h2>
          <p>
            This contract is owned by {this.state.owner}
            <p />
            The most recent deployed Lottery is at address {this.state.currentLotteryAddress}
          </p>
          <p><button onClick={this.onCreate}>Create New Lottery</button></p>
          <hr />
        </div>

        <div>
          <h2>Lottery Contract</h2>
          <p>
            Deadline is <Timestamp time={this.state.deadline} component={Text} precision={2} />  <br />
            Lottery Value is {this.state.lotteryValue} Ether <br />
            Current Jackpot is {this.state.jackPot} Ether <br />
            The probability of this Lottery is 1 in {this.state.probability} <br />
            The winningNumber of this Lottery is {this.state.winningNumber} <br />
            The previous lottery address is {this.state.lastLottery} <br />
            The subsequent lottery address is {this.state.newLottery} <br />
          </p>
          <form onSubmit={this.onSubmit}>
          <div>
            <h4>Play the Lottery</h4>
            <p>
              <label>Enter the lottery number</label>
              <input
                value={this.state.lotteryNumber}
                onChange={event => this.setState({ lotteryNumber: event.target.value})} />
            </p>
            <p>
              <label>Enter the amount of ether</label>
              <input
                value={this.state.lotteryValueToEnter}
                onChange={event => this.setState({ lotteryValueToEnter: event.target.value})} />
            </p>
            <button>Enter</button>
            <br />
            <h4>{this.state.message}</h4>
          </div>
          
        </form>
        </div>
        
      </div>
      
      
      
    );
        
        

/*

  uint256 public deadline;
    uint256 public lotteryValue;
    uint256 public jackPot;
    uint256 public winningNumber;
    // @dev probability is (99*98*97*96*95*94)/6! = 1.120'529.256
    uint256 public probability = 1120529256;
        
*/
        
      
    
  }
}

export default App;
