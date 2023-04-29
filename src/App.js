import { useState,useEffect } from "react"

const App = ()=> {
const [message, setMessage] = useState("")
const [value,setValue] = useState("")
const [previousChat,setPreviousChat] = useState([])
const [currentTitle,setCurrentTitle] = useState("")



const createNewChat = ()=>{
  setMessage(null)
  setValue("")
  setCurrentTitle("")
}

const handleClick = (uniqueTitle)=>{
setCurrentTitle(uniqueTitle)
setMessage(null)
setValue("")

}

  const getMessages  = async()=>{
console.log("clicked")
    const options = {
      method:"POST",
      body:JSON.stringify({
        message:value
      }),
      headers:{
        "Content-Type":"application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:8000/completions",options)
      const data = await response.json()
      setMessage(data.choices[0].message)
   
      
    } catch (error) {
      console.error(error)
    }
  }
console.log(message)

useEffect(()=>{
console.log(currentTitle,value,message)
if(!currentTitle && value && message){
  setCurrentTitle(value)
}
if(currentTitle&&value&&message){
  setPreviousChat(prevchats=>(
    [...prevchats,{
title:currentTitle,
role:"user",
content:value
    },{
      title:currentTitle,
role:message.role,
content:message.content,
    }
  ]
  ))
}
},[message,currentTitle])
console.log(previousChat)

const currentChat = previousChat.filter(previousChat=>previousChat.title===currentTitle)
const uniqueTitles = Array.from(new Set(previousChat.map(previousChat=>previousChat.title)))
console.log(uniqueTitles)

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {
            uniqueTitles?.map((uniqueTitle,index)=><li onClick={()=>handleClick(uniqueTitle)} key = {index}>{uniqueTitle}</li>)
          }
        </ul>
        <nav>
          <p>Made by Ashutosh</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle &&<h1>AshuGPT</h1>}
        <ul className="feed">
{currentChat?.map((chatmessage,index)=><li key = {index}>
  <p className="role">{chatmessage.role}</p>
  <p>{chatmessage.content}</p>
</li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input  value={value} onChange={(e)=>setValue(e.target.value)}/>
            <div onClick={getMessages} id="submit">➢</div>
          </div>
          <p className="info">
          We’ve trained a model called ChatGPT which interacts in a conversational way. 
          The dialogue format makes it possible for ChatGPT to answer 
          followup questions, admit its mistakes, challenge incorrect premises, 
          and reject inappropriate requests.
          </p>
        </div>
      </section>

    </div>
  );
}

export default App;
