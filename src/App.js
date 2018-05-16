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
    //states for the lottery
    deadline: '',
    lotteryValue: '',
    jackPot:'',
    winningNumber:'',
    probability:'',
    lastLottery:'',
    deployedLotteries:'',
    message:'',
    currentLottery:'',
    lotteryHasPlayed:'',
    mockWinningNUmber:'',
    mockProbability:'',
    winners:[],
    players:[],
    playersByLotteryNumber:[],
    amountToRefunf:"", 
    lotteryNumber:'',
    refundValue:'',
    currentLotteryAddress:'',
    lotteries:[],
    newLotteryValue:'',
    newLotteryDeadline:''
    
  };

  async componentDidMount() {
    //Lottery Factory
    let owner = await lotteryFactory.methods.owner().call(); //owner address
    let lotteries = await lotteryFactory.methods.getLotteries().call();
    let currentLotteryAddress = lotteries[lotteries.length - 1];
    //Current Lottery
    let currentLottery = lotteryAt(currentLotteryAddress);
    let deadline = await currentLottery.methods.deadline().call();
    let lotteryValue = web3.utils.fromWei(await currentLottery.methods.lotteryValue().call(), 'ether');
    let jackPot = web3.utils.fromWei(await currentLottery.methods.jackPot().call(), 'ether');
    let winningNumber = await currentLottery.methods.winningNumber().call();
    let probability = await currentLottery.methods.probability().call();
    let lastLottery = await currentLottery.methods.lastLottery().call();
    let deployedLotteries = lotteries.length;
    let lotteryHasPlayed = await currentLottery.methods.lotteryHasPlayed().call();
    let players = await currentLottery.methods.getPlayers().call();
    let winners = await currentLottery.methods.getWinners().call();
    let refundValue = web3.utils.fromWei(await currentLottery.methods.getRefundValue().call(), 'ether');
    this.setState({ owner, currentLotteryAddress, currentLottery, deadline, lotteryValue, jackPot, winningNumber, probability, 
      lastLottery, deployedLotteries, lotteryHasPlayed, players, winners, refundValue, lotteries});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ message: 'Waiting on transaction success...'});
    const accounts = await web3.eth.getAccounts();    
    await this.state.currentLottery.methods.enter(this.state.lotteryNumber).send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.lotteryValueToEnter, 'ether'),
      gas: '200000'
    });
    await this.componentDidMount();
    this.setState({ message: 'You have been entered!'});
  }

  onMockWinningNumber = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await this.state.currentLottery.methods.setWinningNumber(this.state.mockWinningNUmber).send({
      from: accounts[0]
    });
    await this.componentDidMount();
    this.setState({ message: 'Winning number has been set'});
  }

  onMockProbability = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await this.state.currentLottery.methods.setProbability(this.state.mockProbability).send({
      from: accounts[0],
      gas: '200000'
    });
    await this.componentDidMount();
    this.setState({ message: 'Winning number has been set'});
  }

  onPlayLottery = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await this.state.currentLottery.methods.pickWinner().send({
      from: accounts[0]
    });
    await this.componentDidMount();
    this.setState({ message: 'Lottery has played'});
  }

  onPlayersByLotteryNumber = async () => {
    let playersByLotteryNumber = await this.state.currentLottery.methods.getPlayersByLotteryNumber(this.state.lotteryNumber).call();
    this.setState({ playersByLotteryNumber });
  }

  onWithdraw = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    await this.state.currentLottery.methods.withdraw().send({
      from: accounts[0],
      gas: '200000'
    });
    await this.componentDidMount();
    this.setState({ message: 'All amount has been refunded'});
  }

  onCreate = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction success...'});
    const valueInWei = web3.utils.toWei(this.state.newLotteryValue, 'ether');
    await this.state.currentLottery.methods.attempNewLottery(this.state.newLotteryDeadline, valueInWei).send({
      from: accounts[0],
      gas: '2500000'
    });
    await this.componentDidMount();
    this.setState({ message: 'New Lottery created'});
  }

  render() {
    return (
      <div>
        <div>
          <h4>{this.state.message}</h4>
          <h2>LotteryFactory Contract</h2>
          <p>
            This contract is owned by {this.state.owner}
            <p />
            The deployed lotteries are
            {this.state.lotteries.map((lottery) => (
            <p>{lottery}</p>))}
          </p>          
        </div>
        <hr />        
        <div>
          <h2>Lottery Contract</h2>
          <p>
            The address of this Lottery is {this.state.currentLotteryAddress} <br />
            Deadline is <Timestamp time={this.state.deadline} component={Text} precision={2} />  <br />
            Lottery Value is {this.state.lotteryValue} Ether <br />
            Current Jackpot is {this.state.jackPot} Ether <br />
            The probability of this Lottery is 1 in {this.state.probability} <br />
            The winningNumber of this Lottery is {this.state.winningNumber} <br />
            Lottery has played =  {this.state.lotteryHasPlayed.toString()} <br />
            The previous lottery address is {this.state.lastLottery} <br />
            The total of deployed lotteries are {this.state.deployedLotteries} <br />
            The total of players are {this.state.players.length} <br />
             {this.state.refundValue} ether can be refunded <br />
             <button onClick={this.onWithdraw}>Refund {this.state.refundValue} ether</button><br />
          </p>
          <form onSubmit={this.onSubmit}>
            <div>
              <h4>Play the Lottery</h4>
              <label>Has to be done before deadline</label>
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
            </div>
          </form>
        </div>
        <div>
        <hr />
        <h3>Only owner methods and mock functions</h3>
          <p>
            <label>Set Lottery probability, has to be done when no players have entered and when lotteryHasPlayed is false</label>
            <input
              value={this.state.mockProbability}
              onChange={event => this.setState({ mockProbability: event.target.value})} />
               <button onClick={this.onMockProbability}>Mock Probability</button><br />
          </p>
          <p>
            <label>Mock a winning number, has to be done after deadline</label>
            <input
              value={this.state.mockWinningNUmber}
              onChange={event => this.setState({ mockWinningNUmber: event.target.value})} />
               <button onClick={this.onMockWinningNumber}>Mock Winning Number</button><br />
          </p>
          <label>Has to be done when lotteryHasPlayed is false and after deadline</label>
          <button onClick={this.onPlayLottery}>Play the Lottery</button><br />
          <p>
            <h4>Deploy new Lottery</h4>
            <label>only when LotteryHasPLayed, </label>
            <p>
              <label>Lottery Value in ether</label>
              <input
                value={this.state.newLotteryValue}
                onChange={event => this.setState({ newLotteryValue: event.target.value})} />
            </p>
            <p>
              <label>Lottery Deadline, in seconds</label>
              <input
                value={this.state.newLotteryDeadline}
                onChange={event => this.setState({ newLotteryDeadline: event.target.value})} />
            </p>
            <p><button onClick={this.onCreate}>Create New Lottery</button></p>
            <hr />
          </p>
        </div>
        <hr />
        <div>
          <h3>Players</h3>
          {this.state.players.map((player) => (
          <p>{player}</p>))}
          <hr />          
        </div>
        <div>
          <h3>Winners</h3>
          {this.state.winners.map((winner) => (
          <p>{winner}</p>))}
          <hr />
        </div>
        <p>
          <label>Get players by lottery number</label>
          <input
            onChange={event => this.setState({ lotteryNumber: event.target.value, playersByLotteryNumber: []})} />
              <button onClick={this.onPlayersByLotteryNumber}>Get players</button><br />
              {this.state.playersByLotteryNumber.map((player) => (
              <p>{player}</p>))}
        </p>
      </div>
    )
  }
}

export default App;
