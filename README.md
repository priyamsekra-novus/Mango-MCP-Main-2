# MongoDB MCP Integration with Agno OpenAI Agent

This project demonstrates how to integrate the MongoDB Model Context Protocol (MCP) server with an Agno OpenAI agent, enabling natural language interactions with MongoDB databases.

## Overview

The integration allows you to:
- Query MongoDB databases using natural language
- Analyze collection schemas and data structures
- Perform aggregations and data analysis
- List databases, collections, and indexes
- Optionally perform write operations (insert, update, delete)

## Prerequisites

- **Python 3.8+**
- **Node.js** (for running the MongoDB MCP server via `npx`)
- **MongoDB** (local instance or MongoDB Atlas cluster)
- **OpenAI API Key**

## Installation

1. **Clone or download this project**

2. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```powershell
   cp .env.example .env
   ```

   Edit `.env` with your actual values:
   - `MDB_MCP_CONNECTION_STRING`: Your MongoDB connection string
   - `OPENAI_API_KEY`: Your OpenAI API key

## Configuration Options

### Option 1: MongoDB Connection String

Use a direct connection string to connect to any MongoDB instance (local or Atlas):

```env
MDB_MCP_CONNECTION_STRING=mongodb://localhost:27017/myDatabase
```

For MongoDB Atlas:
```env
MDB_MCP_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Option 2: Atlas API Credentials

Use Atlas Service Account credentials for advanced Atlas management:

```env
MDB_MCP_API_CLIENT_ID=your-client-id
MDB_MCP_API_CLIENT_SECRET=your-client-secret
```

## Usage

### Basic Example

Run the default example:
```powershell
python app.py
```

### Custom Queries

Modify the `__main__` section in `app.py` to run custom queries:

```python
# Query databases
asyncio.run(run_mongodb_agent("List all databases and their collections"))

# Analyze schema
asyncio.run(run_mongodb_agent("Show me the schema of the 'users' collection"))

# Query data
asyncio.run(run_mongodb_agent("Find the top 5 users by age"))
```

## Available Functions

### 1. `run_mongodb_agent(message)`
Basic MongoDB agent with read-only access using connection string.

```python
asyncio.run(run_mongodb_agent("List all collections in myDatabase"))
```

### 2. `run_mongodb_agent_with_atlas_api(message)`
MongoDB agent using Atlas API credentials for cluster management.

```python
asyncio.run(run_mongodb_agent_with_atlas_api("List all my Atlas clusters"))
```

### 3. `run_mongodb_agent_with_context_manager(message)`
Uses async context manager for automatic connection management.

```python
asyncio.run(run_mongodb_agent_with_context_manager("How many documents are in each collection?"))
```

### 4. `run_mongodb_agent_with_write_access(message)`
⚠️ **Use with caution!** Enables write operations (insert, update, delete).

```python
asyncio.run(run_mongodb_agent_with_write_access("Insert a test document"))
```

## Key Integration Pattern

The integration follows this pattern:

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.mcp import MCPTools

# 1. Initialize MongoDB MCP Tools
mcp_tools = MCPTools(
    command="npx -y mongodb-mcp-server@latest --readOnly",
    env={"MDB_MCP_CONNECTION_STRING": connection_string}
)

# 2. Connect to MCP server
await mcp_tools.connect()

try:
    # 3. Create Agno Agent with OpenAI model
    agent = Agent(
        name="MongoDB Assistant",
        model=OpenAIChat(id="gpt-4o-mini"),
        tools=[mcp_tools],
        instructions="You are a MongoDB database assistant...",
        markdown=True,
    )
    
    # 4. Run the agent
    await agent.aprint_response(message, stream=True)
    
finally:
    # 5. Always close the connection
    await mcp_tools.close()
```

## Security Best Practices

1. **Read-Only by Default**: The `--readOnly` flag is included by default for safety
2. **Environment Variables**: Store sensitive credentials in `.env` file (never commit to git)
3. **Minimal Permissions**: When using Atlas API, assign only required permissions
4. **Confirmation for Writes**: The write-enabled agent asks for confirmation before destructive operations

## MongoDB MCP Server Options

Common configuration options:

- `--readOnly`: Enable read-only mode (recommended for safety)
- `--maxDocumentsPerQuery 100`: Limit documents returned per query
- `--maxBytesPerQuery 16777216`: Limit bytes per query
- `--loggers disk,mcp`: Configure logging destinations

See [MongoDB MCP Server documentation](https://github.com/mongodb-js/mongodb-mcp-server) for all options.

## Troubleshooting

### Connection Issues

1. **Verify MongoDB is running:**
   ```powershell
   # For local MongoDB
   mongosh mongodb://localhost:27017
   ```

2. **Check connection string format:**
   - Local: `mongodb://localhost:27017/database`
   - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/database`

### Node.js/npx Issues

Ensure Node.js is installed:
```powershell
node --version
npx --version
```

### OpenAI API Issues

Verify your API key is set:
```powershell
echo $env:OPENAI_API_KEY
```

## Resources

- [Agno Documentation](https://docs.agno.com/)
- [Agno MCP Overview](https://docs.agno.com/concepts/tools/mcp/overview)
- [MongoDB MCP Server](https://github.com/mongodb-js/mongodb-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

## Examples

### Example 1: List Databases
```python
asyncio.run(run_mongodb_agent("List all databases"))
```

### Example 2: Schema Analysis
```python
asyncio.run(run_mongodb_agent("Analyze the schema of the users collection"))
```

### Example 3: Data Aggregation
```python
asyncio.run(run_mongodb_agent("Show me the average age by country in the users collection"))
```

### Example 4: Index Information
```python
asyncio.run(run_mongodb_agent("List all indexes on the products collection"))
```

## License

MIT License - feel free to use and modify as needed.
