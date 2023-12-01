import os
import openai
import tiktoken
import pinecone  
import langchain
from dotenv import load_dotenv 
from langchain.chains import RetrievalQA, LLMChain
from langchain.vectorstores import Pinecone 
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun
from langchain.agents import AgentExecutor, Tool
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import ConversationBufferMemory, ReadOnlySharedMemory

def config():
    load_dotenv()

config()
llm = ChatOpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"), 
                 temperature=0.0, 
                 model_name='gpt-4-1106-preview')

tiktoken.encoding_for_model('gpt-4-1106-preview')

tokenizer = tiktoken.get_encoding('cl100k_base')

def tiktoken_len(text):
    tokens = tokenizer.encode(
        text,
        disallowed_special=()
    )
    return len(tokens)

model_name = 'text-embedding-ada-002'

embed = OpenAIEmbeddings(
    model=model_name,
    openai_api_key=openai.api_key
)

example_texts = [
    'this is the first chunk of text',
    'then another second chunk of text is here'
]

res = embed.embed_documents(example_texts)
len(res), len(res[0])

index_name = "kegg-medicus-database-index"

pinecone.init(      
	api_key=os.getenv("PINECONE_API_KEY"),      
	environment=os.getenv("PINECONE_ENV")     
)      
index = pinecone.Index('kegg-medicus-database-index')

text_field = "text"

# switch back to normal index for langchain
index = pinecone.Index(index_name)

vectorstore = Pinecone(
    index=index, 
    embedding=embed, #.embed_query(), 
    text_key=text_field
)

# vectore database
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# websearch powered by DuckDuckGo
search = DuckDuckGoSearchRun()
def duck_wrapper(input_text):
    try:
        search_results = search.run(f'''site:medlineplus.gov {input_text}''') 
    except Exception as er:
        print(er)
        return "There was an error fetching results for that query. Please try again"
    # print(search_results)
    else:
        return search_results

# conversation summary tool
mem_template = """This is a conversation between a human and a bot:

{chat_history}

Write a summary of the conversation for {input}:
"""

mem_prompt = PromptTemplate(input_variables=["input", "chat_history"], template=mem_template)
memory = ConversationBufferMemory(memory_key="chat_history")
readonlymemory = ReadOnlySharedMemory(memory=memory)
summary_chain = LLMChain(
    llm=llm,
    prompt=mem_prompt,
    verbose=True,
    memory=readonlymemory,  # use the read-only memory to prevent the tool from modifying the memory
)

# tool objects list for agent
tools = [
    Tool(
        name='Medicus Text Base',
        func=qa.run,
        description=(
            '''use this tool to respond to queries about drugs (medicine) and drugs interactions for (contraindications (CI) and precautions (P)),
            disease and the human genome'''
        )
    ), 
    Tool(
        name ='Web Search',
        func=duck_wrapper,
        description=(
            '''use this tool to answer more general questions about health and wellness
            '''
        )
    ),
    Tool(
        name="Summary",
        func=summary_chain.run,
        description="useful for when you summarize a conversation. The input to this tool should be a string, representing who will read this summary.",
    )
]

tool_names = [tool.name for tool in tools]

# initialization of zero shot agent prompt template
from langchain.agents import ZeroShotAgent

prefix = """Act as an expert medical advisor. Answering question as best as YOU can. 
You have access to the following tools:"""

suffix = """Begin!"

{chat_history}
Question: {input}
{agent_scratchpad}"""

prompt = ZeroShotAgent.create_prompt(
    tools,
    prefix=prefix,
    suffix=suffix,
    input_variables=["input", "chat_history", "agent_scratchpad"],
)

#  initializing zeroshot agent chain
llm_chain = LLMChain(llm=llm, prompt=prompt)
agent = ZeroShotAgent(llm_chain=llm_chain, tools=tools, verbose=True)

agent_chain = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True, memory=memory
)

def get_response(input):
    return agent_chain(input)
langchain.debug = False

