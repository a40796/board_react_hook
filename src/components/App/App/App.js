import React ,{useState,useEffect} from 'react';
import styled from 'styled-components';

const API_ENDPOINT = 'https://student-json-api.lidemy.me/comments'

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-family: "monospace", "微軟正黑體";
  box-shadow: 0px 0px 16px rgb(199, 197, 197);
  border-radius: 8px;
  padding: 12px 28px;
  color: #6c6c6c;
  box-sizing: border-box;

`
const Title =styled.h1`
  text-align: center;
   color: #333;
`
const MessageForm = styled.form`
   margin-top: 16px;
`
const MessageTextArea = styled.textarea`
     border: 1px solid black;
     width: 100%;
     height: 30vh;
`
const SubmitButton = styled.button`
   margin-top: 8px;
  color: #ddd;
  background-color: #343a40;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 16px;
  padding: 6px 12px;
`
const MessageList = styled.div`
   margin-top: 16px;
`

const MessageContainer =styled.div`
      border: 1px solid black;
      padding: 5px;
      border-radius: 5px;
      &+&{
          margin-top: 8px;
      }
`
const MessageHead =styled.div`
     display: flex;
     align-items: center;
     justify-content: space-between;
     border-bottom: 1px solid rgba(0,0,0,.3);
     padding-bottom: 5px;
`
const MessageAuthor =styled.div`
      color: rgba(23,78,55,0.3);
`
const MessageTime =styled.div`

`
const MessageDeleteBtn=styled.button`
      width: 6vw;
      height: 3vh;
`
const MessageBody =styled.div`
     margin-top: 16px;
     font-size: 16px;
`
const ErrorMessage = styled.div `
     margin-top: 30px;
     color: red;

`


function Message({author,time,children,handleDeleteMessage,item}){
    return(
        <MessageContainer>
            <MessageHead>
                <MessageAuthor>{author}</MessageAuthor>
                <MessageTime>{time}</MessageTime>
                <MessageDeleteBtn onClick={()=>{
                    handleDeleteMessage(item.id)
                }} >DELETE</MessageDeleteBtn>
            </MessageHead>
            <MessageBody>{children}</MessageBody>
        </MessageContainer>
    )
}


const App = () => {
    const [messages,setMessages]=useState([]);
    const [messageApiError,setApiError]=useState(null);
    const [value,setValue]=useState('');
    const [postMessageError,setPostMessageError] = useState();
    const [isRequestPosstMsg,setIsRequestPosstMsg] = useState(false);

    const fetchMessages = ()=>{
        fetch(API_ENDPOINT)
        .then((res) =>res.json())
        .then((data) =>{
           setMessages(data)
        })
        .catch((err) =>{
           setApiError(err.Message)
        })
    }
  
    useEffect(()=>{
        fetchMessages()
    },[])

    const handleChange =(e)=>{
        setValue(e.target.value)
    }
    const handleFormSubmit =(e)=>{
         e.preventDefault();
         fetch('https://student-json-api.lidemy.me/comments',{
            method:'POST',
            headers:{
                "content-type":"application/json",
            },
            body:JSON.stringify({
                nickname:'albert',
                body:value,
            })
        })
        .then((res)=>res.json())
        .then((data)=>{
            if(data.ok === 0){
                setPostMessageError(data.Message);
                return
            }
             fetchMessages()
        });  
    }
    useEffect(()=>{
        fetchMessages()
    },[])

    const handleTextareaFocus =()=>{
        setPostMessageError(null)
    }

    const handleDeleteMessage =(id)=>{
         fetch('https://student-json-api.lidemy.me/comments/'+ id,{
             methods:'DELETE',
         })
         .then((res)=>res.json())
         .then(()=>{
            setMessages(messages.filter((message)=>message.id !== id));
         })
         .catch((err)=>{
             console.log(err);
         })
    }

    return (
        <Page>
           <Title>留言板</Title>
           <MessageForm onSubmit={handleFormSubmit} >
               <MessageTextArea value={value} onFocus={handleTextareaFocus} onChange={handleChange} rows={10} />
               <SubmitButton>送出留言</SubmitButton>
               {postMessageError && <ErrorMessage>{postMessageError}</ErrorMessage> }
           </MessageForm>
           {messageApiError && (
               <ErrorMessage>
                   Something went wrong. {messageApiError.toString()}
               </ErrorMessage>
               
           )}
           <MessageList>
                {
                    messages.map(function(item){
                          return (
                            <Message key={item.id} author={item.nickname} time={item.createdAt} handleDeleteMessage={handleDeleteMessage} item={item} >
                             {item.body}
                            </Message>
                          )
                    })
                }              
           </MessageList>
        </Page>
    )
}

export default App
