import React from 'react'
import { askChatGPT } from '@/actions/chat'

const TestPage = async () => {
    const response = await askChatGPT("What is the capital of France?");
    console.log(response);

  return (
    <div>
        <h1>TestPage</h1>
         <p>{ response }</p>
    </div>
  )
}

export default TestPage