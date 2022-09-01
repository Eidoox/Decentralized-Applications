import './App.css';
import { useState } from 'react';
import { ethers, providers } from 'ethers';
import { waitForElementToBeRemoved } from '@testing-library/react';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';


function App() {
  const [WalletAddress, SetWalletAddress] = useState("");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer =  provider.getSigner();
  var contractaddress;
  var contractabi;
  var connectwithcontract;
  const [s1, sets1] = useState("");
  const [tasks, settasks] = useState("");
  const [registeredstudents, setregisteredstudents] = useState("");
  const [registeredprofessors, setregisteredprofessors] = useState("");
  const [s2, sets2] = useState("");
  const [s3, sets3] = useState("");

  
  ///// Function to connect with wallet and get the connected address msg.sender
  async function connectwallet () {
    if (window.ethereum){
      try {
        await provider.send("eth_requestAccounts",[]);
        const connected_address= await signer.getAddress();
        const balance = await signer.getBalance();
        SetWalletAddress(connected_address);
        console.log(connected_address);
        document.getElementById('connectwallet').innerHTML =  "Connected";
      } catch(error){
        console.log("metmask not worked, try again please!!");
      }
    }
    else{
      alert("Metamask Not installed");
    }
    
  }

  ///// Function to connect with the smart contract after deploying it and increase the counter
  async function connectcontract () {
     contractaddress = '0x2C8522d8186B79DAcc4245f03AFBCA849D9F7fD8';
     contractabi =[
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_student",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_task_description",
            "type": "string"
          }
        ],
        "name": "AssignTaskToStudent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_professor",
            "type": "address"
          }
        ],
        "name": "FireProfessor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "GetMyTasks",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "_mytasks",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "GetRegisteredProfessors",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "GetRegisteredStudents",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "Professors_Count",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "professors_count",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "Professors_Registeration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "Students_Count",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "students_count",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "Students_Registeration",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "tasks",
        "outputs": [
          {
            "internalType": "address",
            "name": "professor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "task_description",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
        
    
    try{
       connectwithcontract = new ethers.Contract(contractaddress, contractabi, signer);
      
    }
    catch (error){
      console.log(error);
      alert("User rejected transacation");
    
    }

  } 


  async function RetrieveExactErrorFromSolidity (errorstring){
    var index;
    var stringinarray=[];
    //break the input string into array
    var words = errorstring.split(" ");
    for (let i = 0; i < words.length;i++){
      if (words[i] == "revert"){
        index=i;
      }
    }
    for (let i = index+1 ; i<words.length ; i++ ){
      stringinarray.push(words[i]);
    } 

    // convert the array to string
    var finalstring = stringinarray.toString();
    //regex to remove the commas from the string
    finalstring = finalstring.replace(/,/g, ' ');
    alert(finalstring);
  }
  

  async function ProfessorRegister (){
    
    try {
      await connectwithcontract.Professors_Registeration();
     } 
     catch (error) {
      var error = error.data.message;
      RetrieveExactErrorFromSolidity(error);
    }
  }

  async function StudentRegister (){
    
    try {
      await connectwithcontract.Students_Registeration();
     } 
     catch (error) {
      var error = error.data.message;
      RetrieveExactErrorFromSolidity(error);
    }
  }

  async function ProfessorsAssignTasksToStudents(){
    const studentaddress = document.getElementById('studentaddress').value;
    const taskdescription = document.getElementById('taskdescription').value;
    try {
      await connectwithcontract.AssignTaskToStudent(studentaddress,taskdescription);
     } 
     catch (error) {
      var error = error.data.message;
      RetrieveExactErrorFromSolidity(error);
    }

  }

  async function GetRegisteredStudents(){
    
    try {
      var students = await connectwithcontract.GetRegisteredStudents();
      var returnedstudents = students.toString();
      sets2("The registerd students are: ");
      setregisteredstudents(returnedstudents);

     } 
     catch (error) {
      var error = error.data.message;
      console.log(error);
      RetrieveExactErrorFromSolidity(error);
    }

  }

  async function StudentGetHisAssignedTasks(){
    
    try {
      var mytasks = await connectwithcontract.GetMyTasks();
      let tasksss = mytasks.toString();
      sets1("Your tasks are: ");
      settasks(tasksss);

     } 
     catch (error) {
      var error = error.data.message;
      RetrieveExactErrorFromSolidity(error);
    }

  }

  async function FireProfessor(){
    const professoraddress = document.getElementById('fireprofessor').value;

    try {
      await connectwithcontract.FireProfessor(professoraddress);
     }
     catch (error) {
      var error = error.data.message;
      RetrieveExactErrorFromSolidity(error);
    }

  }

  async function GetRegisteredProfessors(){
    
    try {
      var professors = await connectwithcontract.GetRegisteredProfessors();
      var returnedprofessors = professors.toString();
      sets3("The registerd professors are: ");
      setregisteredprofessors(returnedprofessors);

     } 
     catch (error) {
      var error = error.data.message;
      console.log(error);
      RetrieveExactErrorFromSolidity(error);
    }

  }



  
  


  return (
    <div className="App">
     <div id='welcomepage'> 
      <h1>Welcome to our decentralized university system</h1>
      <button id='connectwallet' onClick={() => {connectwallet();}}> Connect Wallet</button> <br></br>
      <h3>{WalletAddress}</h3>
      <br></br> 
      <button id='registerprofessor' onClick={()=> {connectcontract(); ProfessorRegister();}}> Register Professor </button>
      <button id='registerstudent' onClick={()=> {connectcontract(); StudentRegister();}}> Register Student</button>
      <br></br><br></br> 
      </div>


      <div id='professorpage'> 
      <h1>Professors assign tasks to students</h1>
      <label for="studentaddress" id= "studentaddresslabel">Student address</label>
      <input type="text" id="studentaddress"></input>
      <br></br> 
      <br></br> 
      <label for="taskdescription" id= "taskdescriptionlabel">Task description</label>
      <input type="text" id="taskdescription"></input>
      <br></br><br></br> 
      <button id='assigntask' onClick={()=> {connectcontract(); ProfessorsAssignTasksToStudents();}}> Assign task </button>
      <br></br> <br></br>
      <button id='getstudents' onClick={()=> {connectcontract(); GetRegisteredStudents();}} > Get Students</button>
      <h3>{s2}</h3>
      <h3>{registeredstudents}</h3>
      <br></br><br></br> <br></br>
      </div>
     

      <div id='studentpage'> 
      <h1> Students retrieve the assigned tasks</h1>
      <button id='getmytasks' onClick={()=> {connectcontract(); StudentGetHisAssignedTasks();}}> Get tasks </button>
      <br></br>
      <h3>{s1}</h3>
      <h3>{tasks}</h3>
      <br></br>
      </div>

      <div id='ownerpage'> 
      <h1> Smart contract owner functionalities</h1>
      <label for="fireprofessor" id= "professoraddresslabel">Professor address</label>
      <input type="text" id="fireprofessor"></input>
      <br></br><br></br> 
      <button id='fireprofessorbutton' onClick={()=> {connectcontract(); FireProfessor();}}> Fire professor </button>
      <br></br> <br></br>
      <button id='getprofessors' onClick={()=> {connectcontract(); GetRegisteredProfessors();}}> Get Professors</button>
      <h3>{s3}</h3>
      <h3>{registeredprofessors}</h3>
      <br></br><br></br> 

      </div>
     
    </div>
  );
}

export default App;
