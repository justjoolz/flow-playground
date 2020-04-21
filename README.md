# Welcome
The Flow Playground is the best way to learn and try Cadence, for newcomers to Flow

## Philosophy

### How It's Built
We built the Flow Playground as a static website or typical "JAM stack" website because of these properties: 

- Portability. It is weasy to move a static website GUI between platforms if desired
- We want to have the ability to deploy the Playground on peer-tp-peer networks like IPFS or DAT
- Fast build and deploy cycles 
- We want to maximize the amount of potential contributions

### What Is the Playground?
We want the Playground to have features that help you build on Flow. We also want to balance functionality with learning. 
The Playground is a learning tool first and an awesome development tool second, although the two go hand-in-hand.

##Contributing
Help us build. If you are interested in contributing, it's easy. Read this first.

#Developing

###Pre-requisites
You'll need to have Docker installed to develop.

## Installation

Clone the repo 
```shell script
git clone git@github.com:onflow/flow-playground.git
```

Install dependencies and generate TypeScript types for the GraphQL schema
```
yarn && yarn graphql:codegen
```

Start the API (Flow Emulator and services)
```
docker run -e FLOW_DEBUG=true -e FLOW_SESSIONCOOKIESSECURE=false -p 8080:8080 gcr.io/dl-flow/playground-api:latest
```

Start the React app
```
yarn start
```

**Visit localhost:3000**

If you are using VSCode, you can add this debugging config
```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "chrome",
      "request": "launch",
      "port": 9229,
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*",
        "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///*": "*"
      },
      "trace": true
    }
  ]
}
```






