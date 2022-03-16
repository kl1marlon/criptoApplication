import React, {useEffect, useState} from 'react';

import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants'

export const TransactionContext = React.createContext();


const {ethereum} = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    //aqui se almacena la informacion completa de nuestro contrato desplegado
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract;
}


export const  TransactionProvider = ({children})=>{
    

    //donde manejaremos el estado de las cuentas conectadas
    const [currentAccount, setCurrentAccount] = useState('')

    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'', message:'' })

    const [isLoading, setisLoading] = useState(false)

    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    
    const [transactions, setTransactions] = useState([])

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };

      const getAllTransactions = async() =>{
          try {
            if(!ethereum) return alert('Please install metamask');

            const transactionContract = getEthereumContract()
            const availableTransaction = await transactionContract.getTransactions();
            
            
            //estructuramos aqui las transacciones que se han hecho 
            const structuredTransactions = availableTransaction.map((transactions)=>({
                addressTo: transactions.receiver,
                addressFrom: transactions.sender,
                timestamp: new Date(transactions.timestamp.toNumber() * 1000).toLocaleString(),
                message: transactions.message,
                keyword: transactions.keyword,
                amount: parseInt(transactions.amount._hex) / (10**18)
            }))

            setTransactions(structuredTransactions)
            console.log(structuredTransactions)
            

          } catch (error) {
              console.log(error)
          }
      }

    const checkIfWalletIsConnected = async () =>{

          try {
            
                    if(!ethereum) return alert('Please install metamask');
                    const accounts = await ethereum.request({method:'eth_accounts'});
            
                    if(accounts.length){
                        setCurrentAccount(accounts[0])
                        getAllTransactions();
                    }else{
                        console.log('no accounts found')
                    }
            
        } catch (error) {
            throw new Error('no ethereum object')
        }
        
    }

    const checkIfTransactionsExist = async()=>{
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionsCount()

            window.localStorage.setItem('transactionCount', transactionCount)
        } catch (error) {
            
            console.log(error)

            throw new error('no ethereum object.')
        }
    }

    const connectWallet = async() =>{
        try {

            if(!ethereum) return alert('please install metamask')
            //aqui estamos pidiendo que haya una cuenta de ethereum valida
            const accounts = await ethereum.request({method:'eth_requestAccounts'})

            
            setCurrentAccount(accounts[0]);
            console.log(accounts[0])
            console.log('conectado')
            
        } catch (error) {

            console.log(error)

            throw new error('no ethereum object.')
            
        }
    }

    const sendTransaction = async() =>{
        try {

            if(!ethereum) return alert('please install metamask')
            console.log('1')
            const {addressTo, amount, keyword, message} = formData;
            console.log('2')
            const transactionContract = getEthereumContract();
            console.log('3')

            const parsedAmount = ethers.utils.parseEther(amount)
            console.log('4')
            
            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 gwei
                    value: parsedAmount._hex, //para poder pasar el monto en hexadecimal tiene que ser de esta manera
                }]
            });
            console.log('5')

            
            //to store our transaction 
              const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setisLoading(true);
            console.log(`Loading -${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`)
            setisLoading(false);
            const transactionsCount = await transactionContract.getTransactionsCount();

            setTransactionCount(transactionsCount.toNumber())

            //aqui recargamos la pagina una vez esta hecha la transaccion
            window.reload()
            
        } catch (error) {

            console.log(error)

            throw new error('no ethereum object.')
            
        }
    }

    useEffect(() => {
      checkIfWalletIsConnected()
      checkIfTransactionsExist()
    }, [])
    

    return(
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading}} >
            {children}
        </TransactionContext.Provider>
    )
}